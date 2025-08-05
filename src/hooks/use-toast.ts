import * as React from 'react'

interface ToastProps {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

// Hook básico para toast - será expandido posteriormente
export function useToast() {
  const toast = ({ title, description, variant = 'default' }: ToastProps) => {
    // Por enquanto, vamos usar um alert simples
    // Em produção, seria implementado um sistema completo de toast
    const message = `${title}${description ? ': ' + description : ''}`
    
    if (variant === 'destructive') {
      console.error(message)
      alert(`Erro: ${message}`)
    } else {
      console.log(message)
      // Em um sistema real, mostraria um toast visual
    }
  }

  return { toast }
}

// Hook para toast (versão expandida será implementada posteriormente)
export const toast = ({ title, description, variant = 'default' }: ToastProps) => {
  const message = `${title}${description ? ': ' + description : ''}`
  
  if (variant === 'destructive') {
    console.error(message)
    alert(`Erro: ${message}`)
  } else {
    console.log(message)
    // Em um sistema real, mostraria um toast visual
  }
}
