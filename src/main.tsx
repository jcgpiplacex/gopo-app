import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'

// Link a Tabler Icons
const link = document.createElement('link')
link.rel = 'stylesheet'
link.href = 'https://cdn.jsdelivr.net/npm/@tabler/icons@latest/tabler-icons.min.css'
document.head.appendChild(link)

// Crear el cliente de React Query
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)