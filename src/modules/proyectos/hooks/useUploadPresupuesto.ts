import { supabase } from '../../../lib/supabase'

export function useUploadPresupuesto() {
  const uploadPresupuesto = async (proyectoId: string, file: File) => {
    try {
      // Nombre del archivo: presupuesto_[proyectoId]_[timestamp].xlsx
      const fileName = `presupuesto_${proyectoId}_${Date.now()}.xlsx`
      const filePath = `presupuestos/${fileName}`

      // Subir archivo a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('gopo-app')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Obtener URL pública
      const { data } = supabase.storage
        .from('gopo-app')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error('Error al subir presupuesto:', error)
      throw error
    }
  }

  return { uploadPresupuesto }
}