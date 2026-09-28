import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import type { Proyecto, ProyectoFormData } from '../types'

const PROYECTOS_KEY = ['proyectos']

export function useProyectos() {
  return useQuery({
    queryKey: PROYECTOS_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('proyectos')
        .select('*')
        .order('nombre', { ascending: true })

      if (error) throw new Error(error.message)
      return (data as Proyecto[]) || []
    }
  })
}

export function useProyecto(id: string) {
  return useQuery({
    queryKey: ['proyectos', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('proyectos')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw new Error(error.message)
      return data as Proyecto
    },
    enabled: !!id
  })
}

export function useCrearProyecto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (proyecto: ProyectoFormData) => {
      const { data, error } = await supabase
        .from('proyectos')
        .insert([proyecto])
        .select()

      if (error) throw new Error(error.message)
      return data[0] as Proyecto
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROYECTOS_KEY })
    }
  })
}

export function useActualizarProyecto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...proyecto }: Proyecto) => {
      const { data, error } = await supabase
        .from('proyectos')
        .update(proyecto)
        .eq('id', id)
        .select()

      if (error) throw new Error(error.message)
      return data[0] as Proyecto
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROYECTOS_KEY })
    }
  })
}

export function useEliminarProyecto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('proyectos')
        .delete()
        .eq('id', id)

      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROYECTOS_KEY })
    }
  })
}