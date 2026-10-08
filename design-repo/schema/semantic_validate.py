#!/usr/bin/env python3
"""Semantic validator for Transform9 PageSpecs.

Enforces everything JSON Schema (Draft-07) cannot express, on top of schema/pagespec.schema.json:

  * the declared template is cross-referenced against that template's REAL node list
    (templates/templates.json): missing required nodes, extra nodes, duplicates, order;
  * route <-> template assignment (templates/routes.json), per-route variant rules;
  * per-section constraints from sections/*.json (allowedTemplates, allowedRoutes, position rules);
  * the rhythm rules in compatibility/graph.json, respecting each rule's severity;
  * required reducedMotionFallback + closed motion pattern set per section;
  * maxWords budgets (a custom keyword in the schema, enforced here on every text field);
  * asset-role policy (schema/closed enum + assets/asset-roles.json ref kinds per usage context);
  * claimsPolicy: sections that assert real-world claims are rejected for generated derivatives.

Every rule id in compatibility/graph.json must be implemented in RULES below; extraction/verify_all.py
fails if the two sets drift.

Usage:  python3 schema/semantic_validate.py [pagespec.json ...]   (default: schema/example.pagespec.json)
Exit code 1 if any error-severity issue is found.
The repo root is derived from this file's location; no absolute paths are used.
"""
import glob
import json
import os
import re
import sys

from jsonschema import Draft7Validator, validators
from jsonschema.exceptions import ValidationError

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# --------------------------------------------------------------------------- word counting
def normalize(s):
    """Source copy carries invisible characters; they are whitespace for budgeting purposes."""
    return s.replace(' ', ' ').replace(' ', ' ').replace('​', '').replace('‍', '')


def words(s):
    return len(normalize(s).split())


def text_of(v):
    if isinstance(v, str):
        return v
    if isinstance(v, list):
        return ' '.join(text_of(x) for x in v)
    if isinstance(v, dict):
        return text_of(v.get('text', ''))
    return ''


def _max_words(validator, limit, instance, schema):
    if isinstance(instance, (str, list)):
        n = words(text_of(instance))
        if n > limit:
            yield ValidationError('%d words exceeds maxWords %d' % (n, limit))


T9Validator = validators.extend(Draft7Validator, {'maxWords': _max_words})


# --------------------------------------------------------------------------- repo loading
def _read(root, rel):
    with open(os.path.join(root, rel), encoding='utf-8') as f:
        return json.load(f)


_REPO_CACHE = {}


def load_repo(root=ROOT):
    if root in _REPO_CACHE:
        return _REPO_CACHE[root]
    sections = {}
    for p in sorted(glob.glob(os.path.join(root, 'sections', '*.json'))):
        with open(p, encoding='utf-8') as f:
            d = json.load(f)
        sections[d['id']] = d
    tj = _read(root, 'templates/templates.json')
    repo = {
        'root': root,
        'schema': _read(root, 'schema/pagespec.schema.json'),
        'sections': sections,
        'templates': {t['id']: t for t in tj['templates']},
        'routes': {r['path']: r for r in _read(root, 'templates/routes.json')['routes']},
        'graph': {r['id']: r for r in _read(root, 'compatibility/graph.json')['rules']},
        'assets': _read(root, 'assets/asset-roles.json'),
    }
    _REPO_CACHE[root] = repo
    return repo


def issue(code, severity, path, message):
    return {'code': code, 'severity': severity, 'path': path, 'message': message}


# --------------------------------------------------------------------------- schema layer
def _flatten(err):
    """Yield (validator, error) leaves; descend into oneOf/anyOf contexts, preferring maxWords leaves."""
    if err.validator in ('oneOf', 'anyOf') and err.context:
        leaves = []
        for c in err.context:
            leaves.extend(_flatten(c))
        mw = [l for l in leaves if l[0] == 'maxWords']
        return mw if mw else [(err.validator, err)]
    return [(err.validator, err)]


def schema_errors(spec, repo=None, strict_draft7=False):
    """Schema-layer errors as issue dicts. strict_draft7=True uses the pure Draft7Validator
    (maxWords ignored as an unknown keyword); otherwise the maxWords-aware validator."""
    repo = repo or load_repo()
    cls = Draft7Validator if strict_draft7 else T9Validator
    out, seen = [], set()
    for err in sorted(cls(repo['schema']).iter_errors(spec), key=lambda e: [str(p) for p in e.absolute_path]):
        for kind, leaf in _flatten(err):
            path = '/'.join(str(p) for p in leaf.absolute_path)
            kind = kind or 'false'
            code = 'MAXWORDS_EXCEEDED' if kind == 'maxWords' else 'SCHEMA_' + kind.upper()
            key = (code, path, leaf.message)
            if key in seen:
                continue
            seen.add(key)
            out.append(issue(code, 'error', path, leaf.message[:240]))
    return out


# --------------------------------------------------------------------------- helpers
def _walk_assets(value, path=''):
    if isinstance(value, dict):
        if 'assetRole' in value and 'assetRef' in value:
            yield path, value
        for k, v in value.items():
            yield from _walk_assets(v, '%s/%s' % (path, k))
    elif isinstance(value, list):
        for i, v in enumerate(value):
            yield from _walk_assets(v, '%s/%d' % (path, i))


def _ref_kind(ref, kinds):
    for kind, spec in kinds.items():
        if re.match(spec['pattern'], ref or ''):
            return kind
    return None


def _content_keys(content):
    return set(content.keys()) if isinstance(content, dict) else set()


# --------------------------------------------------------------------------- graph rules
# Each rule: fn(ctx) -> list of message strings. ctx: seq, tid, contracts, rule (graph entry), usage.
def r_shell_order(ctx):
    seq, m = ctx['seq'], []
    head = ['shell.page-layers', 'shell.navbar', 'shell.mobile-menu']
    if seq[:3] != head:
        m.append('first three nodes must be %s, found %s' % (head, seq[:3]))
    if 'shell.preloader' in seq and (len(seq) < 4 or seq[3] != 'shell.preloader'):
        m.append('shell.preloader must be the fourth node')
    if 'shell.bg-pixels-overlay' in seq:
        if 'shell.preloader' not in seq or seq.index('shell.bg-pixels-overlay') != seq.index('shell.preloader') + 1:
            m.append('shell.bg-pixels-overlay must immediately follow shell.preloader')
    return m


def r_one_hero(ctx):
    seq, c = ctx['seq'], ctx['contracts']
    heroes = [s for s in seq if c.get(s, {}).get('category') == 'HERO']
    exempt = set(t for e in ctx['rule'].get('exceptions', []) for t in e.get('templates', []))
    if ctx['tid'] in exempt:
        if heroes:
            return ['template %s is hero-less but has hero sections %s' % (ctx['tid'], heroes)]
        if not any(s in seq for s in ('content.post-header', 'content.case-header')):
            return ['hero-less template needs a content header section']
        return []
    if len(heroes) != 1:
        return ['expected exactly one HERO section, found %d: %s' % (len(heroes), heroes)]
    return []


def r_footer_bottom_last(ctx):
    seq = ctx['seq']
    if 'shell.footer-bottom-reveal' not in seq:
        return []
    i = seq.index('shell.footer-bottom-reveal')
    allowed = set(s for e in ctx['rule'].get('exceptions', []) for s in e.get('sections', []))
    m = ['%s may not follow shell.footer-bottom-reveal' % s for s in seq[i + 1:] if s not in allowed]
    if 'shell.footer' in seq and seq.index('shell.footer') != i - 1:
        m.append('shell.footer must immediately precede shell.footer-bottom-reveal')
    return m


def r_modal_needs_link(ctx):
    seq = ctx['seq']
    if 'shell.call-alex-modal' in seq and not any(s in seq for s in ('hero.home', 'conversion.cta')):
        return ['shell.call-alex-modal needs hero.home or conversion.cta (a Call Alex link)']
    return []


def r_cta_link_needs_modal(ctx):
    seq = ctx['seq']
    if 'conversion.cta' in seq and 'shell.call-alex-modal' not in seq:
        return ['conversion.cta Call Alex link is inert without shell.call-alex-modal (known gap, see templates.json knownGaps)']
    return []


def r_transition_pair(ctx):
    seq = ctx['seq']
    a, b = 'transition.black-to-white', 'transition.white-to-black'
    if a in seq or b in seq:
        if not (a in seq and b in seq):
            return ['%s and %s must appear together' % (a, b)]
        if seq.index(a) > seq.index(b):
            return ['%s must precede %s' % (a, b)]
    return []


def r_no_consecutive_transitions(ctx):
    seq = ctx['seq']
    return ['adjacent transitions: %s, %s' % (x, y) for x, y in zip(seq, seq[1:]) if x.startswith('transition.') and y.startswith('transition.')]


def r_light_bracket(ctx):
    seq, c = ctx['seq'], ctx['contracts']
    a, b = 'transition.black-to-white', 'transition.white-to-black'
    lo = seq.index(a) if a in seq else None
    hi = seq.index(b) if b in seq else None
    m = []
    for k, s in enumerate(seq):
        light = c.get(s, {}).get('surface') == 'light'
        inside = lo is not None and hi is not None and lo < k < hi
        if light and not inside:
            m.append('%s has a light surface but lies outside the black-to-white / white-to-black bracket' % s)
        if inside and not light:
            m.append('%s lies inside the white bracket but is not a light-surface section' % s)
    return m


def r_read_next_only(ctx):
    seq = ctx['seq']
    if 'content.read-next' in seq and 'content.case-header' not in seq:
        return ['content.read-next requires content.case-header']
    return []


def r_no_cta_on_form_or_legal(ctx):
    seq = ctx['seq']
    if 'conversion.cta' in seq and any(s in seq for s in ('hero.book-a-demo', 'legal.content')):
        return ['conversion.cta does not accompany hero.book-a-demo / legal.content on the real pages']
    return []


def r_no_adjacent_same_category(ctx):
    seq, c = ctx['seq'], ctx['contracts']
    exempt = set(cat for e in ctx['rule'].get('exceptions', []) for cat in e.get('categories', []))
    m = []
    for x, y in zip(seq, seq[1:]):
        cx, cy = c.get(x, {}).get('category'), c.get(y, {}).get('category')
        if cx and cx == cy and cx not in exempt:
            m.append('adjacent %s sections: %s, %s' % (cx, x, y))
    return m


RULES = {
    'SHELL_ORDER': r_shell_order,
    'ONE_HERO_PER_PAGE': r_one_hero,
    'FOOTER_BOTTOM_LAST': r_footer_bottom_last,
    'MODAL_NEEDS_CALL_LINK': r_modal_needs_link,
    'CTA_CALL_LINK_NEEDS_MODAL': r_cta_link_needs_modal,
    'TRANSITION_PAIR_ORDER': r_transition_pair,
    'NO_CONSECUTIVE_TRANSITIONS': r_no_consecutive_transitions,
    'LIGHT_SURFACE_BRACKET': r_light_bracket,
    'READ_NEXT_CASE_STUDY_ONLY': r_read_next_only,
    'NO_CTA_ON_FORM_OR_LEGAL': r_no_cta_on_form_or_legal,
    'NO_ADJACENT_SAME_CATEGORY': r_no_adjacent_same_category,
}


# --------------------------------------------------------------------------- semantic layer
def semantic_issues(spec, repo=None):
    repo = repo or load_repo()
    out = []
    contracts, templates, routes = repo['sections'], repo['templates'], repo['routes']
    if not isinstance(spec, dict) or not isinstance(spec.get('nodes'), list):
        return out
    nodes = [n for n in spec['nodes'] if isinstance(n, dict) and isinstance(n.get('section'), str)]
    seq = [n['section'] for n in nodes]
    tid, route, usage = spec.get('template'), spec.get('route'), spec.get('usage')
    tpl = templates.get(tid)

    # route <-> template
    r = routes.get(route)
    if route is not None and r is None:
        out.append(issue('ROUTE_UNKNOWN', 'error', 'route', 'route %r is not one of the %d in-scope routes' % (route, len(routes))))
    elif r is not None and r['template'] != tid:
        out.append(issue('ROUTE_TEMPLATE_MISMATCH', 'error', 'route', 'route %s belongs to %s, spec declares %s' % (route, r['template'], tid)))

    # template node list (the declared template's REAL node list)
    if tpl is not None:
        tn = [n['section'] for n in tpl['nodes']]
        for n in tpl['nodes']:
            if n['required'] and n['section'] not in seq:
                out.append(issue('TEMPLATE_MISSING_REQUIRED', 'error', 'nodes', 'template %s requires %s' % (tid, n['section'])))
        for s in seq:
            if s not in tn:
                out.append(issue('TEMPLATE_EXTRA_SECTION', 'error', 'nodes', '%s is not in the node list of %s' % (s, tid)))
        for n in tpl['nodes']:
            if not n['repeatable'] and seq.count(n['section']) > 1:
                out.append(issue('TEMPLATE_DUPLICATE_SECTION', 'error', 'nodes', '%s appears %d times but is not repeatable' % (n['section'], seq.count(n['section']))))
        known = []
        for s in seq:
            if s in tn and s not in known:
                known.append(s)
        want = [s for s in tn if s in known]
        if known != want:
            out.append(issue('TEMPLATE_ORDER_MISMATCH', 'error', 'nodes', 'node order %s differs from template order %s' % (known, want)))
        # template shell flags <-> nodes
        sh = tpl['shell']
        flags = [('preloader', 'shell.preloader', sh['preloader']), ('modal', 'shell.call-alex-modal', sh['modal']), ('footer', 'shell.footer', sh['footer'] == 'full')]
        for name, sec, expected in flags:
            if (sec in seq) != expected:
                out.append(issue('TEMPLATE_FLAG_MISMATCH', 'error', 'nodes', 'template %s has %s=%s but node %s is %s' % (tid, name, sh[name], sec, 'present' if sec in seq else 'absent')))

    # per-section constraints
    for i, n in enumerate(nodes):
        s = n['section']
        c = contracts.get(s)
        if c is None:
            continue
        cons = c['constraints']
        path = 'nodes/%d' % i
        if tid not in cons['allowedTemplates']:
            out.append(issue('SECTION_TEMPLATE_NOT_ALLOWED', 'error', path, '%s is not allowed in %s' % (s, tid)))
        if 'allowedRoutes' in cons and route not in cons['allowedRoutes']:
            out.append(issue('SECTION_ROUTE_NOT_ALLOWED', 'error', path, '%s is only allowed on %s, spec route is %s' % (s, cons['allowedRoutes'], route)))
        if seq.count(s) > cons['maxPerPage'] and seq.index(s) == i:
            out.append(issue('MAX_PER_PAGE', 'error', path, '%s appears %d times (max %d)' % (s, seq.count(s), cons['maxPerPage'])))
        if cons.get('mustBeFirst') and i != 0:
            out.append(issue('MUST_BE_FIRST', 'error', path, '%s must be the first node' % s))
        if cons.get('mustFollowNav') and (i == 0 or seq[i - 1] != 'shell.navbar'):
            out.append(issue('MUST_FOLLOW_NAV', 'error', path, '%s must immediately follow shell.navbar' % s))
        if cons.get('mustPrecedeFooter') and 'shell.footer' in seq and (i + 1 >= len(seq) or seq[i + 1] != 'shell.footer'):
            out.append(issue('MUST_PRECEDE_FOOTER', 'error', path, '%s must immediately precede shell.footer' % s))
        if cons.get('mustImmediatelyFollowAnyOf') and (i == 0 or seq[i - 1] not in cons['mustImmediatelyFollowAnyOf']):
            out.append(issue('MUST_IMMEDIATELY_FOLLOW', 'error', path, '%s must immediately follow one of %s' % (s, cons['mustImmediatelyFollowAnyOf'])))
        if cons.get('requiresAnyOf') and not any(x in seq for x in cons['requiresAnyOf']):
            out.append(issue('REQUIRES_ANY_OF', 'error', path, '%s requires one of %s' % (s, cons['requiresAnyOf'])))
        if cons.get('mustFollowSectionAnyOf') and not any(x in seq and seq.index(x) < i for x in cons['mustFollowSectionAnyOf']):
            out.append(issue('MUST_FOLLOW_SECTION', 'error', path, '%s must come after one of %s' % (s, cons['mustFollowSectionAnyOf'])))

        # variants
        variant = n.get('variant')
        content = n.get('content')
        keys = _content_keys(content)
        if variant is not None and c['variants'].get(variant):
            vr = c['variants'][variant]
            for k in vr['requires']:
                if k not in keys:
                    out.append(issue('VARIANT_REQUIRES', 'error', path, 'variant %s of %s requires content.%s' % (variant, s, k)))
            for k in vr['forbids']:
                if k in keys:
                    out.append(issue('VARIANT_FORBIDS', 'error', path, 'variant %s of %s forbids content.%s' % (variant, s, k)))
        if 'variantByRoute' in c and variant is not None and c['variantByRoute'].get(route) not in (None, variant):
            out.append(issue('VARIANT_ROUTE_MISMATCH', 'error', path, '%s on %s must use variant %s, found %s' % (s, route, c['variantByRoute'][route], variant)))
        if s == 'shell.page-layers' and tpl is not None and variant is not None:
            want = 'with-video' if tpl['shell']['video'] else 'without-video'
            if variant != want:
                out.append(issue('VARIANT_TEMPLATE_MISMATCH', 'error', path, 'template %s has video=%s so shell.page-layers must use variant %s' % (tid, tpl['shell']['video'], want)))

        # motion
        m = n.get('motion')
        if not isinstance(m, dict) or 'reducedMotionFallback' not in m:
            out.append(issue('MOTION_FALLBACK_MISSING', 'error', path + '/motion', '%s needs motion.reducedMotionFallback' % s))
        else:
            if m['reducedMotionFallback'] != c['motion']['reducedMotionFallback']:
                out.append(issue('MOTION_FALLBACK_MISMATCH', 'error', path + '/motion', '%s must use reducedMotionFallback %s' % (s, c['motion']['reducedMotionFallback'])))
            bad = [p for p in m.get('patterns', []) if p not in c['motion']['allowedPatterns']]
            if bad:
                out.append(issue('MOTION_PATTERN_NOT_ALLOWED', 'error', path + '/motion', '%s does not allow motion patterns %s' % (s, bad)))

        # claims policy
        if usage == 'generated-derivative' and c['claimsPolicy'] == 'must-not-fabricate':
            out.append(issue('CLAIMS_SECTION_IN_DERIVATIVE', 'error', path, '%s asserts real-world claims/assets (claimsPolicy must-not-fabricate) and cannot be AI-generated; use usage internal-clone with verified source data' % s))

        # asset policy
        roles = repo['assets']['roles']
        kinds = repo['assets']['refKinds']
        for apath, a in _walk_assets(content, path + '/content'):
            role = a.get('assetRole')
            if role not in roles:
                out.append(issue('ASSET_ROLE_UNKNOWN', 'error', apath, 'assetRole %r is not in the closed registry' % role))
                continue
            kind = _ref_kind(a.get('assetRef'), kinds)
            if kind is None:
                out.append(issue('ASSET_REF_INVALID', 'error', apath, 'assetRef %r matches no ref kind (%s)' % (a.get('assetRef'), ', '.join(kinds))))
                continue
            allowed = roles[role]['allowedRefKinds'].get(usage, [])
            if kind not in allowed:
                out.append(issue('ASSET_REF_KIND_FORBIDDEN', 'error', apath, 'role %s (%s) does not allow ref kind %s for usage %s (allowed: %s)' % (role, roles[role]['generationPolicy'], kind, usage, allowed)))

        # post-body slot order
        if s == 'content.post-body' and isinstance(content, dict) and isinstance(content.get('slots'), list):
            order = ['1st', 'bl-2', 'bl-3', 'bl-4', 'bl-5']
            ids = [sl.get('slot') for sl in content['slots'] if isinstance(sl, dict)]
            if ids and (ids[0] != '1st' or ids != sorted(set(ids), key=lambda x: order.index(x) if x in order else 99) or len(ids) != len(set(ids))):
                out.append(issue('SLOT_ORDER', 'error', path + '/content/slots', 'slots must be unique, in order 1st, bl-2.. and start with 1st; found %s' % ids))

    # graph rules (severity from compatibility/graph.json)
    ctx_base = {'seq': seq, 'tid': tid, 'contracts': contracts, 'usage': usage}
    for rid, fn in RULES.items():
        rule = repo['graph'].get(rid)
        if rule is None:
            continue
        for msg in fn(dict(ctx_base, rule=rule)):
            out.append(issue(rid, rule['severity'], 'nodes', msg))
    return out


def validate_pagespec(spec, repo=None):
    """Return (errors, warnings) as lists of issue dicts: schema layer + semantic layer."""
    repo = repo or load_repo()
    issues = schema_errors(spec, repo) + semantic_issues(spec, repo)
    return [i for i in issues if i['severity'] == 'error'], [i for i in issues if i['severity'] != 'error']


def main(argv):
    files = argv[1:] or [os.path.join(ROOT, 'schema', 'example.pagespec.json')]
    bad = 0
    for f in files:
        with open(f, encoding='utf-8') as fh:
            spec = json.load(fh)
        errors, warnings = validate_pagespec(spec)
        print('%s: %d error(s), %d warning(s)' % (os.path.basename(f), len(errors), len(warnings)))
        for i in errors:
            print('  ERROR   %-28s %s: %s' % (i['code'], i['path'], i['message']))
        for i in warnings:
            print('  WARN    %-28s %s: %s' % (i['code'], i['path'], i['message']))
        bad += len(errors)
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
