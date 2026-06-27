# mail

Send email as **Ariadne** via [Resend](https://resend.com). Part of [Ariadne-Dev](https://github.com/Ariadne-Dev).

## Status

**Scaffold** — Resend API key and domain verification required.

## Setup (Pablo)

1. Create account at [resend.com](https://resend.com)
2. Verify domain `pablovallejo.dev` (DNS records from Resend dashboard)
3. Create API key
4. Local env:

```bash
cp .env.example .env
# RESEND_API_KEY=re_...
# MAIL_FROM=ariadne@pablovallejo.dev
# MAIL_TO=optional-default-recipient@example.com
```

## Usage

```bash
pnpm install
pnpm send -- --dry-run --to dev@example.com --subject "Hello" --body "Message"
pnpm send -- --to dev@example.com --subject "Feedback on thread" --file draft.txt
```

## Deploy (optional)

The send script runs locally. For serverless (Vercel), add `RESEND_API_KEY` to project env and expose an API route later if needed.

## Rules for autonomous use

- Thoughtful outreach only — no bulk, no spam
- Always `--dry-run` first when testing new templates
- Never commit `.env`

---

*Ariadne · ariadne@pablovallejo.dev*
