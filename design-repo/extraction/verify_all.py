#!/usr/bin/env python3
"""Drift-proof verification for the Transform9 design-repo (self-contained; stdlib + jsonschema).

Run from anywhere:   python3 extraction/verify_all.py [--source-root DIR] [--quiet]

Checks (each prints PASS / FAIL / WARN):
   1 self-containment      no absolute machine paths in any file, no OS junk, entryPoints inside the repo
   2 syntax                every .json parses; every .py compiles
   3 schema meta           pagespec / section-contract schemas are valid Draft-07; every section contract conforms
   4 example               Draft-07 validation of schema/example.pagespec.json = 0 errors; semantic validator = 0 errors
   5 allowlist parity      every allowlist id has a contract file and every contract file has an allowlist entry;
                           node/page properties, per-section fields, asset roles, motion ids all equal the schema;
                           allowlistVersion in registry.manifest.json == tokens/llm/component-allowlist.json version
   6 schema parity         each section contract's content schema == its branch inside pagespec.schema.json
   7 asset roles           closed enum parity (registry == schema == allowlist), pinned compliance-critical roles
                           (value pinned, not just enum membership), ref-kind tables consistent with policies
   8 templates / routes    node sections exist, shell flags match nodes, 18 routes assigned 1:1, scope derived correctly
   9 graph <-> validator   compatibility/graph.json rule ids == RULES implemented in schema/semantic_validate.py
  10 tokens                every {alias} resolves; every theme maps every semantic token; catalog/policy keys are real
  11 motion                section fallbacks / patterns exist in the registry; every pattern is cited
  12 citation ranges       every measuredFrom path:line[-line] is in the ledger and (when the source tree is present)
                           resolves inside the real file AND the cited text (needle) is inside the range
  13 counts                registry.manifest.json counts, README.md and CHANGELOG.md counts recomputed from disk
  14 versions              allowlistVersion machine-checked; status / productionApproved / versionFieldNote present
  15 word budgets          every maxWords == next multiple of 5 of observedMax; schema examples fit their budgets
  16 sibling source        (only when the source tree is present) routes.jsx flags, content slugs, ia/ia.json and
                           package.json versions are re-diffed against this repo's claims; absent => WARN, never FAIL
  17 doc claims            every script named in this docstring exists (extraction/prove_drift.py proves checks 5,
                           7, 12, 13 fail on injected drift; see its docstring)

Exit code 1 on any FAIL.
"""
import argparse
import glob
import json
import math
import os
import py_compile
import re
import sys
import tempfile

from jsonschema import Draft7Validator

sys.dont_write_bytecode = True
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'schema'))
sys.path.insert(0, os.path.join(ROOT, 'schema', 'tests'))

import semantic_validate as sv  # noqa: E402

RESULTS = []  # (status, check, message)
QUIET = False


def rec(status, check, msg):
    RESULTS.append((status, check, msg))
    if status != 'PASS' or not QUIET:
        print('  %-4s %-26s %s' % (status, check, msg))


def jload(rel):
    with open(os.path.join(ROOT, rel), encoding='utf-8') as f:
        return json.load(f)


def all_files():
    out = []
    for dp, dn, fn in os.walk(ROOT):
        dn[:] = [d for d in dn if d != '__pycache__']
        for f in fn:
            out.append(os.path.relpath(os.path.join(dp, f), ROOT))
    return sorted(out)


def src_lines(path):
    with open(path, encoding='utf-8', errors='replace') as f:
        L = f.read().split('\n')
    if L and L[-1] == '':
        L.pop()
    return L


# ------------------------------------------------------------------ counts (shared with the build)
def count_tokens(root=ROOT):
    n = 0

    def walk(v):
        nonlocal n
        if isinstance(v, dict):
            if '$value' in v:
                n += 1
            for k, x in v.items():
                walk(x)
        elif isinstance(v, list):
            for x in v:
                walk(x)
    for sub in ('00-foundation', '10-semantic', '30-layout'):
        for p in sorted(glob.glob(os.path.join(root, 'tokens', sub, '*.json'))):
            with open(p, encoding='utf-8') as f:
                walk(json.load(f))
    for p in sorted(glob.glob(os.path.join(root, 'tokens', '20-component', '*.json'))):
        with open(p, encoding='utf-8') as f:
            d = json.load(f)
        for g in d['component'].values():
            n += len(g['tokens'])
    return n


def compute_counts(root=ROOT):
    def nfiles(sub):
        return len(glob.glob(os.path.join(root, sub, '*.json')))
    with open(os.path.join(root, 'templates', 'templates.json'), encoding='utf-8') as f:
        tj = json.load(f)
    with open(os.path.join(root, 'templates', 'routes.json'), encoding='utf-8') as f:
        rj = json.load(f)
    with open(os.path.join(root, 'tokens', '00-foundation', 'motion-patterns.json'), encoding='utf-8') as f:
        mp = json.load(f)
    with open(os.path.join(root, 'assets', 'asset-roles.json'), encoding='utf-8') as f:
        ar = json.load(f)
    with open(os.path.join(root, 'compatibility', 'graph.json'), encoding='utf-8') as f:
        g = json.load(f)
    return {'tokens': count_tokens(root), 'primitives': nfiles('primitives'), 'components': nfiles('components'), 'sections': nfiles('sections'),
            'templates': len(tj['templates']), 'routes': len(rj['routes']), 'motionPatterns': len(mp['motionPattern']),
            'assetRoles': len(ar['roles']), 'graphRules': len(g['rules'])}


# ------------------------------------------------------------------ individual checks
ABS_PATTERNS = [re.compile(p) for p in ('/Us' + 'ers/', '/ho' + 'me/[A-Za-z]', '[A-Za-z]:\\\\(?:Us' + 'ers|Wind' + 'ows|Prog' + 'ram)', '/pri' + 'vate/', '/var/fol' + 'ders', '/tm' + 'p/')]


def check_self_containment():
    c = 'self-containment'
    bad = []
    for rel in all_files():
        if '__MACOSX' in rel or rel.endswith('.DS_Store') or os.path.basename(rel).startswith('._'):
            bad.append('OS junk file: ' + rel)
            continue
        if rel.endswith('.pyc'):
            continue
        try:
            with open(os.path.join(ROOT, rel), encoding='utf-8') as f:
                text = f.read()
        except UnicodeDecodeError:
            continue
        for pat in ABS_PATTERNS:
            m = pat.search(text)
            if m:
                bad.append('absolute path %r in %s' % (m.group(0), rel))
    man = jload('registry.manifest.json')
    eps = []

    def collect(v):
        if isinstance(v, str):
            eps.append(v)
        elif isinstance(v, dict):
            for x in v.values():
                collect(x)
        elif isinstance(v, list):
            for x in v:
                collect(x)
    collect(man['entryPoints'])
    for ep in eps:
        if '..' in ep.split('/') or ep.startswith('/'):
            bad.append('entryPoint outside repo: ' + ep)
        elif not os.path.exists(os.path.join(ROOT, ep)):
            bad.append('entryPoint does not exist: ' + ep)
    if bad:
        rec('FAIL', c, '; '.join(bad[:6]) + (' (+%d more)' % (len(bad) - 6) if len(bad) > 6 else ''))
    else:
        rec('PASS', c, 'no absolute paths, no OS junk, %d entryPoints all inside the repo' % len(eps))


def check_syntax():
    c = 'syntax'
    bad = []
    nj = npy = 0
    for rel in all_files():
        p = os.path.join(ROOT, rel)
        if rel.endswith('.json'):
            nj += 1
            try:
                with open(p, encoding='utf-8') as f:
                    json.load(f)
            except Exception as e:  # noqa: BLE001
                bad.append('%s: %s' % (rel, e))
        elif rel.endswith('.py'):
            npy += 1
            try:
                py_compile.compile(p, cfile=os.path.join(tempfile.gettempdir(), 't9_pyc_check.pyc'), doraise=True)
            except Exception as e:  # noqa: BLE001
                bad.append('%s: %s' % (rel, e))
    rec('FAIL' if bad else 'PASS', c, '; '.join(bad[:4]) if bad else '%d json files parse, %d python files compile' % (nj, npy))


def check_schema_meta():
    c = 'schema meta'
    try:
        Draft7Validator.check_schema(jload('schema/pagespec.schema.json'))
        scs = jload('schema/section-contract.schema.json')
        Draft7Validator.check_schema(scs)
    except Exception as e:  # noqa: BLE001
        rec('FAIL', c, 'invalid Draft-07 schema: %s' % str(e)[:200])
        return
    v = Draft7Validator(scs)
    bad = []
    n = 0
    for p in sorted(glob.glob(os.path.join(ROOT, 'sections', '*.json'))):
        n += 1
        d = json.load(open(p, encoding='utf-8'))
        errs = list(v.iter_errors(d))
        if errs:
            bad.append('%s: %s' % (os.path.basename(p), errs[0].message[:100]))
        if os.path.basename(p) != d['id'] + '.json':
            bad.append('file name %s != id %s' % (os.path.basename(p), d['id']))
        if not d['motion'].get('reducedMotionFallback'):
            bad.append('%s has no reducedMotionFallback' % d['id'])
        try:
            Draft7Validator.check_schema({'$schema': 'http://json-schema.org/draft-07/schema#', 'definitions': {'assetRole': {'enum': []}}, 'allOf': [d['content']]})
        except Exception as e:  # noqa: BLE001
            bad.append('%s content schema invalid: %s' % (d['id'], str(e)[:80]))
    rec('FAIL' if bad else 'PASS', c, '; '.join(bad[:4]) if bad else 'both schemas valid Draft-07; %d section contracts conform (all carry reducedMotionFallback)' % n)


def check_example():
    c = 'example'
    schema = jload('schema/pagespec.schema.json')
    ex = jload('schema/example.pagespec.json')
    errs = list(Draft7Validator(schema).iter_errors(ex))
    sem_err, sem_warn = sv.validate_pagespec(ex)
    if errs or sem_err:
        rec('FAIL', c, 'Draft-07 errors=%d semantic errors=%d: %s' % (len(errs), len(sem_err), (sem_err[:1] or [{'message': errs[0].message[:120]}])[0]['message'][:160]))
    else:
        rec('PASS', c, 'Draft-07 errors = 0; semantic errors = 0 (%d warning: %s)' % (len(sem_warn), ','.join(sorted(set(w['code'] for w in sem_warn))) or 'none'))
    # every example node against its contract's required list, node by node (independent of the schema walk)
    bad = []
    secs = {os.path.basename(p)[:-5]: json.load(open(p, encoding='utf-8')) for p in glob.glob(os.path.join(ROOT, 'sections', '*.json'))}
    for i, n in enumerate(ex['nodes']):
        cs = secs[n['section']]['content']
        branch = cs['oneOf'][0] if 'oneOf' in cs and 'properties' not in cs else cs
        for r in branch.get('required', []):
            if r not in n['content']:
                bad.append('node %d %s missing %s' % (i, n['section'], r))
    rec('FAIL' if bad else 'PASS', c, '; '.join(bad[:3]) if bad else 'example nodes carry every required field of their section contracts (%d nodes)' % len(ex['nodes']))


def check_allowlist_parity(manifest):
    c = 'allowlist parity'
    al = jload('tokens/llm/component-allowlist.json')
    schema = jload('schema/pagespec.schema.json')
    reg = jload('assets/asset-roles.json')
    mp = jload('tokens/00-foundation/motion-patterns.json')
    bad = []
    dirs = {'primitive': 'primitives', 'component': 'components', 'section': 'sections'}
    files = {}
    for kind, d in dirs.items():
        for p in glob.glob(os.path.join(ROOT, d, '*.json')):
            dd = json.load(open(p, encoding='utf-8'))
            if dd['id'] + '.json' != os.path.basename(p):
                bad.append('%s file name != id' % p)
            files[(kind, dd['id'])] = dd
    ent = {(e['kind'], e['id']): e for e in al['entries']}
    for k in ent:
        if k not in files:
            bad.append('PHANTOM allowlist entry (no contract file): %s %s' % k)
        elif not os.path.exists(os.path.join(ROOT, ent[k]['file'])):
            bad.append('allowlist entry file missing: ' + ent[k]['file'])
    for k in files:
        if k not in ent:
            bad.append('ORPHAN contract file (no allowlist entry): %s %s' % k)
    if len(ent) != len(al['entries']):
        bad.append('duplicate allowlist entries')
    for (kind, i), e in ent.items():
        if (kind, i) not in files:
            continue
        d = files[(kind, i)]
        if kind == 'section':
            if sorted(e['overridable']) != sorted(d['contentFields']) or e['variants'] != list(d['variants'].keys()) or e['motionPatterns'] != d['motion']['allowedPatterns']:
                bad.append('allowlist entry != contract for ' + i)
        elif sorted(e['overridable']) != sorted(d['props'].keys()):
            bad.append('allowlist overridable != props for ' + i)
    node_props = sorted(schema['definitions']['node']['properties'].keys())
    if al['nodeProperties'] != node_props:
        bad.append('nodeProperties %s != schema node properties %s' % (al['nodeProperties'], node_props))
    if al['pageSpecProperties'] != sorted(schema['properties'].keys()):
        bad.append('pageSpecProperties != schema root properties')
    if al['motionProperties'] != sorted(schema['definitions']['motion']['properties'].keys()):
        bad.append('motionProperties != schema motion properties')
    if al['assetRoles'] != sorted(schema['definitions']['assetRole']['enum']) or sorted(reg['roles'].keys()) != al['assetRoles']:
        bad.append('assetRole enum differs between allowlist / schema / registry')
    if al['motionPatterns'] != schema['definitions']['motionPattern']['enum'] or sorted(al['motionPatterns']) != sorted(mp['motionPattern'].keys()):
        bad.append('motion pattern ids differ between allowlist / schema / registry')
    if al['reducedMotionFallbacks'] != schema['definitions']['reducedMotionFallback']['enum'] or sorted(al['reducedMotionFallbacks']) != sorted(mp['reducedMotionFallback'].keys()):
        bad.append('reducedMotionFallback set differs')
    if manifest.get('allowlistVersion') != al.get('version'):
        bad.append('allowlistVersion %r in manifest != allowlist version %r' % (manifest.get('allowlistVersion'), al.get('version')))
    rec('FAIL' if bad else 'PASS', c, '; '.join(bad[:5]) if bad else '%d allowlist entries <-> %d contract files (16+15+43), allowlistVersion %s matches manifest, enums equal schema' % (len(ent), len(files), al['version']))


def check_schema_parity():
    c = 'schema parity'
    schema = jload('schema/pagespec.schema.json')
    branches = {}
    for b in schema['properties']['nodes']['items']['allOf'][1:]:
        branches[b['if']['properties']['section']['const']] = b['then']
    bad = []
    secs = {os.path.basename(p)[:-5]: json.load(open(p, encoding='utf-8')) for p in glob.glob(os.path.join(ROOT, 'sections', '*.json'))}
    if sorted(branches) != sorted(secs) or sorted(schema['definitions']['node']['properties']['section']['enum']) != sorted(secs):
        bad.append('section branch set / enum differs from section contract files')
    for sid, d in secs.items():
        b = branches.get(sid)
        if b is None:
            continue
        if b['properties']['content'] != d['content']:
            bad.append('content schema drift: ' + sid)
        if b['properties']['motion']['properties']['reducedMotionFallback'] != {'const': d['motion']['reducedMotionFallback']} or b['properties']['motion']['properties']['patterns']['items'] != {'enum': d['motion']['allowedPatterns']}:
            bad.append('motion branch drift: ' + sid)
        if d['variants']:
            if b['properties']['variant'] != {'enum': list(d['variants'].keys())}:
                bad.append('variant drift: ' + sid)
        elif b['properties']['variant'] is not False:
            bad.append('variant should be forbidden: ' + sid)
    # closedness: every object schema under content has additionalProperties:false
    def open_objects(s, path):
        out = []
        if isinstance(s, dict):
            if s.get('type') == 'object' and 'properties' in s and s.get('additionalProperties') is not False:
                out.append(path)
            for k, v in s.items():
                out += open_objects(v, path + '/' + k)
        elif isinstance(s, list):
            for i, v in enumerate(s):
                out += open_objects(v, '%s/%d' % (path, i))
        return out
    for sid, d in secs.items():
        bad += ['open object (additionalProperties not false) in %s%s' % (sid, p) for p in open_objects(d['content'], '')]
    for name in ('definitions/motion', 'definitions/node'):
        node = schema
        for part in name.split('/'):
            node = node[part]
        if node.get('additionalProperties') is not False:
            bad.append(name + ' is not closed')
    if schema.get('additionalProperties') is not False:
        bad.append('root schema not closed')
    rec('FAIL' if bad else 'PASS', c, '; '.join(bad[:5]) if bad else '43 schema branches == 43 contracts (content, motion, variants); every object schema closed; motion closed')


PINNED_EXPECTED = {  # authoritative copy of the compliance-critical pins (not only in the registry)
    'brand.wordmark-white': 'must-reuse-exact', 'brand.wordmark-black': 'must-reuse-exact', 'brand.wordmark-footer': 'must-reuse-exact',
    'client.logo': 'must-not-fabricate', 'partner.logo': 'must-not-fabricate', 'certification.badge': 'must-not-fabricate', 'person.photo': 'must-not-fabricate',
    'ui.social-mark': 'must-not-fabricate', 'product.ui-illustration': 'must-not-fabricate', 'embed.video': 'must-not-reuse-live-endpoint',
}
POLICIES = ['may-generate-new', 'must-reuse-exact', 'must-not-fabricate', 'must-not-reuse-live-endpoint']


def check_asset_roles():
    c = 'asset roles'
    reg = jload('assets/asset-roles.json')
    bad = []
    roles = reg['roles']
    for rid, r in roles.items():
        if r['generationPolicy'] not in POLICIES:
            bad.append('%s: policy %r not in closed set' % (rid, r['generationPolicy']))
        if not r.get('usedBy'):
            bad.append('%s is used by no section field' % rid)
        for u in r.get('usedBy', []):
            if not os.path.exists(os.path.join(ROOT, 'sections', u.split(':')[0] + '.json')):
                bad.append('%s usedBy unknown section %s' % (rid, u))
        for usage, kinds in r['allowedRefKinds'].items():
            if r['generationPolicy'] == 'must-not-fabricate' and ('generate' in kinds):
                bad.append('%s: must-not-fabricate role allows generate in %s' % (rid, usage))
            if r['generationPolicy'] in ('must-not-fabricate', 'must-not-reuse-live-endpoint') and usage == 'generated-derivative' and kinds != ['placeholder']:
                bad.append('%s: derivative must accept placeholder only, found %s' % (rid, kinds))
            if r['generationPolicy'] == 'may-generate-new' and usage == 'generated-derivative' and kinds != ['generate']:
                bad.append('%s: derivative of a may-generate role must accept generate only' % rid)
            if any(k not in reg['refKinds'] for k in kinds):
                bad.append('%s: unknown ref kind in %s' % (rid, usage))
        if not r.get('licensing') or not r.get('measuredFrom'):
            bad.append('%s lacks licensing guidance or evidence' % rid)
    # pinned-value check (value, not membership): proven by a different-but-valid mutation in prove_drift.py
    for rid, pol in PINNED_EXPECTED.items():
        if roles.get(rid, {}).get('generationPolicy') != pol:
            bad.append('PINNED role %s must be %s, found %s' % (rid, pol, roles.get(rid, {}).get('generationPolicy')))
        if reg['pinnedRoles'].get(rid) != pol:
            bad.append('registry pinnedRoles entry for %s != %s' % (rid, pol))
    # contracts' derived asset roles all registered
    for p in glob.glob(os.path.join(ROOT, 'sections', '*.json')):
        d = json.load(open(p, encoding='utf-8'))
        for r in d['assetRoles']:
            if r not in roles:
                bad.append('%s uses unregistered role %s' % (d['id'], r))
    for k in ('forbiddenInGeneratedOutput', 'usageContexts', 'scopeStatement'):
        if not reg.get(k):
            bad.append('registry missing ' + k)
    rec('FAIL' if bad else 'PASS', c, '; '.join(bad[:5]) if bad else '%d roles: closed policy set, derivative ref kinds consistent, %d compliance-critical roles pinned to exact values' % (len(roles), len(PINNED_EXPECTED)))


def check_templates():
    c = 'templates / routes'
    T = jload('templates/templates.json')['templates']
    Rt = jload('templates/routes.json')['routes']
    secs = {os.path.basename(p)[:-5]: json.load(open(p, encoding='utf-8')) for p in glob.glob(os.path.join(ROOT, 'sections', '*.json'))}
    bad = []
    seen = {}
    for r in Rt:
        if r['path'] in seen:
            bad.append('route assigned twice: ' + r['path'])
        seen[r['path']] = r['template']
    tids = set(t['id'] for t in T)
    for r in Rt:
        if r['template'] not in tids:
            bad.append('route %s -> unknown template' % r['path'])
    for t in T:
        listed = sorted(t['routes'])
        assigned = sorted(r['path'] for r in Rt if r['template'] == t['id'])
        if listed != assigned:
            bad.append('template %s routes differ from routes.json' % t['id'])
        if not assigned:
            bad.append('template %s has no route' % t['id'])
        names = [n['section'] for n in t['nodes']]
        for n in names:
            if n not in secs:
                bad.append('%s references unknown section %s' % (t['id'], n))
        if len(names) != len(set(names)):
            bad.append('%s repeats a non-repeatable node' % t['id'])
        for n in t['nodes']:
            if set(n) != {'section', 'required', 'repeatable'}:
                bad.append('%s node shape: %s' % (t['id'], n))
        sh = t['shell']
        if (sh['footer'] == 'full') != ('shell.footer' in names) or sh['modal'] != ('shell.call-alex-modal' in names) or sh['preloader'] != ('shell.preloader' in names):
            bad.append('%s shell flags disagree with its nodes' % t['id'])
        if sh['video'] != (t['family'] not in ('blog-post', 'case-study')):
            bad.append('%s video flag unexpected' % t['id'])
    # scope derived from templates
    for sid, d in secs.items():
        tp = [t['id'] for t in T if sid in [n['section'] for n in t['nodes']]]
        rt = [r for t in T if t['id'] in tp for r in t['routes']]
        if d['scope']['templates'] != tp or d['scope']['routes'] != rt or d['scope']['routeCount'] != len(rt) or d['constraints']['allowedTemplates'] != tp:
            bad.append('scope drift: ' + sid)
        if (len(rt) == 1) != ('allowedRoutes' in d['constraints']):
            bad.append('allowedRoutes presence wrong: ' + sid)
    unused = [s for s in secs if not any(s in [n['section'] for n in t['nodes']] for t in T)]
    if unused:
        bad.append('sections in no template: %s' % unused)
    rec('FAIL' if bad else 'PASS', c, '; '.join(bad[:5]) if bad else '%d templates, %d routes assigned 1:1 (no gaps, no double assignment); every section is in >=1 template; shell flags match node lists' % (len(T), len(Rt)))


def check_graph():
    c = 'graph <-> validator'
    g = jload('compatibility/graph.json')['rules']
    ids = [r['id'] for r in g]
    bad = []
    if sorted(ids) != sorted(sv.RULES.keys()):
        bad.append('graph rule ids %s != implemented RULES %s' % (sorted(set(ids) ^ set(sv.RULES)), ''))
    for r in g:
        if r['severity'] not in ('error', 'warn'):
            bad.append('%s severity %r' % (r['id'], r['severity']))
        if not r.get('measuredFrom') or not r.get('description'):
            bad.append('%s lacks evidence/description' % r['id'])
    T = jload('templates/templates.json')['templates']
    tids = set(t['id'] for t in T)
    cats = set(jload('compatibility/graph.json')['categories'])
    secs = set(os.path.basename(p)[:-5] for p in glob.glob(os.path.join(ROOT, 'sections', '*.json')))
    for r in g:
        for e in r.get('exceptions', []):
            for t in e.get('templates', []):
                if t not in tids:
                    bad.append('%s exception names unknown template %s' % (r['id'], t))
            for s in e.get('sections', []):
                if s not in secs:
                    bad.append('%s exception names unknown section %s' % (r['id'], s))
            for k in e.get('categories', []):
                if k not in cats:
                    bad.append('%s exception names unknown category %s' % (r['id'], k))
    # every real template, synthesized from its own node list, must satisfy every error-severity rule
    try:
        import adversarial_test as at
        for t in T:
            errs, _ = sv.validate_pagespec(at.build_spec(t['id']))
            if errs:
                bad.append('rule/template disagreement on %s: %s' % (t['id'], errs[0]['code']))
    except Exception as e:  # noqa: BLE001
        bad.append('could not run template controls: %s' % e)
    rec('FAIL' if bad else 'PASS', c, '; '.join(bad[:5]) if bad else '%d graph rules == %d implemented rules; all %d real templates satisfy every error rule' % (len(g), len(sv.RULES), len(T)))


def resolve(tree, path):
    cur = tree
    parts = path.split('.')
    for i, p in enumerate(parts):
        if isinstance(cur, dict) and p in cur:
            cur = cur[p]
        elif isinstance(cur, dict) and 'tokens' in cur and p in cur['tokens']:
            cur = cur['tokens'][p]
        else:
            return None
    return cur


def check_tokens():
    c = 'tokens'
    tree = {}
    for sub in ('00-foundation', '10-semantic', '20-component', '30-layout'):
        for p in sorted(glob.glob(os.path.join(ROOT, 'tokens', sub, '*.json'))):
            for k, v in json.load(open(p, encoding='utf-8')).items():
                if not k.startswith('$'):
                    tree[k] = v
    bad = []
    alias = re.compile(r'\{([a-zA-Z0-9_.\-]+)\}')

    def walk(v, where):
        if isinstance(v, str):
            for m in alias.finditer(v):
                if resolve(tree, m.group(1)) is None:
                    bad.append('unresolved alias {%s} in %s' % (m.group(1), where))
        elif isinstance(v, dict):
            for k, x in v.items():
                if k not in ('measuredFrom', '$description'):
                    walk(x, where)
        elif isinstance(v, list):
            for x in v:
                walk(x, where)
    for sub in ('00-foundation', '10-semantic', '20-component', '30-layout'):
        for p in sorted(glob.glob(os.path.join(ROOT, 'tokens', sub, '*.json'))):
            walk(json.load(open(p, encoding='utf-8')), os.path.relpath(p, ROOT))
    sem = jload('tokens/10-semantic/semantic.json')['semantic']
    paths = ['%s.%s' % (g, l) for g, d in sem.items() for l in d]
    themes = {}
    for p in glob.glob(os.path.join(ROOT, 'tokens', 'themes', '*.json')):
        t = json.load(open(p, encoding='utf-8'))
        themes[t['theme']] = t
    for name, t in themes.items():
        if sorted(t['mappings']) != sorted(paths):
            bad.append('theme %s does not map exactly the semantic tokens (missing %s)' % (name, sorted(set(paths) - set(t['mappings']))[:3]))
        for pth, val in t['mappings'].items():
            vals = list(val.values()) if isinstance(val, dict) else [val]
            for x in vals:
                m = alias.fullmatch(x)
                if not m or resolve(tree, m.group(1)) is None:
                    bad.append('theme %s: %s -> %r does not resolve' % (name, pth, x))
    default = [n for n, t in themes.items() if t.get('default')]
    if default != ['dark']:
        bad.append('default theme must be dark, found %s' % default)
    else:
        for g, d in sem.items():
            for l, tok in d.items():
                if tok['$value'] != themes['dark']['mappings']['%s.%s' % (g, l)]:
                    bad.append('semantic default != dark theme for %s.%s' % (g, l))
    cat = jload('tokens/llm/token-catalog.json')['catalog']
    pol = jload('tokens/llm/token-policy.json')
    for k in cat:
        if k not in ('semantic', 'component') and k not in tree:
            bad.append('catalog key %s is not a real token group' % k)
        elif k not in ('semantic', 'component') and sorted(x for x in tree[k] if not x.startswith('$')) != cat[k]:
            bad.append('catalog entries for %s differ from token files' % k)
    if cat['semantic'] != sorted(paths) or cat['component'] != sorted(tree['component'].keys()):
        bad.append('catalog semantic/component lists drift')
    for k in pol['rawValueRestrictions']:
        if k not in cat:
            bad.append('policy category %s is not a catalog key' % k)
    # primitive / component token references and composition
    ids = {}
    for kind, d in (('primitive', 'primitives'), ('component', 'components')):
        for p in glob.glob(os.path.join(ROOT, d, '*.json')):
            dd = json.load(open(p, encoding='utf-8'))
            ids[dd['id']] = (kind, dd)
    secs = {os.path.basename(p)[:-5]: json.load(open(p, encoding='utf-8')) for p in glob.glob(os.path.join(ROOT, 'sections', '*.json'))}
    for i, (kind, dd) in ids.items():
        for t in dd['tokens']:
            if resolve(tree, t) is None:
                bad.append('%s references unknown token %s' % (i, t))
        for u in dd.get('composes', []):
            if ids.get(u, ('', None))[0] != 'primitive':
                bad.append('%s composes unknown primitive %s' % (i, u))
        used = sorted(s for s, d in secs.items() if i in d['composes'])
        if sorted(dd['usedBySections']) != used:
            bad.append('usedBySections drift for ' + i)
    for s, d in secs.items():
        for u in d['composes']:
            if u not in ids:
                bad.append('%s composes unknown %s' % (s, u))
    rec('FAIL' if bad else 'PASS', c, '; '.join(bad[:5]) if bad else 'all aliases resolve; %d themes each map all %d semantic tokens; catalog/policy keys real; component/primitive references and usedBy consistent' % (len(themes), len(paths)))


def check_motion():
    c = 'motion'
    mp = jload('tokens/00-foundation/motion-patterns.json')
    pats, fbs = mp['motionPattern'], mp['reducedMotionFallback']
    bad = []
    used = set()
    for p in glob.glob(os.path.join(ROOT, 'sections', '*.json')):
        d = json.load(open(p, encoding='utf-8'))
        fb = d['motion']['reducedMotionFallback']
        if fb not in fbs:
            bad.append('%s fallback %s unknown' % (d['id'], fb))
        if not d['motion']['allowedPatterns'] and fb != 'static-no-motion':
            bad.append('%s has no motion but fallback %s' % (d['id'], fb))
        if d['motion']['allowedPatterns'] and fb == 'static-no-motion':
            bad.append('%s has motion but fallback static-no-motion' % d['id'])
        for x in d['motion']['allowedPatterns']:
            used.add(x)
            if x not in pats:
                bad.append('%s uses unknown pattern %s' % (d['id'], x))
    for k, v in pats.items():
        if not v.get('measuredFrom') or v.get('evidenceLevel') != 'measured':
            bad.append('pattern %s lacks measured evidence' % k)
        if v['id'] != k:
            bad.append('pattern id mismatch ' + k)
        if not v.get('verifiedOnClone') and not v.get('verifiedOnCloneNote'):
            bad.append('pattern %s has neither clone-verification evidence nor a note' % k)
    unused = sorted(set(pats) - used)
    for d in ('primitives', 'components'):
        for p in glob.glob(os.path.join(ROOT, d, '*.json')):
            dd = json.load(open(p, encoding='utf-8'))
            for x in dd['motionPatterns']:
                used.add(x)
                if x not in pats:
                    bad.append('%s uses unknown pattern %s' % (dd['id'], x))
    rec('FAIL' if bad else 'PASS', c, '; '.join(bad[:5]) if bad else '%d patterns, %d fallbacks; every section declares a registered reducedMotionFallback; patterns referenced by no section: %s' % (len(pats), len(fbs), ', '.join(sorted(set(pats) - set(used))) or 'none'))


def find_source_root(arg):
    cands = []
    if arg:
        cands.append(arg)
    if os.environ.get('T9_SOURCE_ROOT'):
        cands.append(os.environ['T9_SOURCE_ROOT'])
    cands.append(os.path.dirname(ROOT))
    for cnd in cands:
        if os.path.isfile(os.path.join(cnd, 'CLONE_SPEC.md')) and os.path.isdir(os.path.join(cnd, 'src')):
            return cnd
    return None


def collect_citations():
    refs = {}

    def walk(v, where):
        if isinstance(v, dict):
            for k, x in v.items():
                if k == 'measuredFrom' and isinstance(x, list):
                    for r in x:
                        refs.setdefault(r, set()).add(where)
                else:
                    walk(x, where)
        elif isinstance(v, list):
            for x in v:
                walk(x, where)
    for rel in all_files():
        if rel.endswith('.json') and rel != 'extraction/measured-values.json':
            walk(jload(rel), rel)
    mv = jload('extraction/measured-values.json')
    walk({k: v for k, v in mv.items() if k != 'citations'}, 'extraction/measured-values.json')
    return refs


def check_citations(source):
    c = 'citation ranges'
    ledger = jload('extraction/measured-values.json')['citations']
    refs = collect_citations()
    bad = []
    pat = re.compile(r'^([^:]+):(\d+)(?:-(\d+))?$')
    for r in refs:
        m = pat.match(r)
        if not m:
            bad.append('malformed citation ' + r)
            continue
        if r not in ledger:
            bad.append('citation missing from extraction/measured-values.json: ' + r)
            continue
        e = ledger[r]
        s, en = int(m.group(2)), int(m.group(3) or m.group(2))
        if (e['path'], e['start'], e['end']) != (m.group(1), s, en):
            bad.append('ledger entry disagrees with citation ' + r)
        if s > en:
            bad.append('inverted range ' + r)
    if bad:
        rec('FAIL', c, '; '.join(bad[:5]) + (' (+%d more)' % (len(bad) - 5) if len(bad) > 5 else ''))
        return
    if not source:
        rec('WARN', c, '%d citations are well-formed and in the ledger, but the source tree is not present: line ranges NOT verified (degrades to a warning by design; pass --source-root)' % len(refs))
        return
    miss = []
    cache = {}
    checked = 0
    for r, e in ledger.items():
        full = os.path.join(source, e['path'])
        if not os.path.isfile(full):
            miss.append('cited file missing: ' + e['path'])
            continue
        if e['path'] not in cache:
            cache[e['path']] = src_lines(full)
        L = cache[e['path']]
        checked += 1
        if e['end'] > len(L) or e['start'] < 1:
            miss.append('OUT OF RANGE %s (file has %d lines)' % (r, len(L)))
        elif e['needle'] not in '\n'.join(L[e['start'] - 1:e['end']]):
            miss.append('WRONG CODE: %r not within %s' % (e['needle'][:50], r))
    rec('FAIL' if miss else 'PASS', c, '; '.join(miss[:4]) + (' (+%d more)' % (len(miss) - 4) if len(miss) > 4 else '') if miss else '%d citations (%d distinct files) resolve inside the real files and the cited text is inside each range' % (checked, len(cache)))


def parse_marker(text):
    m = re.search(r'<!--\s*counts:([^>]*)-->', text)
    if not m:
        return None
    return dict((k, int(v)) for k, v in re.findall(r'(\w+)=(\d+)', m.group(1)))


def check_counts(manifest):
    c = 'counts'
    real = compute_counts()
    bad = []
    if manifest['counts'] != real:
        bad.append('manifest counts %s != recomputed %s' % ({k: v for k, v in manifest['counts'].items() if real.get(k) != v}, {k: real[k] for k in real if manifest['counts'].get(k) != real[k]}))
    for doc in ('README.md', 'CHANGELOG.md'):
        text = open(os.path.join(ROOT, doc), encoding='utf-8').read()
        mk = parse_marker(text)
        if mk is None:
            bad.append(doc + ' lacks the machine-checked counts marker')
        elif mk != real:
            bad.append('%s counts marker stale: %s' % (doc, {k: (mk.get(k), real[k]) for k in real if mk.get(k) != real[k]}))
    readme = open(os.path.join(ROOT, 'README.md'), encoding='utf-8').read()
    for label, key in (('Sections', 'sections'), ('Templates', 'templates'), ('Routes', 'routes'), ('Primitives', 'primitives'), ('Components', 'components'), ('Tokens', 'tokens'), ('Motion patterns', 'motionPatterns'), ('Asset roles', 'assetRoles'), ('Graph rules', 'graphRules')):
        m = re.search(r'\|\s*%s\s*\|\s*(\d+)\s*\|' % label, readme)
        if not m or int(m.group(1)) != real[key]:
            bad.append('README table %s = %s, disk = %s' % (label, m.group(1) if m else 'missing', real[key]))
    prose = [(r'(\d+) (?:section contracts|sections)\b', 'sections'), (r'(\d+) templates\b', 'templates'), (r'(\d+) routes\b', 'routes'), (r'(\d+) primitives\b', 'primitives'), (r'(\d+) components\b', 'components'),
             (r'(\d+) (?:measured )?(?:motion )?patterns\b', 'motionPatterns'), (r'(\d+) closed assetRole values', 'assetRoles'), (r'(\d+) tokens\b', 'tokens')]
    for doc in ('README.md', 'CHANGELOG.md'):
        text = re.sub(r'<!--.*?-->', '', open(os.path.join(ROOT, doc), encoding='utf-8').read(), flags=re.S)
        for rx, key in prose:
            for m in re.finditer(rx, text):
                if int(m.group(1)) != real[key]:
                    bad.append('%s prose says "%s" but disk has %d %s' % (doc, m.group(0), real[key], key))
    rec('FAIL' if bad else 'PASS', c, '; '.join(bad[:4]) if bad else 'manifest, README and CHANGELOG counts match disk: %s' % ', '.join('%s=%d' % kv for kv in real.items()))


def check_versions(manifest):
    c = 'versions'
    bad = []
    if manifest.get('status') != 'design-review-pending':
        bad.append('status must be design-review-pending')
    if manifest.get('productionApproved') is not False:
        bad.append('productionApproved must be false')
    note = manifest.get('versionFieldNote', '')
    if not note or 'allowlistVersion' not in note or 'documentation-only' not in note:
        bad.append('versionFieldNote must say which version fields are machine-checked and which are documentation-only')
    for k in ('repositoryId', 'repositoryVersion', 'pageSpecVersion', 'allowlistVersion', 'defaultTheme', 'schemaValidatedThemes', 'entryPoints', 'counts', 'sourceProject'):
        if k not in manifest:
            bad.append('manifest missing ' + k)
    rec('FAIL' if bad else 'PASS', c, '; '.join(bad) if bad else 'status=%s productionApproved=%s; allowlistVersion machine-checked (check 5); repositoryVersion/pageSpecVersion documented as documentation-only' % (manifest['status'], manifest['productionApproved']))


def check_budgets():
    c = 'word budgets'
    bad = []
    n = 0

    def r5(x):
        return max(5, int(math.ceil(x / 5.0)) * 5)

    def walk(v, where):
        nonlocal n
        if isinstance(v, dict):
            if 'maxWords' in v:
                n += 1
                if 'observedMax' not in v or v['maxWords'] != r5(v['observedMax']):
                    bad.append('%s: maxWords %s != roundup5(observedMax %s)' % (where, v['maxWords'], v.get('observedMax')))
                ex = v.get('examples')
                if ex:
                    cnt = sv.words(sv.text_of(ex[0]))
                    if cnt > v['maxWords']:
                        bad.append('%s: example has %d words > %d' % (where, cnt, v['maxWords']))
            for k, x in v.items():
                walk(x, where)
        elif isinstance(v, list):
            for x in v:
                walk(x, where)
    walk(jload('schema/pagespec.schema.json'), 'pagespec.schema.json')
    # sections hold the same schema; just recount the budgets there independently
    for p in glob.glob(os.path.join(ROOT, 'sections', '*.json')):
        walk(json.load(open(p, encoding='utf-8'))['content'], os.path.basename(p))
    rec('FAIL' if bad else 'PASS', c, '; '.join(bad[:4]) if bad else '%d maxWords budgets (schema + contracts) all equal roundup5(observedMax); every example fits its budget' % n)


def check_sibling(source, manifest):
    c = 'sibling source'
    if not source:
        rec('WARN', c, 'source tree not present: routes.jsx / content slugs / ia.json / package.json re-diff skipped (by design)')
        return
    bad = []
    T = {t['family']: t for t in jload('templates/templates.json')['templates']}
    rj = open(os.path.join(source, 'src', 'routes.jsx'), encoding='utf-8').read()
    shell = {'footer': 'full', 'modal': False, 'preloader': False, 'video': True}
    seen = 0
    for line in rj.split('\n'):
        m = re.search(r"family: '([a-z\-]+)'", line)
        if not m or '{ ...SHELL' not in line:
            continue
        fam = m.group(1)
        if fam == 'not-found':
            if not any(x.get('family') == 'not-found' for x in jload('templates/templates.json').get('excluded', [])):
                bad.append('routes.jsx not-found fallback is not documented in templates.json excluded[]')
            continue
        flags = dict(shell)
        for k in ('modal', 'preloader', 'video'):
            mm = re.search(r'\b%s: (true|false)' % k, line)
            if mm:
                flags[k] = mm.group(1) == 'true'
        mm = re.search(r"footer: '(\w+)'", line)
        if mm:
            flags['footer'] = mm.group(1)
        seen += 1
        if fam not in T:
            bad.append('routes.jsx family %s has no template' % fam)
        elif T[fam]['shell'] != flags:
            bad.append('shell flags for %s: repo %s vs routes.jsx %s' % (fam, T[fam]['shell'], flags))
    if seen != len(T):
        bad.append('routes.jsx has %d route entries, repo has %d templates' % (seen, len(T)))
    routes = set(r['path'] for r in jload('templates/routes.json')['routes'])
    posts = set('/blog/' + os.path.basename(p)[:-5] for p in glob.glob(os.path.join(source, 'content', 'blog', '*.json')) if not p.endswith('_index.json'))
    cases = set('/case-studies/' + os.path.basename(p)[:-5] for p in glob.glob(os.path.join(source, 'content', 'case-studies', '*.json')) if not p.endswith('_index.json'))
    if (posts | cases) != set(r for r in routes if r.startswith('/blog/') or r.startswith('/case-studies/')):
        bad.append('detail routes differ from content/*.json slugs')
    ia_path = os.path.join(source, 'ia', 'ia.json')
    if os.path.isfile(ia_path):
        ia = json.load(open(ia_path, encoding='utf-8'))
        secs = set(os.path.basename(p)[:-5] for p in glob.glob(os.path.join(ROOT, 'sections', '*.json')))
        if set(ia['sections']) != secs:
            bad.append('ia.json section ids differ from contracts')
        mine = {t['id']: t for t in jload('templates/templates.json')['templates']}
        for it in ia['templates']:
            if it['id'] not in mine or [n['section'] for n in mine[it['id']]['nodes']] != it['sections'] or sorted(mine[it['id']]['routes']) != sorted(it['routes']):
                bad.append('ia.json template %s differs' % it['id'])
        if ia['meta']['totalRoutes'] != len(routes) or ia['meta']['totalTemplates'] != len(mine):
            bad.append('ia.json totals differ')
    pj = json.load(open(os.path.join(source, 'package.json'), encoding='utf-8'))
    stack = manifest['sourceProject']['stack']
    for k, v in stack.items():
        dep = pj['dependencies'].get(k) or pj['devDependencies'].get(k)
        if dep != v['declared']:
            bad.append('package.json %s %s != manifest %s' % (k, dep, v['declared']))
    rec('FAIL' if bad else 'PASS', c, '; '.join(bad[:4]) if bad else 'routes.jsx flags (%d families), content slugs, ia.json ids/templates/routes and package.json versions all match this repo' % seen)


def check_doc_claims():
    c = 'doc claims'
    doc = __doc__ or ''
    bad = []
    for ref in set(re.findall(r'(?:extraction|schema|scripts)/[A-Za-z0-9_/]+\.(?:py|sh|json)', doc)):
        if not os.path.exists(os.path.join(ROOT, ref)):
            bad.append('docstring names a file that does not exist: ' + ref)
    rec('FAIL' if bad else 'PASS', c, '; '.join(bad) if bad else 'every file named in this docstring exists')


def main():
    global QUIET
    ap = argparse.ArgumentParser()
    ap.add_argument('--source-root', default=None)
    ap.add_argument('--quiet', action='store_true')
    a = ap.parse_args()
    QUIET = a.quiet
    source = find_source_root(a.source_root)
    print('verify_all: repo=%s source-tree=%s' % (os.path.basename(ROOT), 'present' if source else 'ABSENT (citation/sibling checks degrade to warnings)'))
    manifest = jload('registry.manifest.json')
    check_self_containment()
    check_syntax()
    check_schema_meta()
    check_example()
    check_allowlist_parity(manifest)
    check_schema_parity()
    check_asset_roles()
    check_templates()
    check_graph()
    check_tokens()
    check_motion()
    check_citations(source)
    check_counts(manifest)
    check_versions(manifest)
    check_budgets()
    check_sibling(source, manifest)
    check_doc_claims()
    fails = [r for r in RESULTS if r[0] == 'FAIL']
    warns = [r for r in RESULTS if r[0] == 'WARN']
    print('\nVERIFY_ALL: %s  (%d checks, %d FAIL, %d WARN)' % ('FAIL' if fails else 'PASS', len(RESULTS), len(fails), len(warns)))
    return 1 if fails else 0


if __name__ == '__main__':
    sys.exit(main())
