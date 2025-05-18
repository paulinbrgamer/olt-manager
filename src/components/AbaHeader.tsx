import React from 'react'
import { Button } from './ui/button'
import type { abaInterface } from '@/interfaces/abas'
import { X } from 'lucide-react'
import { type ponRequest } from '@/interfaces/request'
import { useAbas } from '@/context/olt-abas-provider'
interface Props {
    abaInfo: abaInterface,
    currentSelected: string | null
    setcurrentAba(state: string | null): void
}
function isPonRequest(obj: any): obj is ponRequest {
    return obj && typeof obj.pon === 'number' && typeof obj.slot === 'number';
}

const AbaHeader: React.FC<Props> = ({ abaInfo, currentSelected, setcurrentAba }) => {
    const { removeAba ,abaslist} = useAbas()
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        //variaveis para mudar automaticamente a aba ao se deletar, caso seja preciso
        const currentIndex = abaslist.findIndex(aba => aba.id === abaInfo.id);
        const isCurrent = currentSelected === abaInfo.id;
        const hasMultipleAbas = abaslist.length > 1;
        const hasPreviousAba = currentIndex > 0;
        const hasFrontAbas = abaslist[currentIndex+1] !=undefined 
        if (hasMultipleAbas && isCurrent && hasPreviousAba) {
          const previousAbaId = abaslist[currentIndex - 1].id;
          setcurrentAba(previousAbaId);
          console.log("Selecionando aba anterior:", previousAbaId);
        }

        removeAba(abaInfo.id);
      };
      
    return (
        <span onClick={() => setcurrentAba(abaInfo.id)} className={`cursor-pointer flex items-center gap-2 px-2    ${currentSelected === abaInfo.id ? "bg-background border-primary" : "bg-accent border-border"}`}>
            {/* Container de informações com truncamento */}
            <div className="flex flex-col min-w-0 max-w-[120px] overflow-hidden">
                <p className="text-sm font-semibold text-sky-400 truncate">
                    {abaInfo.request?.olt.model + " " + abaInfo.request?.olt.location}
                </p>
                {isPonRequest(abaInfo.request) && (
                    <p className="text-xs text-muted-foreground truncate">
                        {abaInfo.request.slot + "/" + abaInfo.request.pon}
                    </p>
                )}
            </div>

            {/* Botão de fechar sempre visível */}
            <Button onClick={handleDelete} variant="ghost" size="sm" className="shrink-0">
                <X className="text-red-500 h-4 w-4" />
            </Button>
        </span>
    )
}

export default AbaHeader
