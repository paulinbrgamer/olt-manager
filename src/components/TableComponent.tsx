import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Signal } from "lucide-react"

const TableComponent = () => {
    return (
        <div className="rounded-md overflow-hidden border flex h-full">
            <Table className="flex-1">
                <TableCaption>Resultados encontrados : 0</TableCaption>
                <TableHeader >
                    <TableRow className="bg-accent/90 ">
                        <TableHead className="w-[100px] ">ID</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Serial</TableHead>
                        <TableHead className="text-right">Sinal(dbm)</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                        <TableHead className="text-right">Ultima queda</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">1</TableCell>
                        <TableCell>19:lucas</TableCell>
                        <TableCell>ZTEG219G9D</TableCell>
                        <TableCell className="flex gap-2 justify-end items-center">
                            <Signal/>
                            <p> -19</p>
                        </TableCell>
                        <TableCell className="text-right">
                            Working
                        </TableCell>
                        <TableCell className="text-end">
                            2024-02-02 - 14:00
                        </TableCell>
                    </TableRow>
                    
                </TableBody>
            </Table>
        </div>

    )
}

export default TableComponent