import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import type { Cliente, ClienteFormData } from '../types'

const CLIENTES_KEY = ['clientes']

export function useClientes() {
  return useQuery({
    queryKey: CLIENTES_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('nombre', { ascending: true })

      if (error) throw new Error(error.message)
      return (data as Cliente[]) || []
    }
  })
}

export function useCrearCliente() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (cliente: ClienteFormData) => {
      const { data, error } = await supabase
        .from('clientes')
        .insert([cliente])
        .select()

      if (error) throw new Error(error.message)
      return data[0] as Cliente
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTES_KEY })
    }
  })
}

export function useActualizarCliente() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...cliente }: Cliente) => {
      const { data, error } = await supabase
        .from('clientes')
        .update(cliente)
        .eq('id', id)
        .select()

      if (error) throw new Error(error.message)
      return data[0] as Cliente
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTES_KEY })
    }
  })
}

export function useEliminarCliente() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id)

      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTES_KEY })
    }
  })
}