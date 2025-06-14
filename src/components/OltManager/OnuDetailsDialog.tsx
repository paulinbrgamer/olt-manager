import type { OnuInfo, OnuInfoHw } from "@/interfaces/onu-interface"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {  Wifi, Signal, Clock, AlertTriangle } from "lucide-react"

interface Props {
  data: OnuInfo | OnuInfoHw | null | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function OnuDetailsDialog({ data, open, onOpenChange }: Props) {
  const isHw = (d: OnuInfo | OnuInfoHw | null | undefined): d is OnuInfoHw =>
    !!d && typeof d.onuDistance === "number"

  if (!data) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 bg-card text-muted-foreground border">
        <DialogHeader className="p-4 border-b border flex flex-row items-center justify-between">
          <div className="flex items-center gap-2" aria-label="table-details">
            <Wifi className="h-5 w-5 text-primary" />
            <DialogTitle className="text-lg font-medium">Detalhes da ONU</DialogTitle>
            <Badge
              variant="outline"
              className="ml-2 bg-blue-500/10 text-primary border-primary/20"
            >
              {data?.phaseState === "working" ||data?.phaseState=== "online" ? "Online" : "Offline"}
            </Badge>
          </div>

        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <div className="border-b border">
            <TabsList className="bg-transparent h-12 p-0 w-full rounded-none ">
              <TabsTrigger value="general" className="flex-1 data-[state=active]:border-blue-500">
                Geral
              </TabsTrigger>
              <TabsTrigger value="technical" className="flex-1 data-[state=active]:border-blue-500">
                Técnico
              </TabsTrigger>
              <TabsTrigger value="status" className="flex-1 data-[state=active]:border-blue-500">
                Status
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="general" className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InfoCard label="Identificação" items={[
                { label: "ID", value: data?.id },
                { label: "Nome", value: data?.name },
                { label: "Serial", value: data?.serialNumber },
                { label: "Tipo", value: data?.type },
              ]} />
              <InfoCard label="Localização" items={[
                { label: "Slot", value: data?.slot },
                { label: "PON", value: data?.pon },
                { label: "Distância", value: data?.onuDistance != null ? `${data?.onuDistance} m` : "N/A" },
              ]} />
            </div>
          </TabsContent>

          <TabsContent value="technical" className="p-4 space-y-4">
            {isHw(data) ? (
              <p className="text-sm text-muted-foreground">Sem dados técnicos adicionais para esse modelo.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <InfoCard label="Velocidade" items={[
                  { label: "Configurada", value: data?.configuredSpeedMode },
                  { label: "Atual", value: data?.currentSpeedMode },
                  { label: "OMCI BW Profile", value: data?.omciBwProfile },
                ]} />
                <InfoCard label="FEC" items={[
                  { label: "Status", value: data?.fec },
                  { label: "Modo", value: data?.fecActualMode },
                ]} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="status" className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InfoCard label="Estado" items={[
                { label: "Admin", value: (data as any)?.adminState ?? "N/A" },
                { label: "Operacional", value: data?.phaseState },
                { label: "Status ONU", value: (data as any)?.onuStatus ?? "N/A" },
              ]} />
              <InfoCard label="Conexão" items={[
                {
                  label: "Sinal",
                  value: data?.signal,
                  custom: (
                    <div className="flex items-center gap-2">
                      {/*@ts-ignore */}
                      <span className={getSignalColorClass(data?.signal)}>{data?.signal} dBm</span>
                      {/*@ts-ignore */}
                      <Signal className={`h-4 w-4 ${getSignalColorClass(data?.signal)}`} />
                    </div>
                  ),
                },
                {
                  label: "Duração Online",
                  value: (data as any)?.onlineDuration ?? "N/A",
                  custom: (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-400" />
                      <span>{(data as any)?.onlineDuration ?? "N/A"}</span>
                    </div>
                  ),
                },
              ]} />
            </div>

            <Card className="bg-secondary border">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-400">Última queda</h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      {data?.lastDown ? formatLastDropInfo(data.lastDown) : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function InfoCard({ label, items }: { label: string, items: any[] }) {
  return (
    <Card className="bg-muted border">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">{label}</h3>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-primary">{item.label}</span>
              {item.custom ?? (
                <span className="text-sm font-medium">
                  {item.value != null && item.value !== "" ? item.value : "N/A"}
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function getSignalColorClass(signal: string | undefined): string {
  const value = Number.parseFloat(signal ?? "")
  if (isNaN(value)) return "text-zinc-400"
  if (value > -15) return "text-green-400"
  if (value > -25) return "text-amber-400"
  return "text-red-400"
}

function formatLastDropInfo(dropInfo: string) {
  if (!dropInfo.includes("→")) return dropInfo

  try {
    const parts = dropInfo.split(" → ")
    const dates = parts[0].split(" ")
    const startDate = `${dates[0]} ${dates[1]}`
    const endDate = `${dates[2]} ${dates[3]}`
    const reason = parts[1]

    return (
      <>
        <div className="flex items-center gap-1 mt-1"><span className="font-medium">De:</span> {startDate}</div>
        <div className="flex items-center gap-1 mt-1"><span className="font-medium">Até:</span> {endDate}</div>
        <div className="flex items-center gap-1 mt-1"><span className="font-medium">Motivo:</span> {reason}</div>
      </>
    )
  } catch {
    return dropInfo
  }
}
