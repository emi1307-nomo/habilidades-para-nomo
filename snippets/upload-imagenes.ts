// Upload de imágenes — Supabase Storage + Next.js
// Instalar: npm install @supabase/supabase-js

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Server Action — upload de imagen
export async function uploadImage(formData: FormData, folder: string) {
  const file = formData.get('image') as File
  if (!file) return { error: 'No se recibió imagen' }

  // Validar tipo y tamaño
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) return { error: 'Tipo de archivo no permitido' }
  if (file.size > 5 * 1024 * 1024) return { error: 'La imagen no puede superar 5MB' }

  const ext = file.name.split('.').pop()
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from('images')
    .upload(filename, file, { contentType: file.type, upsert: false })

  if (error) return { error: error.message }

  const { data } = supabase.storage.from('images').getPublicUrl(filename)
  return { url: data.publicUrl }
}

// Eliminar imagen
export async function deleteImage(url: string) {
  const path = url.split('/storage/v1/object/public/images/')[1]
  await supabase.storage.from('images').remove([path])
}

// Componente React — Input de imagen con preview
'use client'
import { useState } from 'react'

export function ImageUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
    setLoading(true)

    const formData = new FormData()
    formData.append('image', file)

    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()

    if (data.url) onUpload(data.url)
    setLoading(false)
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleChange} />
      {loading && <p>Subiendo...</p>}
      {preview && <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded" />}
    </div>
  )
}
