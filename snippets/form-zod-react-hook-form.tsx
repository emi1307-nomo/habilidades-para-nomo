// Formulario con Zod + React Hook Form + Server Action
// Instalar: npm install react-hook-form zod @hookform/resolvers

'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useActionState } from 'react'

// 1. Schema de validación
const schema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  mensaje: z.string().min(10, 'Mínimo 10 caracteres'),
})

type FormData = z.infer<typeof schema>

// 2. Server Action
export async function submitForm(prevState: unknown, formData: FormData) {
  'use server'

  const parsed = schema.safeParse({
    nombre: formData.get('nombre'),
    email: formData.get('email'),
    mensaje: formData.get('mensaje'),
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  // Procesar datos...
  await sendEmail(parsed.data)

  return { success: true }
}

// 3. Componente
export function ContactForm() {
  const [state, action, pending] = useActionState(submitForm, null)

  const { register, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <input
          {...register('nombre')}
          name="nombre"
          placeholder="Tu nombre"
          className="w-full border rounded px-3 py-2"
        />
        {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
      </div>

      <div>
        <input
          {...register('email')}
          name="email"
          type="email"
          placeholder="Tu email"
          className="w-full border rounded px-3 py-2"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <textarea
          {...register('mensaje')}
          name="mensaje"
          placeholder="Tu mensaje"
          className="w-full border rounded px-3 py-2"
          rows={4}
        />
        {errors.mensaje && <p className="text-red-500 text-sm">{errors.mensaje.message}</p>}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-primary text-white px-6 py-3 rounded-lg disabled:opacity-50"
      >
        {pending ? 'Enviando...' : 'Enviar mensaje'}
      </button>

      {state?.success && <p className="text-green-500">¡Mensaje enviado!</p>}
    </form>
  )
}
