import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import type { Producto, ProductoFormData } from '../types'

const PRODUCTOS_KEY = ['productos']

export function useProductos() {
  return useQuery({
    queryKey: PRODUCTOS_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('activo', true)
        .order('nombre', { ascending: true })

      if (error) throw error
      return data as Producto[]
    }
  })
}

export function useCrearProducto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ProductoFormData) => {
      const { data: producto, error } = await supabase
        .from('productos')
        .insert([data])
        .select()
        .single()

      if (error) throw error
      return producto
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTOS_KEY })
    }
  })
}

export function useActualizarProducto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: ProductoFormData & { id: string }) => {
      const { data: producto, error } = await supabase
        .from('productos')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return producto
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTOS_KEY })
    }
  })
}

export function useEliminarProducto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('productos')
        .update({ activo: false })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTOS_KEY })
    }
  })
}