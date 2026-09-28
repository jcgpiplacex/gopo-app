import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import type { FacturaRecibida, FacturaRecibidaFormData } from '../types'

const FACTURAS_KEY = ['facturas_recibidas']

export function useFacturasRecibidas() {
  return useQuery({
    queryKey: FACTURAS_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('facturas_recibidas')
        .select('*')
        .order('fecha_factura', { ascending: false })

      if (error) throw error
      return data as FacturaRecibida[]
    }
  })
}

export function useFacturaRecibida(id: string) {
  return useQuery({
    queryKey: [...FACTURAS_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('facturas_recibidas')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as FacturaRecibida
    },
    enabled: !!id
  })
}

export function useCrearFacturaRecibida() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: FacturaRecibidaFormData) => {
      const { data: factura, error } = await supabase
        .from('facturas_recibidas')
        .insert([data])
        .select()
        .single()

      if (error) throw error
      return factura
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FACTURAS_KEY })
    }
  })
}

export function useActualizarFacturaRecibida() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: FacturaRecibidaFormData & { id: string }) => {
      const { data: factura, error } = await supabase
        .from('facturas_recibidas')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return factura
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FACTURAS_KEY })
    }
  })
}

export function useEliminarFacturaRecibida() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('facturas_recibidas')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FACTURAS_KEY })
    }
  })
}