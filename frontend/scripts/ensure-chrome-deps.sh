#!/bin/sh
# Diagnostica + installazione best-effort delle librerie di sistema per Chrome headless.
# Usato nel build (Vercel): se l'installazione fallisce, il build continua e il
# prerender salta come prima (il sito funziona comunque via rendering JS).
echo "== env: $(id 2>&1) =="
grep -m1 PRETTY_NAME /etc/os-release 2>/dev/null || echo "os-release non trovato"
echo "== package manager: apt=$(command -v apt-get) yum=$(command -v yum) dnf=$(command -v dnf) sudo=$(command -v sudo) =="
if command -v apt-get >/dev/null 2>&1; then
  echo "== apt-get update =="
  apt-get update 2>&1 | tail -2 || echo "apt-get update FALLITO"
  echo "== apt-get install librerie Chrome =="
  apt-get install -y libnspr4 libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2 libpango-1.0-0 libcairo2 2>&1 | tail -4 || echo "apt-get install FALLITO"
elif command -v yum >/dev/null 2>&1; then
  echo "== yum install (Amazon Linux) =="
  yum install -y nss nspr atk at-spi2-atk cups-libs libdrm libxkbcommon libXcomposite libXdamage libXfixes libXrandr libgbm alsa-lib pango cairo 2>&1 | tail -4 || echo "yum install FALLITO"
else
  echo "Nessun package manager disponibile: prerender resterà disattivato"
fi
