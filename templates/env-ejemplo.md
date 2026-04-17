# Variables de Entorno — Template

Copiar como `.env.local` en cada proyecto nuevo. Completar los valores reales.
Nunca commitear este archivo con valores reales.

---

## .env.local

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://XXXXXXXXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# JWT
JWT_SECRET=un-string-largo-y-random-de-al-menos-32-chars

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
MERCADOPAGO_PUBLIC_KEY=APP_USR-...

# Resend / Email
RESEND_API_KEY=re_...
EMAIL_FROM=hola@tudominio.com

# Stripe (si aplica)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Google (si aplica)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Prisma (si se usa con Supabase)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
```

## .env.example (commitear esto, sin valores)

```env
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_PUBLIC_KEY=
RESEND_API_KEY=
EMAIL_FROM=
DATABASE_URL=
DIRECT_URL=
```

## Notas
- `NEXT_PUBLIC_*` es visible en el browser — nunca poner secrets ahí
- `SUPABASE_SERVICE_ROLE_KEY` solo en server — nunca exponer al cliente
- Generar JWT_SECRET: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
