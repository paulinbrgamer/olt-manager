import React from 'react'
import { Button } from './ui/button'
import type { abaInterface } from '@/interfaces/abas'
import { X } from 'lucide-react'
import { type ponRequest } from '@/interfaces/request'
import useAbas from '@/context/useAbas'
import { Reorder } from "framer-motion"
interface Props {
  abaInfo: abaInterface,
}
function isPonRequest(obj: any): obj is ponRequest {
  return obj && typeof obj.pon === 'number' && typeof obj.slot === 'number';
}

const AbaHeader: React.FC<Props> = React.memo(({ abaInfo }) => {
  const { removeAba, abaslist, setcurrentAbaInfo, currentAbaInfo } = useAbas()
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    //variaveis para mudar automaticamente a aba ao se deletar, caso seja preciso
    const currentIndex = abaslist.findIndex(aba => aba.id === abaInfo.id);
    const isCurrent = currentAbaInfo === abaInfo.id;
    const hasMultipleAbas = abaslist.length > 1;
    const hasPreviousAba = currentIndex > 0;
    const hasNextAba = abaslist[currentIndex + 1] != undefined
    if (hasMultipleAbas && isCurrent && hasPreviousAba) {
      const previousAbaId = abaslist[currentIndex - 1];
      setcurrentAbaInfo(previousAbaId.id);
      console.log("Selecionando aba anterior:", previousAbaId);
    }
    if (hasMultipleAbas && isCurrent && hasNextAba) {
      const previousAbaId = abaslist[currentIndex + 1];
      setcurrentAbaInfo(previousAbaId.id);
      console.log("Selecionando aba superior:", previousAbaId);
    }
    removeAba(abaInfo.id);
  };

  return (
    <Reorder.Item value={abaInfo} key={abaInfo.id + 'item'}
      initial={{ width: 0 }} animate={{ width: 250 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.18, ease: "easeOut" }} aria-label={abaInfo.request?.olt.model + " " + abaInfo.request?.olt.location + ' header'}

      onClick={() => setcurrentAbaInfo(abaInfo.id)}
      className={`flex items-center gap-2 px-2 cursor-pointer 
              hover:opacity-70  min-w-0 max-w-[240px] shrink
              ${currentAbaInfo === abaInfo.id
          ? "bg-background border-b-2 border-sky-600"
          : " border-border"}`}
    >
      {/* Container de informações com truncamento */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <p className="text-sm font-medium  truncate w-full">
          {abaInfo.request?.olt.model + " " + abaInfo.request?.olt.location}
        </p>

        {isPonRequest(abaInfo.request) && (
          <p className="text-xs text-muted-foreground truncate w-full">
            {"Pon : " + abaInfo.request.slot + "/" + abaInfo.request.pon}
          </p>
        )}
      </div>

      {/* Botão de fechar sempre visível */}
      <Button
        aria-label={abaInfo.request?.olt.model + " " + abaInfo.request?.olt.location + ' close'}
        onClick={handleDelete}
        variant="ghost" size="sm"
        className="shrink-0">
        <X className="text-red-500 h-4 w-4" />
      </Button>
    </Reorder.Item>
  )
})

export default AbaHeader
