#!/usr/bin/env python3
"""Adversarial suite: proves every rule actually rejects a bad PageSpec, and that real structures pass.

Controls (must produce ZERO errors):
  * schema/example.pagespec.json (the real /blog/redefining-healthcare-ai instance)
  * one synthesized PageSpec per template (all 8), built from that template's own node list and
    each section contract's real `examples`, for usage internal-clone
  * generated-derivative controls for the templates that contain no real-claim sections

Mutations (each must be REJECTED, and the expected rule/schema code must be among the errors):
  schema layer, structural, rhythm (graph), variants/route, runtime (maxWords), asset policy.

Exit code 0 only if every control passes and every mutation is rejected.
The repo root is derived from this file's location (no absolute paths).
"""
import copy
import json
import os
import sys

sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(ROOT, 'schema'))
import semantic_validate as sv  # noqa: E402

REPO = sv.load_repo(ROOT)
EXAMPLE = json.load(open(os.path.join(ROOT, 'schema', 'example.pagespec.json'), encoding='utf-8'))


# --------------------------------------------------------------------------- synthesizer
def synth(schema):
    if not isinstance(schema, dict):
        return None
    if 'const' in schema:
        return copy.deepcopy(schema['const'])
    if schema.get('examples'):
        return copy.deepcopy(schema['examples'][0])
    if 'enum' in schema:
        return copy.deepcopy(schema['enum'][0])
    if 'allOf' in schema:
        for part in schema['allOf']:
            if isinstance(part, dict) and 'const' in part:
                return copy.deepcopy(part['const'])
    if 'oneOf' in schema and 'properties' not in schema:
        return synth(schema['oneOf'][0])
    t = schema.get('type')
    if t == 'object' or 'properties' in schema:
        out = {}
        for k in schema.get('required', []):
            out[k] = synth(schema['properties'][k])
        return out
    if t == 'array':
        return [synth(schema['items']) for _ in range(schema.get('minItems', 0))]
    if t == 'string':
        return 'x'
    if t == 'boolean':
        return False
    return None


def asset_ref_for(role, usage):
    pol = REPO['assets']['roles'][role]['generationPolicy']
    kinds = REPO['assets']['roles'][role]['allowedRefKinds'][usage]
    if 'reuse' in kinds:
        return '/assets/synthetic-asset.webp'
    if 'generate' in kinds:
        return 'generate:synthetic-asset'
    return 'placeholder:synthetic-asset'


def retarget_assets(value, usage):
    if isinstance(value, dict):
        if 'assetRole' in value and 'assetRef' in value:
            value['assetRef'] = asset_ref_for(value['assetRole'], usage)
        for v in value.values():
            retarget_assets(v, usage)
    elif isinstance(value, list):
        for v in value:
            retarget_assets(v, usage)


def build_spec(template_id, usage='internal-clone', route=None):
    tpl = REPO['templates'][template_id]
    route = route or tpl['routes'][0]
    nodes = []
    for n in tpl['nodes']:
        c = REPO['sections'][n['section']]
        node = {'section': n['section'], 'content': synth(c['content']),
                'motion': {'patterns': list(c['motion']['allowedPatterns']), 'reducedMotionFallback': c['motion']['reducedMotionFallback']}}
        if c['variants']:
            if n['section'] == 'shell.page-layers':
                node['variant'] = 'with-video' if tpl['shell']['video'] else 'without-video'
            elif 'variantByRoute' in c:
                node['variant'] = c['variantByRoute'][route]
            else:
                node['variant'] = list(c['variants'].keys())[0]
        if n['section'] == 'shell.page-layers':
            vr = c['variants'][node['variant']]
            for k in vr['forbids']:
                node['content'].pop(k, None)
            for k in vr['requires']:
                node['content'].setdefault(k, synth(c['content']['properties'][k]))
        nodes.append(node)
    spec = {'pageSpecVersion': '1.0.0', 'usage': usage, 'template': template_id, 'route': route, 'title': 'Sample', 'metaDescription': 'Sample description', 'nodes': nodes}
    retarget_assets(spec, usage)
    return spec


def node(spec, section):
    return next(n for n in spec['nodes'] if n['section'] == section)


def idx(spec, section):
    return [n['section'] for n in spec['nodes']].index(section)


def move(spec, section, new_index):
    n = spec['nodes'].pop(idx(spec, section))
    spec['nodes'].insert(new_index, n)


# --------------------------------------------------------------------------- mutations
M = []  # (name, base_factory, mutate_fn, expected_code)


def mut(name, base, expected):
    def deco(fn):
        M.append((name, base, fn, expected))
        return fn
    return deco


EX = lambda: copy.deepcopy(EXAMPLE)
T = lambda tid, usage='internal-clone', route=None: (lambda: build_spec(tid, usage, route))

# ---- schema layer
@mut('schema: wrong template enum value', EX, 'SCHEMA_ENUM')
def _(s): s['template'] = 'template.invented'

@mut('schema: invented section id', EX, 'SCHEMA_ENUM')
def _(s): s['nodes'][4]['section'] = 'content.invented-section'

@mut('schema: missing required content field (post-header title)', EX, 'SCHEMA_REQUIRED')
def _(s): del node(s, 'content.post-header')['content']['title']

@mut('schema: invented content field', EX, 'SCHEMA_ADDITIONALPROPERTIES')
def _(s): node(s, 'content.post-header')['content']['subtitle'] = 'extra'

@mut('schema: invented node property (style override)', EX, 'SCHEMA_ADDITIONALPROPERTIES')
def _(s): node(s, 'conversion.cta')['style'] = {'color': '#ff0000'}

@mut('schema: invented motion field (closed motion object)', EX, 'SCHEMA_ADDITIONALPROPERTIES')
def _(s): node(s, 'conversion.cta')['motion']['inventedAnimation'] = 'spin'

@mut('schema: missing reducedMotionFallback', EX, 'SCHEMA_REQUIRED')
def _(s): del node(s, 'conversion.cta')['motion']['reducedMotionFallback']

@mut('schema: missing motion on a node', EX, 'SCHEMA_REQUIRED')
def _(s): del node(s, 'shell.footer')['motion']

@mut('schema: reducedMotionFallback valid enum value but wrong for the section (const lock)', EX, 'SCHEMA_CONST')
def _(s): node(s, 'shell.navbar')['motion']['reducedMotionFallback'] = 'static-no-motion'

@mut('schema: reducedMotionFallback outside the closed enum', EX, 'SCHEMA_ENUM')
def _(s): node(s, 'shell.navbar')['motion']['reducedMotionFallback'] = 'none'

@mut('schema: invented motion pattern id', EX, 'SCHEMA_ENUM')
def _(s): node(s, 'shell.navbar')['motion']['patterns'].append('M99')

@mut('schema: real motion pattern not allowed for this section (M21 on navbar)', EX, 'MOTION_PATTERN_NOT_ALLOWED')
def _(s): node(s, 'shell.navbar')['motion']['patterns'].append('M21')

@mut('schema: invented assetRole', EX, 'SCHEMA_ENUM')
def _(s): node(s, 'content.post-header')['content']['image']['assetRole'] = 'hero.stock-photo'

@mut('schema: assetRole valid but wrong for the field (person.photo on a blog hero)', EX, 'SCHEMA_CONST')
def _(s): node(s, 'content.post-header')['content']['image']['assetRole'] = 'person.photo'

@mut('schema: invalid usage value', EX, 'SCHEMA_ENUM')
def _(s): s['usage'] = 'production'

@mut('schema: missing usage', EX, 'SCHEMA_REQUIRED')
def _(s): del s['usage']

@mut('schema: wrong pageSpecVersion', EX, 'SCHEMA_CONST')
def _(s): s['pageSpecVersion'] = '9.9.9'

@mut('schema: variant on a section that has no variants', EX, 'SCHEMA_FALSE')
def _(s): node(s, 'content.post-header')['variant'] = 'wide'

@mut('schema: wrong type (title as number)', EX, 'SCHEMA_TYPE')
def _(s): node(s, 'content.post-header')['content']['title'] = 7

@mut('schema: invalid body block type (invented h4)', EX, 'SCHEMA_ONEOF')
def _(s): node(s, 'content.post-body')['content']['slots'][0]['blocks'][0]['type'] = 'h4'

# ---- structural
@mut('structural: duplicate one-per-page section', EX, 'TEMPLATE_DUPLICATE_SECTION')
def _(s): s['nodes'].insert(5, copy.deepcopy(node(s, 'content.post-header')))

@mut('structural: duplicate section also trips maxPerPage', EX, 'MAX_PER_PAGE')
def _(s): s['nodes'].insert(5, copy.deepcopy(node(s, 'content.post-header')))

@mut('structural: removed mandatory section (conversion.cta)', EX, 'TEMPLATE_MISSING_REQUIRED')
def _(s): s['nodes'].pop(idx(s, 'conversion.cta'))

@mut('structural: removed mandatory shell section (shell.footer)', EX, 'TEMPLATE_MISSING_REQUIRED')
def _(s): s['nodes'].pop(idx(s, 'shell.footer'))

@mut('structural: reordered fixed-position section (navbar before page-layers)', EX, 'MUST_BE_FIRST')
def _(s): move(s, 'shell.page-layers', 1)

@mut('structural: reordered shell (SHELL_ORDER rule)', EX, 'SHELL_ORDER')
def _(s): move(s, 'shell.page-layers', 1)

@mut('structural: template order mismatch (body before header)', EX, 'TEMPLATE_ORDER_MISMATCH')
def _(s): move(s, 'content.post-body', idx(s, 'content.post-header'))

@mut('structural: mobile menu not directly after navbar', EX, 'MUST_FOLLOW_NAV')
def _(s): move(s, 'shell.mobile-menu', 5)

@mut('structural: cta not directly before footer', EX, 'MUST_PRECEDE_FOOTER')
def _(s): move(s, 'conversion.cta', 7)

@mut('structural: post-body not immediately after a content header', EX, 'MUST_IMMEDIATELY_FOLLOW')
def _(s): move(s, 'content.post-body', idx(s, 'content.post-header'))

@mut('structural: declared template contradicts its nodes (legal template, blog-post nodes)', EX, 'TEMPLATE_EXTRA_SECTION')
def _(s): s['template'] = 'template.legal'; s['route'] = '/terms-of-use'

@mut('structural: declared template contradicts its nodes (missing legal.content)', EX, 'TEMPLATE_MISSING_REQUIRED')
def _(s): s['template'] = 'template.legal'; s['route'] = '/terms-of-use'

@mut('structural: route belongs to a different template', EX, 'ROUTE_TEMPLATE_MISMATCH')
def _(s): s['route'] = '/blog'

@mut('structural: route is not one of the 18 in-scope routes', EX, 'ROUTE_UNKNOWN')
def _(s): s['route'] = '/pricing'

@mut('structural: out-of-scope external-domain page as a route (Careers)', EX, 'ROUTE_UNKNOWN')
def _(s): s['route'] = '/careers'

@mut('structural: section from another template (compare.generic on a blog post)', EX, 'SECTION_TEMPLATE_NOT_ALLOWED')
def _(s):
    n = copy.deepcopy(node(T('template.compare')(), 'compare.generic')); s['nodes'].insert(5, n)

@mut('structural: route-restricted section on the wrong route (hero.home on /compare)', T('template.compare'), 'SECTION_ROUTE_NOT_ALLOWED')
def _(s):
    h = node(T('template.home')(), 'hero.home'); s['nodes'][idx(s, 'hero.compare')] = copy.deepcopy(h)

@mut('structural: modal present although the template has none (flag mismatch)', EX, 'TEMPLATE_FLAG_MISMATCH')
def _(s):
    n = node(T('template.home')(), 'shell.call-alex-modal'); s['nodes'].append(copy.deepcopy(n))

@mut('structural: preloader dropped from a template that has one (flag mismatch)', EX, 'TEMPLATE_FLAG_MISMATCH')
def _(s): s['nodes'].pop(idx(s, 'shell.preloader'))

@mut('structural: body slots out of order', EX, 'SLOT_ORDER')
def _(s): node(s, 'content.post-body')['content']['slots'].reverse()

# ---- rhythm (graph rules)
@mut('rhythm ONE_HERO_PER_PAGE: hero added to a hero-less template', EX, 'ONE_HERO_PER_PAGE')
def _(s):
    h = node(T('template.blog-index')(), 'hero.blog-index'); s['nodes'].insert(4, copy.deepcopy(h))

@mut('rhythm ONE_HERO_PER_PAGE: second hero on a hero template', T('template.home'), 'ONE_HERO_PER_PAGE')
def _(s):
    h = node(T('template.compare')(), 'hero.compare'); s['nodes'].insert(4, copy.deepcopy(h))

@mut('rhythm ONE_HERO_PER_PAGE: hero removed from a hero template', T('template.legal'), 'ONE_HERO_PER_PAGE')
def _(s): s['nodes'].pop(idx(s, 'hero.legal'))

@mut('rhythm TRANSITION_PAIR_ORDER: white-to-black before black-to-white', T('template.home'), 'TRANSITION_PAIR_ORDER')
def _(s):
    a, b = idx(s, 'transition.black-to-white'), idx(s, 'transition.white-to-black'); s['nodes'][a], s['nodes'][b] = s['nodes'][b], s['nodes'][a]

@mut('rhythm TRANSITION_PAIR_ORDER: only one transition of the pair', T('template.home'), 'TRANSITION_PAIR_ORDER')
def _(s): s['nodes'].pop(idx(s, 'transition.white-to-black'))

@mut('rhythm NO_CONSECUTIVE_TRANSITIONS: transitions adjacent', T('template.compare'), 'NO_CONSECUTIVE_TRANSITIONS')
def _(s): move(s, 'transition.white-to-black', idx(s, 'transition.black-to-white') + 1)

@mut('rhythm LIGHT_SURFACE_BRACKET: light section outside the white bracket', T('template.compare'), 'LIGHT_SURFACE_BRACKET')
def _(s): move(s, 'compare.specialty-white', idx(s, 'transition.white-to-black') + 1)

@mut('rhythm LIGHT_SURFACE_BRACKET: dark section inside the white bracket', T('template.home'), 'LIGHT_SURFACE_BRACKET')
def _(s): move(s, 'proof.stats', idx(s, 'transition.black-to-white') + 1)

@mut('rhythm MODAL_NEEDS_CALL_LINK: modal without any Call Alex link section', T('template.compare'), 'MODAL_NEEDS_CALL_LINK')
def _(s): s['nodes'].pop(idx(s, 'conversion.cta'))

@mut('rhythm FOOTER_BOTTOM_LAST: node after the footer-bottom reveal', T('template.home'), 'FOOTER_BOTTOM_LAST')
def _(s): move(s, 'conversion.cta', len(s['nodes']))

@mut('rhythm READ_NEXT_CASE_STUDY_ONLY: read-next on a blog post', EX, 'READ_NEXT_CASE_STUDY_ONLY')
def _(s):
    n = node(T('template.case-study')(), 'content.read-next'); s['nodes'].insert(idx(s, 'content.post-body') + 1, copy.deepcopy(n))

# ---- variants / route-specific
@mut('variant: hero.legal terms variant on /privacy-policy', T('template.legal', route='/privacy-policy'), 'VARIANT_ROUTE_MISMATCH')
def _(s): node(s, 'hero.legal')['variant'] = 'terms'

@mut('variant: /hipaa must use the privacy intro modifier (measured), not terms', T('template.legal', route='/hipaa'), 'VARIANT_ROUTE_MISMATCH')
def _(s): node(s, 'hero.legal')['variant'] = 'terms'

@mut('variant: page-layers with-video on a template that has no background video', EX, 'VARIANT_TEMPLATE_MISMATCH')
def _(s): node(s, 'shell.page-layers')['variant'] = 'with-video'

@mut('variant: with-video requires videoSource', T('template.home'), 'VARIANT_REQUIRES')
def _(s): del node(s, 'shell.page-layers')['content']['videoSource']

@mut('variant: without-video forbids videoSource', EX, 'VARIANT_FORBIDS')
def _(s):
    node(s, 'shell.page-layers')['content']['videoSource'] = {'assetRole': 'bg.video-loop', 'assetRef': '/assets/hero-tablet.mp4'}

@mut('variant: case-header highlight variant carrying stats', T('template.case-study'), 'VARIANT_REQUIRES')
def _(s):
    c = node(s, 'content.case-header')['content']; c.pop('highlight', None)
    c['stats'] = [{'value': '80%', 'label': 'x'}, {'value': '90%', 'label': 'y'}]

# ---- runtime (maxWords)
LONG = ' '.join(['word'] * 400)


@mut('runtime: maxWords overflow on a real field (post title)', EX, 'MAXWORDS_EXCEEDED')
def _(s): node(s, 'content.post-header')['content']['title'] = LONG

@mut('runtime: maxWords overflow on a body paragraph', EX, 'MAXWORDS_EXCEEDED')
def _(s): node(s, 'content.post-body')['content']['slots'][0]['blocks'][1]['text'] = LONG

@mut('runtime: maxWords overflow on heading segments (cta headline)', EX, 'MAXWORDS_EXCEEDED')
def _(s): node(s, 'conversion.cta')['content']['headline'] = [{'text': LONG}]

@mut('runtime: maxWords overflow on page title', EX, 'MAXWORDS_EXCEEDED')
def _(s): s['title'] = LONG

@mut('runtime: maxWords overflow on a case-card highlight (oneOf branch)', T('template.case-study'), 'MAXWORDS_EXCEEDED')
def _(s): node(s, 'content.case-header')['content']['highlight'] = LONG

# ---- asset / policy
@mut('asset: reuse of an original file in a generated derivative (may-generate role)', T('template.blog-post', 'generated-derivative'), 'ASSET_REF_KIND_FORBIDDEN')
def _(s): node(s, 'content.post-header')['content']['image']['assetRef'] = '/assets/6970b17878db95b46a287768-5.webp'

@mut('asset: real third-party mark reused in a generated derivative (ui.social-mark)', T('template.blog-post', 'generated-derivative'), 'ASSET_REF_KIND_FORBIDDEN')
def _(s): node(s, 'content.post-body')['content']['share'][0]['icon']['assetRef'] = '/assets/696e6fc3c1ef2e8dba004c36-x-icon.svg'

@mut('asset: must-not-fabricate role asked to generate (ui.social-mark generate:)', EX, 'ASSET_REF_KIND_FORBIDDEN')
def _(s): node(s, 'content.post-body')['content']['share'][0]['icon']['assetRef'] = 'generate:x-logo'

@mut('asset: must-not-fabricate person photo generated in the internal clone', T('template.home'), 'ASSET_REF_KIND_FORBIDDEN')
def _(s): node(s, 'proof.testimonials')['content']['slides'][0]['photo']['assetRef'] = 'generate:portrait'

@mut('asset: brand wordmark regenerated instead of reused', EX, 'ASSET_REF_KIND_FORBIDDEN')
def _(s): node(s, 'shell.footer-bottom-reveal')['content']['logo']['assetRef'] = 'generate:wordmark'

@mut('asset: live YouTube id reused in a generated derivative (embed.video)', T('template.home'), 'ASSET_REF_KIND_FORBIDDEN')
def _(s):
    s['usage'] = 'generated-derivative'; node(s, 'proof.client-spotlight')['content']['video']['assetRef'] = 'yt:yG3PtcRGQLc'

@mut('asset: external hotlink instead of a registry ref', EX, 'ASSET_REF_INVALID')
def _(s): node(s, 'content.post-header')['content']['image']['assetRef'] = 'https://cdn.example.invalid/hero.png'

@mut('policy: real-claim sections cannot be AI-generated (home as generated-derivative)', T('template.home'), 'CLAIMS_SECTION_IN_DERIVATIVE')
def _(s): s['usage'] = 'generated-derivative'

@mut('policy: real legal text cannot be AI-generated for a real entity', T('template.legal'), 'CLAIMS_SECTION_IN_DERIVATIVE')
def _(s): s['usage'] = 'generated-derivative'


# --------------------------------------------------------------------------- run
def main():
    failures = []
    print('== CONTROLS (must produce zero errors) ==')
    controls = [('example.pagespec.json (real /blog/redefining-healthcare-ai)', EX())]
    for tid in REPO['templates']:
        controls.append(('synthesized %s [internal-clone]' % tid, build_spec(tid)))
    for tid in ('template.blog-index', 'template.blog-post'):
        controls.append(('synthesized %s [generated-derivative]' % tid, build_spec(tid, 'generated-derivative')))
    # every route of every template (route-dependent variants)
    for tid, tpl in REPO['templates'].items():
        for r in tpl['routes']:
            controls.append(('synthesized %s route %s' % (tid, r), build_spec(tid, route=r)))
    n_ctrl = 0
    for name, spec in controls:
        errors, warnings = sv.validate_pagespec(spec, REPO)
        strict = sv.schema_errors(spec, REPO, strict_draft7=True)
        ok = not errors and not strict
        n_ctrl += 1
        print('  %-4s %s%s' % ('PASS' if ok else 'FAIL', name, '' if not warnings else '  (warnings: %s)' % ','.join(sorted(set(w['code'] for w in warnings)))))
        if not ok:
            failures.append('control failed: %s: %s' % (name, [e['code'] + ':' + e['message'][:90] for e in errors + strict][:4]))
    print('\n== MUTATIONS (each must be rejected with the expected code) ==')
    rejected = 0
    for name, base, fn, expected in M:
        spec = base() if callable(base) else copy.deepcopy(base)
        assert not sv.validate_pagespec(spec, REPO)[0], 'mutation base is not a valid control: ' + name
        fn(spec)
        errors, _ = sv.validate_pagespec(spec, REPO)
        codes = sorted(set(e['code'] for e in errors))
        ok = bool(errors) and expected in codes
        rejected += ok
        print('  %-8s %-34s %s' % ('REJECTED' if ok else 'ACCEPTED!' if not errors else 'WRONGCODE', expected, name))
        if not ok:
            failures.append('mutation not rejected as expected: %s (expected %s, got %s)' % (name, expected, codes))
    # warn-severity checks (must surface as warnings, not errors)
    print('\n== WARNING-SEVERITY RULES (must be warnings, never errors, on real structures) ==')
    errors, warnings = sv.validate_pagespec(EX(), REPO)
    wcodes = set(w['code'] for w in warnings)
    ok = 'CTA_CALL_LINK_NEEDS_MODAL' in wcodes and not errors
    print('  %-4s CTA_CALL_LINK_NEEDS_MODAL is a warning on the real blog-post example' % ('PASS' if ok else 'FAIL'))
    if not ok:
        failures.append('CTA_CALL_LINK_NEEDS_MODAL did not surface as a warning')
    legal = build_spec('template.legal')
    legal['nodes'].insert(len(legal['nodes']) - 2, copy.deepcopy(node(build_spec('template.blog-index'), 'conversion.cta')))
    e2, w2 = sv.validate_pagespec(legal, REPO)
    ok = 'NO_CTA_ON_FORM_OR_LEGAL' in set(w['code'] for w in w2) and all(e['code'] != 'NO_CTA_ON_FORM_OR_LEGAL' for e in e2)
    print('  %-4s NO_CTA_ON_FORM_OR_LEGAL is a warning (error comes from the template, not the rule)' % ('PASS' if ok else 'FAIL'))
    if not ok:
        failures.append('NO_CTA_ON_FORM_OR_LEGAL severity wrong')
    print('\ncontrols: %d  mutations: %d  rejected: %d' % (n_ctrl, len(M), rejected))
    if failures:
        print('\nFAILURES:')
        for f in failures:
            print('  - ' + f)
        return 1
    print('ADVERSARIAL SUITE: ALL CONTROLS PASS, ALL %d MUTATIONS REJECTED' % len(M))
    return 0


if __name__ == '__main__':
    sys.exit(main())
