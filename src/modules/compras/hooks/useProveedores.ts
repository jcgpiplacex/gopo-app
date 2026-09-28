import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import type { Proveedor, ProveedorFormData } from '../types'

const PROVEEDORES_KEY = ['proveedores']

export function useProveedores() {
  return useQuery({
    queryKey: PROVEEDORES_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('proveedores')
        .select('*')
        .order('nombre', { ascending: true })

      if (error) throw new Error(error.message)
      return (data as Proveedor[]) || []
    }
  })
}

export function useCrearProveedor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (proveedor: ProveedorFormData) => {
      const { data, error } = await supabase
        .from('proveedores')
        .insert([proveedor])
        .select()

      if (error) throw new Error(error.message)
      return data[0] as Proveedor
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROVEEDORES_KEY })
    }
  })
}

export function useActualizarProveedor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...proveedor }: Proveedor) => {
      const { data, error } = await supabase
        .from('proveedores')
        .update(proveedor)
        .eq('id', id)
        .select()

      if (error) throw new Error(error.message)
      return data[0] as Proveedor
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROVEEDORES_KEY })
    }
  })
}

export function useEliminarProveedor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('proveedores')
        .delete()
        .eq('id', id)

      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROVEEDORES_KEY })
    }
  })
}