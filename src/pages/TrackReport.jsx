import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useParams } from "react-router-dom"

export default function TrackReport() {
  const { reportId } = useParams()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/reports/${reportId}`)
      const data = await response.json()
      setReport(data)
    } catch (error) {
      console.error("Erro ao buscar denúncia:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Acompanhar Denúncia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                placeholder="Digite o número do protocolo"
                value={reportId || ""}
                readOnly
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? "Buscando..." : "Buscar Status"}
            </Button>

            {report && (
              <div className="border-t pt-4 space-y-4">
                <div>
                  <h3 className="font-semibold">Status</h3>
                  <Badge>{report.status || "Pendente"}</Badge>
                </div>
                <div>
                  <h3 className="font-semibold">Data de Denúncia</h3>
                  <p>{new Date(report.created_at).toLocaleDateString("pt-BR")}</p>
                </div>
                {report.description && (
                  <div>
                    <h3 className="font-semibold">Descrição</h3>
                    <p className="text-gray-600">{report.description}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
