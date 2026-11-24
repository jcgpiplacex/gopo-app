import { useEffect, useState } from 'react'

export function useUFValue() {
  const [ufValue, setUfValue] = useState<number>(38500) // Valor por defecto
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUFValue = async () => {
      try {
        setLoading(true)
        // Usando mindicador.cl (API gratuita chilena)
        const response = await fetch('https://mindicador.cl/api/uf')
        const data = await response.json()
        
        if (data.serie && data.serie.length > 0) {
          // Obtener el valor más reciente
          const latestValue = data.serie[0].valor
          setUfValue(latestValue)
          setError(null)
        }
      } catch (err) {
        console.error('Error fetching UF value:', err)
        setError('No se pudo obtener el valor de la UF')
        // Mantener el valor por defecto
      } finally {
        setLoading(false)
      }
    }

    fetchUFValue()
  }, [])

  return { ufValue, loading, error }
}