import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EllipsisVertical, Signal } from "lucide-react";
import { Button } from "./ui/button";
import type { OnuInfo } from "@/interfaces/onu-interface";
import type React from "react";

interface Props {
  onuList: OnuInfo[];
}
const signalColor = (signal: number) => {
  if (signal >= -24) {
    return "text-green-500";
  } else if (signal >= -28) {
    return "text-orange-500";
  } else return "text-red-500";
};
const StateComponent = ({ state }: { state: string }) => {
  switch (state) {
    case "working":
      return (
        <div className="flex w-fit gap-2 bg-green-200/10 text-green-500 p-1 rounded-full">
          <p>{state}</p>
        </div>
      );
    case "DyingGasp":
      return (
        <div className="flex w-fit gap-2 bg-gray-200/10 text-gray-500 p-1 rounded-full">
          <p>{state}</p>
        </div>
      );

    case "OffLine":
      return (
        <div className="flex w-fit gap-2 bg-red-200/10 text-red-500 p-1 rounded-full">
          <p>{state}</p>
        </div>
      );
    case "Los":
      return (
        <div className="flex w-fit gap-2 bg-red-200/10 text-red-500 p-1 rounded-full">
          <p>{state}</p>
        </div>
      );
    default:
      return null;
  }
};

const TableComponent: React.FC<Props> = ({ onuList }) => {
  return (
    <div className="h-full flex flex-col border rounded-md overflow-hidden noscroll">
      <div className="overflow-auto flex-1 noscroll">
        <Table className="min-w-full">
          <TableHeader className="">
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Serial</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Sinal(dbm)</TableHead>
              <TableHead className="text-right">Última queda</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {onuList.map((onu) => (
              <TableRow key={onu.serialNumber}>
                <TableCell className="font-medium">{onu.id}</TableCell>
                <TableCell>{onu.name}</TableCell>
                <TableCell>{onu.serialNumber}</TableCell>
                <TableCell className="flex items-end justify-center">
                  <StateComponent state={onu.phaseState!} />
                </TableCell>
                <TableCell>
                  {onu.signal ? (
                    <div className="flex gap-2 items-end justify-end">
                      <Signal
                        className={`${signalColor(onu.signal!)}`}
                        size={16}
                      />
                      {onu.signal}
                    </div>
                  ) : (
                    <p className="text-end">N/A</p>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2 items-center">
                    {onu.lastDown !="N/A"?
                      <span>
                        {onu.lastDown!.split(" ").slice(2).join(" ")}
                      </span>
                      : <p >N/A</p>}
                    <Button variant="ghost" size="icon">
                      <EllipsisVertical />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <TableCaption>Resultados encontrados: {onuList.length}</TableCaption>
    </div>
  );
};

export default TableComponent;
