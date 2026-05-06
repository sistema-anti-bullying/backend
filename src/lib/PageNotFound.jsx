import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center space-y-4">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="text-gray-600">Página não encontrada</p>
          <Button onClick={() => (window.location.href = '/')}>Voltar para a página inicial</Button>
        </CardContent>
      </Card>
    </div>
  )
}
