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
import { useAbas } from "@/context/olt-abas-provider"
import { useEffect } from "react"

interface Props {
    onuList: OnuInfo[]
}
const StateComponent = ({ state }: { state: string }) => {
    switch (state) {
        case "working":
            return (
                <div className="flex w-fit gap-2  bg-green-200/10 text-green-500 p-1 rounded-full">
                    <Signal size={16} />
                    <p>{state}</p>
                </div>
            )

        default:
            break;
    }
}
const TableComponent: React.FC<Props> = ({ onuList }) => {
    const { currentAbaInfo, abaslist } = useAbas()
    return (
        <div className="rounded-md overflow-hidden border flex h-full">
            <Table className="flex-1" >
                <TableCaption>Resultados encontrados :{onuList.length}</TableCaption>
                <TableHeader >
                    <TableRow className="bg-accent/90 z-1 sticky ">
                        <TableHead className="w-[100px] ">ID</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Serial</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right">Sinal(dbm)</TableHead>
                        <TableHead className="text-right">Ultima queda</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {onuList.map(onu => (
                        <TableRow key={onu.serialNumber}>
                            <TableCell className="font-medium">{onu.id}</TableCell>
                            <TableCell>{onu.name}</TableCell>
                            <TableCell>{onu.serialNumber}</TableCell>
                            <TableCell className="text-center">
                                {onu.phaseState}
                            </TableCell>
                            <TableCell className="">
                                <StateComponent state={onu.phaseState!} />
                            </TableCell>

                            <TableCell >
                                <div className="flex justify-end gap-2 items-center">
                                    <span >{onu.lastDown ? onu.lastDown.split(' ').slice(2).join(' ') : "N/A"}</span>
                                    <Button variant={'ghost'} size={'icon'}>
                                        <EllipsisVertical />
                                    </Button>
                                </div>

                            </TableCell>
                        </TableRow>
                    )
                    )}

                </TableBody>
            </Table>
        </div>

    )
}

export default TableComponent