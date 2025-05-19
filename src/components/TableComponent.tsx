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

interface Props {
    onuList? : OnuInfo[]
}
const TableComponent :React.FC<Props> = ({onuList}) => {
    const {currentAbaInfo} = useAbas()
    return (
        <div className="rounded-md overflow-hidden border flex h-full">
            <Table className="flex-1" >
                <TableCaption>Resultados encontrados : 0</TableCaption>
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
                    <TableRow>
                        <TableCell className="font-medium">1</TableCell>
                        <TableCell>19:lucas</TableCell>
                        <TableCell>ZTEG219G9D</TableCell>
                        <TableCell className="text-center">
                            Working
                        </TableCell>
                        <TableCell className="">
                            <div className="flex justify-end gap-2 items-end">
                            <Signal size={20}/>
                            <p> -19</p>
                            </div>
                        </TableCell>

                        <TableCell >
                        <div className="flex justify-end gap-2 items-center">
                            <span >2024-02-02 - 14:00</span>
                            <Button variant={'ghost'} size={'icon'}>
                            <EllipsisVertical />
                            </Button>
                            </div>
                            
                        </TableCell>
                    </TableRow>
                    
                </TableBody>
            </Table>
        </div>

    )
}

export default TableComponent