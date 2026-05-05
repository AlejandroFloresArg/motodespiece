'use client'

// src/components/BuyButton.tsx
// Recopila email del usuario y redirige al checkout de Stripe

import { useState } from 'react'

interface Props {
  manualId: string
  titulo: string
  precio: number
}

export default function BuyButton({ manualId, titulo, precio }: Props) {
  const [email, setEmail] = useState('')
  const [paso, setPaso] = useState<'idle' | 'email' | 'cargando' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleComprar() {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Ingresá un email válido para recibir el link de descarga.')
      return
    }
    setError('')
    setPaso('cargando')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ manualId, email }),
      })
      const data = await res.json()

      if (!res.ok || !data.url) {
        setError(data.error ?? 'Ocurrió un error. Intentá de nuevo.')
        setPaso('email')
        return
      }

      window.location.href = data.url
    } catch {
      setError('Error de conexión. Revisá tu internet e intentá de nuevo.')
      setPaso('email')
    }
  }

  if (paso === 'idle') {
    return (
      <button onClick={() => setPaso('email')} className="btn-primary text-base px-8 py-3">
        Comprar — descargar PDF
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-3 w-full max-w-xs">
      <p className="text-sm text-gray-600">
        Ingresá tu email para recibir el link de descarga:
      </p>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleComprar()}
        placeholder="tu@email.com"
        disabled={paso === 'cargando'}
        className="input-search"
        autoFocus
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        onClick={handleComprar}
        disabled={paso === 'cargando'}
        className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {paso === 'cargando' ? 'Redirigiendo…' : 'Continuar al pago →'}
      </button>
      <button
        onClick={() => { setPaso('idle'); setEmail(''); setError('') }}
        className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
      >
        Cancelar
      </button>
    </div>
  )
}
