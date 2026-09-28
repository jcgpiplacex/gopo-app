import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import type { Hito, HitoFormData } from '../types'

export function useHitos(proyectoId: string) {
  return useQuery({
    queryKey: ['hitos', proyectoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hitos_proyecto')
        .select('*')
        .eq('proyecto_id', proyectoId)
        .order('orden', { ascending: true })

      if (error) throw new Error(error.message)
      return (data as Hito[]) || []
    },
    enabled: !!proyectoId
  })
}

export function useCrearHito() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (hito: HitoFormData) => {
      const { data, error } = await supabase
        .from('hitos_proyecto')
        .insert([hito])
        .select()

      if (error) throw new Error(error.message)
      return data[0] as Hito
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hitos', variables.proyecto_id] })
    }
  })
}

export function useActualizarHito() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, proyecto_id, ...hito }: Hito) => {
      const { data, error } = await supabase
        .from('hitos_proyecto')
        .update(hito)
        .eq('id', id)
        .select()

      if (error) throw new Error(error.message)
      return data[0] as Hito
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hitos', variables.proyecto_id] })
    }
  })
}

export function useEliminarHito() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (hito: Hito) => {
      const { error } = await supabase
        .from('hitos_proyecto')
        .delete()
        .eq('id', hito.id)

      if (error) throw new Error(error.message)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hitos', variables.proyecto_id] })
    }
  })
}