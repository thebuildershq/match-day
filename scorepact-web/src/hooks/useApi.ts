import { useAuth } from '@clerk/clerk-react'
import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query'
import { apiFetch } from '../lib/api'

export function useApiQuery<T>(
  key: readonly unknown[],
  path: string,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  const { getToken, isLoaded, isSignedIn } = useAuth()

  return useQuery<T>({
    queryKey: key,
    queryFn: async () => {
      const token = await getToken()
      return apiFetch<T>(path, { token })
    },
    ...options,
    enabled: isLoaded && isSignedIn && (options?.enabled ?? true),
  })
}

export function useApiMutation<TData, TVariables = void>(
  path: string | ((vars: TVariables) => string),
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'>
) {
  const { getToken } = useAuth()

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (vars: TVariables) => {
      const token = await getToken()
      const resolvedPath = typeof path === 'function' ? path(vars) : path
      return apiFetch<TData>(resolvedPath, { method, body: vars, token })
    },
    ...options,
  })
}