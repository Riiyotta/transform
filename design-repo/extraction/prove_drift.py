#!/usr/bin/env python3
"""Proves the drift checks in extraction/verify_all.py actually FAIL on bad input.

A check that has never been seen to fail may not be checking anything. For each injection this script:
  1. copies the whole repo to a scratch directory (never touching the real files),
  2. injects one defect (a phantom allowlist entry, an orphan contract, an out-of-range citation,
     an in-range-but-wrong citation, a stale count, a pinned asset role changed to a DIFFERENT valid
     value, an absolute path, a graph rule dropped, ...),
  3. runs verify_all.py on the copy and requires a non-zero exit and the expected check/message,
and finally confirms the pristine repo still passes.

Usage:  python3 extraction/prove_drift.py [--source-root DIR]
The citation injections need the source project tree (pass --source-root, or run with the repo beside
its source project); without it they are reported SKIPPED, never silently passed.
Exit code 0 only if every executed injection was caught and the pristine repo passes.
"""
import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VERIFY = os.path.join('extraction', 'verify_all.py')


def jl(base, rel):
    with open(os.path.join(base, rel), encoding='utf-8') as f:
        return json.load(f)


def js(base, rel, obj):
    with open(os.path.join(base, rel), 'w', encoding='utf-8') as f:
        json.dump(obj, f, indent=2, ensure_ascii=False)
        f.write('\n')


def run_verify(base, source):
    cmd = [sys.executable, '-B', os.path.join(base, VERIFY), '--quiet']
    if source:
        cmd += ['--source-root', source]
    p = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, universal_newlines=True, env=dict(os.environ, PYTHONDONTWRITEBYTECODE='1'))
    return p.returncode, p.stdout


INJECTIONS = []  # (name, needs_source, expected_check, expected_text, fn(base))


def inj(name, check, text, needs_source=False):
    def deco(fn):
        INJECTIONS.append((name, needs_source, check, text, fn))
        return fn
    return deco


@inj('phantom allowlist entry (no contract file)', 'allowlist parity', 'PHANTOM allowlist entry')
def _(b):
    al = jl(b, 'tokens/llm/component-allowlist.json')
    al['entries'].append({'id': 'phantom.section', 'kind': 'section', 'file': 'sections/phantom.section.json', 'overridable': [], 'variants': [], 'motionPatterns': []})
    js(b, 'tokens/llm/component-allowlist.json', al)


@inj('orphan contract file (no allowlist entry)', 'allowlist parity', 'ORPHAN contract file')
def _(b):
    d = jl(b, 'sections/shell.preloader.json')
    d['id'] = 'shell.orphan'
    js(b, 'sections/shell.orphan.json', d)


@inj('allowlistVersion drifts from the manifest', 'allowlist parity', 'allowlistVersion')
def _(b):
    al = jl(b, 'tokens/llm/component-allowlist.json')
    al['version'] = '9.9.9'
    js(b, 'tokens/llm/component-allowlist.json', al)


@inj('allowlist lists a node property the schema does not have', 'allowlist parity', 'nodeProperties')
def _(b):
    al = jl(b, 'tokens/llm/component-allowlist.json')
    al['nodeProperties'].append('style')
    js(b, 'tokens/llm/component-allowlist.json', al)


@inj('allowlist asset role set differs from the schema enum', 'allowlist parity', 'assetRole enum differs')
def _(b):
    al = jl(b, 'tokens/llm/component-allowlist.json')
    al['assetRoles'].append('hero.stock-photo')
    js(b, 'tokens/llm/component-allowlist.json', al)


def _retarget_citation(b, new_ref, ledger_patch):
    """Point one section citation (and its ledger entry) at new_ref."""
    sec = jl(b, 'sections/hero.home.json')
    old = sec['measuredFrom'][0]
    sec['measuredFrom'][0] = new_ref
    js(b, 'sections/hero.home.json', sec)
    mv = jl(b, 'extraction/measured-values.json')
    entry = dict(mv['citations'][old])
    entry.update(ledger_patch)
    mv['citations'][new_ref] = entry
    js(b, 'extraction/measured-values.json', mv)


@inj('out-of-range citation (range exceeds the real file)', 'citation ranges', 'OUT OF RANGE', needs_source=True)
def _(b):
    old = jl(b, 'sections/hero.home.json')['measuredFrom'][0]
    path = jl(b, 'extraction/measured-values.json')['citations'][old]['path']
    _retarget_citation(b, '%s:99990-99999' % path, {'start': 99990, 'end': 99999})


@inj('in-range but WRONG-CODE citation (valid lines, different content)', 'citation ranges', 'WRONG CODE', needs_source=True)
def _(b):
    old = jl(b, 'sections/hero.home.json')['measuredFrom'][0]
    path = jl(b, 'extraction/measured-values.json')['citations'][old]['path']
    _retarget_citation(b, '%s:1-1' % path, {'start': 1, 'end': 1})


@inj('citation used in a contract but absent from the ledger', 'citation ranges', 'missing from extraction/measured-values.json')
def _(b):
    sec = jl(b, 'sections/hero.home.json')
    sec['measuredFrom'].append('CLONE_SPEC.md:1-2')
    js(b, 'sections/hero.home.json', sec)


@inj('manifest count is wrong (sections 44)', 'counts', 'manifest counts')
def _(b):
    m = jl(b, 'registry.manifest.json')
    m['counts']['sections'] = 44
    js(b, 'registry.manifest.json', m)


@inj('README counts table is stale (Sections 42)', 'counts', 'README table Sections')
def _(b):
    p = os.path.join(b, 'README.md')
    t = open(p, encoding='utf-8').read()
    import re
    t = re.sub(r'(\|\s*Sections\s*\|\s*)\d+(\s*\|)', r'\g<1>42\2', t)
    open(p, 'w', encoding='utf-8').write(t)


@inj('CHANGELOG counts marker is stale', 'counts', 'CHANGELOG.md counts marker stale')
def _(b):
    p = os.path.join(b, 'CHANGELOG.md')
    t = open(p, encoding='utf-8').read().replace('sections=43', 'sections=41')
    open(p, 'w', encoding='utf-8').write(t)


@inj('pinned asset role changed to a DIFFERENT but valid policy (client.logo -> may-generate-new)', 'asset roles', 'PINNED role client.logo')
def _(b):
    r = jl(b, 'assets/asset-roles.json')
    r['roles']['client.logo']['generationPolicy'] = 'may-generate-new'
    js(b, 'assets/asset-roles.json', r)


@inj('pinned role AND the registry pin both rewritten (verify keeps its own authoritative copy)', 'asset roles', 'PINNED role person.photo')
def _(b):
    r = jl(b, 'assets/asset-roles.json')
    r['roles']['person.photo']['generationPolicy'] = 'may-generate-new'
    r['pinnedRoles']['person.photo'] = 'may-generate-new'
    js(b, 'assets/asset-roles.json', r)


@inj('must-not-fabricate role allowed to generate in a derivative', 'asset roles', 'must-not-fabricate role allows generate')
def _(b):
    r = jl(b, 'assets/asset-roles.json')
    r['roles']['certification.badge']['allowedRefKinds']['generated-derivative'] = ['generate']
    js(b, 'assets/asset-roles.json', r)


@inj('graph rule removed while the validator still implements it', 'graph <-> validator', 'graph rule ids')
def _(b):
    g = jl(b, 'compatibility/graph.json')
    g['rules'] = [r for r in g['rules'] if r['id'] != 'TRANSITION_PAIR_ORDER']
    js(b, 'compatibility/graph.json', g)


@inj('phantom graph rule that the validator does not implement', 'graph <-> validator', 'graph rule ids')
def _(b):
    g = jl(b, 'compatibility/graph.json')
    g['rules'].append({'id': 'GHOST_RULE', 'severity': 'error', 'description': 'x', 'exceptions': [], 'measuredFrom': ['CLONE_SPEC.md:1']})
    js(b, 'compatibility/graph.json', g)


@inj('manifest entryPoint pointing outside the package', 'self-containment', 'entryPoint outside repo')
def _(b):
    m = jl(b, 'registry.manifest.json')
    m['entryPoints']['docs']['readme'] = '../README.md'
    js(b, 'registry.manifest.json', m)


@inj('absolute machine path in a doc', 'self-containment', 'absolute path')
def _(b):
    p = os.path.join(b, 'README.md')
    with open(p, 'a', encoding='utf-8') as f:
        f.write('\nSee ' + '/Us' + 'ers/someone/project\n')


@inj('section content schema drifts from the schema branch', 'schema parity', 'content schema drift')
def _(b):
    d = jl(b, 'sections/hero.home.json')
    d['content']['properties']['introLabel']['maxWords'] = 99
    js(b, 'sections/hero.home.json', d)


@inj('motion object opened (additionalProperties true)', 'schema parity', 'definitions/motion is not closed')
def _(b):
    s = jl(b, 'schema/pagespec.schema.json')
    s['definitions']['motion']['additionalProperties'] = True
    js(b, 'schema/pagespec.schema.json', s)


@inj('content object schema opened (additionalProperties true) in schema and contract', 'schema parity', 'open object')
def _(b):
    d = jl(b, 'sections/hero.home.json')
    d['content']['additionalProperties'] = True
    js(b, 'sections/hero.home.json', d)
    s = jl(b, 'schema/pagespec.schema.json')
    for br in s['properties']['nodes']['items']['allOf'][1:]:
        if br['if']['properties']['section']['const'] == 'hero.home':
            br['then']['properties']['content']['additionalProperties'] = True
    js(b, 'schema/pagespec.schema.json', s)


@inj('maxWords not equal to roundup5(observedMax)', 'word budgets', 'roundup5')
def _(b):
    d = jl(b, 'sections/hero.home.json')
    d['content']['properties']['introLabel']['maxWords'] = 7
    js(b, 'sections/hero.home.json', d)
    s = jl(b, 'schema/pagespec.schema.json')
    for br in s['properties']['nodes']['items']['allOf'][1:]:
        if br['if']['properties']['section']['const'] == 'hero.home':
            br['then']['properties']['content']['properties']['introLabel']['maxWords'] = 7
    js(b, 'schema/pagespec.schema.json', s)


@inj('theme drops a semantic token mapping', 'tokens', 'does not map exactly the semantic tokens')
def _(b):
    t = jl(b, 'tokens/themes/light.json')
    del t['mappings']['border.default']
    js(b, 'tokens/themes/light.json', t)


@inj('token alias that resolves to nothing', 'tokens', 'unresolved alias')
def _(b):
    c = jl(b, 'tokens/20-component/component.json')
    c['component']['navbar']['tokens']['background'] = '{semantic.surface.nonexistent}'
    js(b, 'tokens/20-component/component.json', c)


@inj('section without a reducedMotionFallback', 'schema meta', 'reducedMotionFallback')
def _(b):
    d = jl(b, 'sections/shell.navbar.json')
    del d['motion']['reducedMotionFallback']
    js(b, 'sections/shell.navbar.json', d)


@inj('status flipped to production-approved', 'versions', 'productionApproved must be false')
def _(b):
    m = jl(b, 'registry.manifest.json')
    m['productionApproved'] = True
    js(b, 'registry.manifest.json', m)


@inj('template route assigned to two templates', 'templates / routes', 'route assigned twice')
def _(b):
    r = jl(b, 'templates/routes.json')
    r['routes'].append(dict(r['routes'][0], template='template.compare'))
    js(b, 'templates/routes.json', r)


@inj('template shell flag disagrees with its node list', 'templates / routes', 'shell flags disagree')
def _(b):
    t = jl(b, 'templates/templates.json')
    for x in t['templates']:
        if x['id'] == 'template.legal':
            x['shell']['modal'] = True
    js(b, 'templates/templates.json', t)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--source-root', default=None)
    a = ap.parse_args()
    source = a.source_root
    if not source:
        cand = os.path.dirname(ROOT)
        if os.path.isfile(os.path.join(cand, 'CLONE_SPEC.md')):
            source = cand
    caught = skipped = 0
    failures = []
    print('prove_drift: source tree %s' % ('present' if source else 'ABSENT (citation injections will be SKIPPED)'))
    # pristine repo first
    rc, out = run_verify(ROOT, source)
    print('  %-8s pristine repo passes verify_all (exit %d)' % ('OK' if rc == 0 else 'BAD', rc))
    if rc != 0:
        failures.append('pristine repo does not pass verify_all:\n' + out[-1500:])
    for name, needs_source, check, text, fn in INJECTIONS:
        if needs_source and not source:
            skipped += 1
            print('  %-8s %s' % ('SKIPPED', name))
            continue
        scratch = tempfile.mkdtemp(prefix='t9_drift_')
        try:
            copy = os.path.join(scratch, 'design-repo')
            shutil.copytree(ROOT, copy, ignore=shutil.ignore_patterns('__pycache__', '*.pyc'))
            fn(copy)
            rc, out = run_verify(copy, source)
        finally:
            shutil.rmtree(scratch, ignore_errors=True)
        ok = rc != 0 and ('FAIL %s' % check in ' '.join(out.split()) or ('FAIL' in out and check in out)) and text in out
        caught += ok
        print('  %-8s [%s] %s' % ('CAUGHT' if ok else 'MISSED!', check, name))
        if not ok:
            failures.append('injection not caught: %s (exit %d, wanted %r in output)\n%s' % (name, rc, text, out[-800:]))
    # and the pristine repo again, after all injections, to prove the real files were never touched
    rc2, _ = run_verify(ROOT, source)
    print('  %-8s pristine repo still passes after all injections (exit %d)' % ('OK' if rc2 == 0 else 'BAD', rc2))
    if rc2 != 0:
        failures.append('pristine repo failed after injections')
    print('\ninjections executed: %d  caught: %d  skipped: %d' % (len(INJECTIONS) - skipped, caught, skipped))
    if failures:
        print('\nFAILURES:')
        for f in failures:
            print('  - ' + f)
        return 1
    print('PROVE_DRIFT: every injected drift was caught; the real repo passes')
    return 0


if __name__ == '__main__':
    sys.exit(main())
