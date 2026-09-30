import re,glob,html
for f in sorted(glob.glob('blog/html/[a-z]*.html')+glob.glob('case-studies/html/[a-z]*.html')):
    s=open(f).read()
    # strip example-for-edit block
    i=s.find('example-for-edit'); 
    j=s.find('post-block-wrap',i)
    body=s[j:s.find('left-sticky-wrap',j)]
    tags={t:len(re.findall('<'+t+r'[\s>]',body)) for t in ['h1','h2','h3','h4','h5','h6','p','ul','ol','li','blockquote','figure','figcaption','img','iframe','a','strong','em','code','pre','table','sup','br']}
    emb=len(re.findall('w-embed',body)); inv=len(re.findall('post-block-wrap[^"]*w-condition-invisible',s))
    print(f.split('/')[-1][:50], len(re.sub('<[^>]+>','',body)), {k:v for k,v in tags.items() if v}, 'embeds',emb,'invisibleBlocks',inv)
