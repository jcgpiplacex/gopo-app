import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import type { OrdenCompra, OrdenCompraFormData } from '../types'

const ORDENES_KEY = ['ordenes_compra']

export function useOrdenesCompra() {
  return useQuery({
    queryKey: ORDENES_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ordenes_compra')
        .select('*')
        .order('fecha', { ascending: false })

      if (error) throw error
      return data as OrdenCompra[]
    }
  })
}

export function useOrdenCompra(id: string) {
  return useQuery({
    queryKey: [...ORDENES_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ordenes_compra')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as OrdenCompra
    },
    enabled: !!id
  })
}

export function useCrearOrdenCompra() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: OrdenCompraFormData) => {
      const { data: orden, error } = await supabase
        .from('ordenes_compra')
        .insert([data])
        .select()
        .single()

      if (error) throw error
      return orden
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDENES_KEY })
    }
  })
}

export function useActualizarOrdenCompra() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: OrdenCompraFormData & { id: string }) => {
      const { data: orden, error } = await supabase
        .from('ordenes_compra')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return orden
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDENES_KEY })
    }
  })
}

export function useEliminarOrdenCompra() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ordenes_compra')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDENES_KEY })
    }
  })
}

export function useCrearOrdenCompraItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      const { data: item, error } = await supabase
        .from('orden_compra_items')
        .insert([data])
        .select()
        .single()

      if (error) throw error
      return item
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDENES_KEY })
    }
  })
}

export function useEliminarOrdenCompraItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('orden_compra_items')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDENES_KEY })
    }
  })
}