import json,sys,re
for fn in sys.argv[1:]:
    raw=open(fn).read()
    try:
        obj=json.loads(raw); s=obj.get('result',raw) if isinstance(obj,dict) else raw
    except Exception: s=raw
    try: arr=json.loads(s)
    except Exception: arr=[s]
    out=[]
    for i,r in enumerate(arr):
        if not isinstance(r,str): continue
        m=re.search(r'URL:\s*(\S+)',r)
        url=m.group(1) if m else '?'
        t=re.search(r'Text:\s*(.*)',r,re.S)
        text=t.group(1).strip() if t else r
        out.append(f"===== {i} | {url} =====\n{text}\n")
    open(fn.replace('.json','_txt.txt'),'w').write('\n'.join(out))
    print(fn, 'terms', len(arr), '->', fn.replace('.json','_txt.txt'))
