import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { EllipsisVertical, Signal } from "lucide-react"
import { Button } from "./ui/button"
import type { OnuInfo } from "@/interfaces/onu-interface"
import type React from "react"

interface Props {
    onuList: OnuInfo[]
}

const StateComponent = ({ state }: { state: string }) => {
    switch (state) {
        case "working":
            return (
                <div className="flex w-fit gap-2 bg-green-200/10 text-green-500 p-1 rounded-full">
                    <Signal size={16} />
                    <p>{state}</p>
                </div>
            )
        default:
            return null
    }
}

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
                                <TableCell className="justify-items-center">
                                    <StateComponent state={onu.phaseState!} />
                                </TableCell>
                                <TableCell className="text-end">{onu.signal}</TableCell>
                                <TableCell>
                                    <div className="flex justify-end gap-2 items-center">
                                        <span>
                                            {onu.lastDown
                                                ? onu.lastDown.split(" ").slice(2).join(" ")
                                                : "N/A"}
                                        </span>
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
    )
}


export default TableComponent
