// Integración Mercado Pago — Next.js Server Action
// Instalar: npm install mercadopago

import { MercadoPagoConfig, Preference } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

export async function createPaymentPreference(items: {
  title: string
  quantity: number
  unit_price: number
}[]) {
  const preference = new Preference(client)

  const response = await preference.create({
    body: {
      items,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/pago/exitoso`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/pago/fallido`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/pago/pendiente`,
      },
      auto_return: 'approved',
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
    },
  })

  return response.init_point // URL de pago
}

// Webhook handler — app/api/webhooks/mercadopago/route.ts
export async function POST(req: Request) {
  const body = await req.json()

  if (body.type === 'payment') {
    const paymentId = body.data.id
    // Verificar pago y actualizar DB
  }

  return new Response('OK', { status: 200 })
}
