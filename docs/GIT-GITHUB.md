# Git + GitHub — come pubblicare il codice

Il repository è già inizializzato nel progetto (ramo `main`, commit iniziale creato).
Per pubblicarlo su GitHub servono solo questi passaggi (5 minuti).

## 1. Crea l'account GitHub (se non ce l'hai)

1. Vai su https://github.com → **Sign up**
2. Scegli un nome utente (es. `antonio-durso`) e una email
3. Verifica l'email dal messaggio che ricevi

## 2. Crea un nuovo repository

1. Clicca **+** in alto a destra → **New repository**
2. Nome: `adattoxte` (o quello che preferisci)
3. Lascia **Public** o **Private** (con Render/Vercel va bene anche Private)
4. **NON** spuntare "Add a README" (abbiamo già tutto)
5. Clicca **Create repository**

## 3. Collega il repository locale e fai il push

Sostituisci `IL-TUO-UTENTE` con il tuo nome utente GitHub e copia questi comandi
nel terminale, nella cartella del progetto:

```bash
git remote add origin https://github.com/IL-TUO-UTENTE/adattoxte.git
git branch -M main
git push -u origin main
```

Il terminale ti chiederà di autenticarti:
- **Password**: non è la password di GitHub ma un *Personal Access Token*:
  GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  → Generate new token → spunta `repo` → genera e copia
- In alternativa usa **GitHub Desktop** (app gratuita) che gestisce il push con un clic

## 4. Verifica

Apri `https://github.com/IL-TUO-UTENTE/adattoxte` → deve comparire il codice.
Ora il deploy è pronto: Vercel (frontend) e Render (backend) possono importare
questo repository — vedi `docs/DEPLOY-GRATUITO.md` e `docs/LANCIO-ONLINE.md`.

## Comandi utili per aggiornamenti futuri

```bash
git add -A                          # aggiunge tutte le modifiche
git commit -m "descrizione"         # crea il commit
git push                            # pubblica su GitHub
```
