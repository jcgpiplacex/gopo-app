import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import type { Cotizacion, CotizacionFormData } from '../types'

const COTIZACIONES_KEY = ['cotizaciones']

export function useCotizaciones() {
  return useQuery({
    queryKey: COTIZACIONES_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cotizaciones')
        .select('*')
        .order('fecha', { ascending: false })

      if (error) throw error
      return data as Cotizacion[]
    }
  })
}

export function useCotizacion(id: string) {
  return useQuery({
    queryKey: [...COTIZACIONES_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cotizaciones')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Cotizacion
    },
    enabled: !!id
  })
}

export function useCrearCotizacion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CotizacionFormData) => {
      const { data: cotizacion, error } = await supabase
        .from('cotizaciones')
        .insert([data])
        .select()
        .single()

      if (error) throw error
      return cotizacion
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COTIZACIONES_KEY })
    }
  })
}

export function useActualizarCotizacion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: CotizacionFormData & { id: string }) => {
      const { data: cotizacion, error } = await supabase
        .from('cotizaciones')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return cotizacion
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COTIZACIONES_KEY })
    }
  })
}

export function useEliminarCotizacion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cotizaciones')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COTIZACIONES_KEY })
    }
  })
}

export function useCrearCotizacionItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      const { data: item, error } = await supabase
        .from('cotizacion_items')
        .insert([data])
        .select()
        .single()

      if (error) throw error
      return item
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COTIZACIONES_KEY })
    }
  })
}

export function useEliminarCotizacionItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cotizacion_items')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COTIZACIONES_KEY })
    }
  })
}