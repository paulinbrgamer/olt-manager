import React from 'react'
import { Button } from './ui/button'
import type { abaInterface } from '@/interfaces/abas'
import { X } from 'lucide-react'
import { type ponRequest } from '@/interfaces/request'

interface Props {
    abaInfo: abaInterface,
    currentSelected: string
}

function isPonRequest(obj: any): obj is ponRequest {
    return obj && typeof obj.pon === 'number' && typeof obj.slot === 'number';
}

const AbaHeader: React.FC<Props> = ({ abaInfo, currentSelected }) => {
    return (
        <span className={`flex items-center gap-2 px-2 py-1 rounded-md border ${currentSelected === abaInfo.id ? "bg-muted border-primary" : "bg-background border-border"}`}>
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
            <Button variant="ghost" size="sm" className="shrink-0">
                <X className="text-red-500 h-4 w-4" />
            </Button>
        </span>
    )
}

export default AbaHeader
