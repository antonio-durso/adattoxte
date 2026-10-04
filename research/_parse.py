import json,sys
fn=sys.argv[1]
raw=open(fn).read()
try:
    obj=json.loads(raw)
    s=obj.get('result',raw) if isinstance(obj,dict) else raw
except Exception:
    s=raw
try:
    arr=json.loads(s)
except Exception:
    arr=[s]
for i,r in enumerate(arr):
    if not isinstance(r,str): 
        print('ROW',i,r); continue
    # split text
    print('#### ROW',i)
    print(r[:2500])
    print('='*90)
