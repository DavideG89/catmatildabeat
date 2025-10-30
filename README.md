# matildathecat

## Impostazione arrivo email (modulo Contatti)

Per ricevere i messaggi del form Contatti all'indirizzo `matildathecat.meow@gmail.com` è stato aggiunto l'endpoint `POST /api/contact` che invia una email via SMTP (Nodemailer).

### Variabili d'ambiente richieste

Impostare in `.env.local` (o su Vercel)

```
# Destinatario (default: matildathecat.meow@gmail.com)
CONTACT_TO_EMAIL=matildathecat.meow@gmail.com

# (Opzionale) Mittente visibile nella mail
CONTACT_FROM_EMAIL=matildathecat.meow@gmail.com

# Config SMTP (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=matildathecat.meow@gmail.com
SMTP_PASS=<APP_PASSWORD_GOOGLE>
```

Nota: con Gmail è necessario usare una App Password (non la password normale). Passi:

1. Abilita l'autenticazione a due fattori (2FA) sull'account Gmail
2. Vai su Gestione account Google → Sicurezza → Password per le app
3. Crea una nuova App Password (scegli qualunque nome, es. "Website")
4. Copia la password generata in `SMTP_PASS`

### Come funziona

- Il form in `app/contact/page.tsx` invia una `POST /api/contact` con: `name`, `email`, `subject`, `message`.
- L'API valida i campi e invia la mail al destinatario configurato.
- In caso di errore, il form mostra un messaggio di errore.

### Endpoint

- Codice API: `app/api/contact/route.ts`

Se preferisci un provider come Resend/SendGrid invece di Gmail, basta aggiornare la configurazione SMTP e le credenziali.
