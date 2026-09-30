# Extract rules from the shared Webflow CSS that reference classes used on the blog/case-study pages; group by media query.
import re,glob,sys
css=open('tools/shared.css').read()
home=open('../homepage-rules.css').read()
homecls=set(re.findall(r'\.(-?[_a-zA-Z][\w-]*)',home))
cls=set()
for f in glob.glob('blog/outline-*.txt')+glob.glob('case-studies/outline-*.txt'):
    for line in open(f):
        m=re.match(r'\s*[a-z0-9]+((?:\.[\w-]+)+)',line)
        if m: cls.update(m.group(1).strip('.').split('.'))
cls-= {''}
# tokenize css into (media, selector, body)
out=[];i=0;media='base'
def walk(s,media):
    i=0
    while i<len(s):
        j=s.find('{',i)
        if j<0: break
        sel=s[i:j].strip()
        if sel.startswith('@media') or sel.startswith('@supports'):
            d=1;k=j+1
            while d: 
                if s[k]=='{': d+=1
                elif s[k]=='}': d-=1
                k+=1
            walk(s[j+1:k-1],sel); i=k; continue
        k=s.find('}',j); out.append((media,sel,s[j+1:k].strip())); i=k+1
walk(css,'base')
rich=('rich-text-post','w-richtext','post-body','blog','post','cs','share','read-next','featured','pagination','load-more','preloader','bg-pixels','cl-','highlight-text','articles','left-sticky','page-count','icon-w-text','back-')
groups={}
for media,sel,body in out:
    sc=set(re.findall(r'\.(-?[_a-zA-Z][\w-]*)',sel))
    if sc & cls and (sc-homecls or any(r in sel for r in rich)):
        groups.setdefault(media,[]).append(f'{sel} {{{body}}}')
with open('page-rules.css','w') as w:
    for m in ['base']+[k for k in groups if k!='base']:
        if m in groups:
            w.write(f'\n/* ===== {m} ===== */\n'+'\n'.join(groups[m])+'\n')
new=sorted(c for c in cls if c not in homecls)
open('new-classes.txt','w').write('\n'.join(new))
print(len(cls),'classes;',len(new),'not in homepage-rules;', sum(len(v) for v in groups.values()),'rules')
