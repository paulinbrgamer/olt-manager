import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import type { OnuInfo, OnuInfoHw } from "@/interfaces/onu-interface";

interface Props {
  data: OnuInfo | OnuInfoHw;
}

 const OnuDetailsTable: React.FC<Props> = ({ data }) => {
  const isHw = (data: OnuInfo | OnuInfoHw): data is OnuInfoHw => {
    return typeof data.onuDistance === "number"; // campo exclusivo da OnuInfoHw
  };

  const entries = isHw(data)
    ? [
        { label: "ID", value: data.id },
        { label: "Slot", value: data.slot },
        { label: "Pon", value: data.pon },
        { label: "Serial", value: data.serialNumber },
        { label: "Nome", value: data.name },
        { label: "Tipo", value: data.type },
        { label: "Estado", value: data.phaseState },
        { label: "Distância", value: data.onuDistance },
        { label: "Sinal", value: data.signal },
        { label: "Última queda", value: data.lastDown },
      ]
    : [
        { label: "ID", value: data.id },
        { label: "Slot", value: data.slot },
        { label: "Pon", value: data.pon },
        { label: "Serial", value: data.serialNumber },
        { label: "Nome", value: data.name },
        { label: "Tipo", value: data.type },
        { label: "Velocidade Configurada", value: data.configuredSpeedMode },
        { label: "Velocidade Atual", value: data.currentSpeedMode },
        { label: "Estado Admin", value: data.adminState },
        { label: "Estado", value: data.phaseState },
        { label: "Status ONU", value: data.onuStatus },
        { label: "OMCI BW Profile", value: data.omciBwProfile },
        { label: "Distância", value: data.onuDistance },
        { label: "Duração Online", value: data.onlineDuration },
        { label: "FEC", value: data.fec },
        { label: "FEC Modo", value: data.fecActualMode },
        { label: "Última queda", value: data.lastDown },
        { label: "Sinal", value: data.signal },
      ];

  return (
    <Table>

      <TableBody>
        {entries.map((item, index) => (
          <TableRow key={index} className="grid grid-cols-[3fr_4fr] ">
            <TableCell className="font-medium text-primary/50 border-r-1">{item.label}</TableCell>
            <TableCell className="text-primary/80 ">{item.value ?? "N/A"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default OnuDetailsTable
