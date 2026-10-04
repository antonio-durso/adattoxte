#!/usr/bin/env python3
"""Fetch a URL (curl) and print readable text.

usage:
  python3 _fetch.py <url> [needle] [maxchars]
      -> prints paragraphs; if needle (regex) given, prints matching paragraphs.
  python3 _fetch.py --links <url> [pattern]
      -> prints absolute links matching pattern.
  python3 _fetch.py --wiki <query>
      -> prints top Wikipedia (it+en) search hits.
"""
import sys, re, html, subprocess, json, urllib.parse

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"


def curl(url, follow=True):
    args = ["curl", "-sS", "-m", "30", "-A", UA]
    if follow:
        args.append("-L")
    args.append(url)
    p = subprocess.run(args, capture_output=True, text=True, errors="ignore")
    return p.stdout or ""


def strip(t):
    t = re.sub(r"(?is)<(script|style|nav|footer|header|svg|form|noscript)[^>]*>.*?</\1>", " ", t)
    t = re.sub(r"(?i)<br\s*/?>|</p>|</li>|</h[1-6]>|</tr>|</div>", "\n", t)
    t = re.sub(r"(?s)<[^>]+>", " ", t)
    t = html.unescape(t)
    t = re.sub(r"[ \t\xa0]+", " ", t)
    t = re.sub(r"\n +", "\n", t)
    t = re.sub(r"\n{2,}", "\n", t)
    return t.strip()


def paragraphs(t):
    return [p.strip() for p in t.split("\n") if len(p.strip()) > 15]


def main():
    a = sys.argv[1:]
    if not a:
        print(__doc__)
        return
    if a[0] == "--wiki":
        q = " ".join(a[1:])
        for lang in ("it", "en"):
            url = ("https://%s.wikipedia.org/w/api.php?action=query&list=search&format=json"
                   "&srlimit=5&srsearch=%s" % (lang, urllib.parse.quote(q)))
            try:
                d = json.loads(curl(url))
            except Exception as e:
                print("ERR", lang, e)
                continue
            print(f"--- wiki {lang}: {q} ---")
            for r in d.get("query", {}).get("search", []):
                print(" *", r["title"])
        return
    if a[0] == "--links":
        url = a[1]
        pat = a[2] if len(a) > 2 else ""
        t = curl(url)
        seen = set()
        for m in re.finditer(r'(?i)href="([^"]+)"', t):
            l = html.unescape(m.group(1))
            if l.startswith("/"):
                l = urllib.parse.urljoin(url, l)
            if not l.startswith("http"):
                continue
            if pat and not re.search(pat, l, re.I):
                continue
            if l in seen:
                continue
            seen.add(l)
            print(l)
        return
    url = a[0]
    needle = a[1] if len(a) > 1 else None
    maxc = int(a[2]) if len(a) > 2 else 3000
    t = strip(curl(url))
    if needle:
        for p in paragraphs(t):
            if re.search(needle, p, re.I):
                print(p)
    else:
        print(t[:maxc])


if __name__ == "__main__":
    main()
