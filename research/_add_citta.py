#!/usr/bin/env python3
"""Inserisce voci in `cittaPagine` di un paese in frontend/src/content/paesi.js.

Uso: python3 research/_add_citta.py <paese-slug> <file.json>
Il JSON è una lista di oggetti {slug, nome, nota, desc, intro, local, faqLocal}.
Trova la fine dell'array con un piccolo lexer (salta stringhe, template literal
e commenti) così non si confonde con parentesi dentro i testi.
"""
import json, sys, io

paese = sys.argv[1]
data = json.load(open(sys.argv[2], encoding='utf-8'))
path = 'frontend/src/content/paesi.js'
s = open(path, encoding='utf-8').read()

i = s.find("{ slug: '%s'" % paese)
assert i >= 0, 'paese non trovato: %s' % paese
j = s.find('cittaPagine: [', i)
assert j >= 0, 'cittaPagine non trovato per %s' % paese
k = s.find('[', j)

# --- lexer minimale: trova il ']' che chiude l'array ---
depth = 0; p = k; n = len(s)
while p < n:
    c = s[p]
    if c in ("'", '"', '`'):
        q = c; p += 1
        while p < n:
            if s[p] == '\\': p += 2; continue
            if s[p] == q: break
            p += 1
        p += 1; continue
    if c == '/' and p + 1 < n and s[p+1] == '/':
        while p < n and s[p] != '\n': p += 1
        continue
    if c == '/' and p + 1 < n and s[p+1] == '*':
        p = s.find('*/', p) + 2; continue
    if c == '[': depth += 1
    elif c == ']':
        depth -= 1
        if depth == 0: break
    p += 1
end = p

head = s[:end].rstrip()
if not head.endswith(','): head += ','

def q(x):  # stringa JS fra doppi apici
    assert '"' not in x, 'doppio apice non ammesso: %r' % x[:60]
    return '"%s"' % x

out = []
for e in data:
    faq = ',\n'.join('          [%s, %s]' % (q(a), q(b)) for a, b in e['faqLocal'])
    out.append("      {\n        slug: '%s',\n        nome: '%s',\n        nota: %s,\n        desc: %s,\n        intro: %s,\n        local: `%s`,\n        faqLocal: [\n%s\n        ]\n      }," % (
        e['slug'], e['nome'], q(e['nota']), q(e['desc']), q(e['intro']), e['local'], faq))

s = head + '\n' + '\n'.join(out) + '\n    ' + s[end:]
open(path, 'w', encoding='utf-8').write(s)
print('inserite %d voci in cittaPagine/%s' % (len(data), paese))
