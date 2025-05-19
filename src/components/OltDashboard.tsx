import { Loader2, RotateCcw, TriangleAlert, X } from 'lucide-react'
import { Button } from './ui/button'
import TableComponent from './TableComponent'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger, } from '@radix-ui/react-dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogTitle, Overlay } from '@radix-ui/react-dialog'
import { Input } from './ui/input'
import React, { useEffect, useState } from 'react'
import { useLazyFetch } from './useLazyFetch'
import { useAbas } from '@/context/olt-abas-provider'
import { toast } from 'sonner'
import type { OnuInfo } from '@/interfaces/onu-interface'
import SearchInput from './SearchInput'
import IconButton from './IconButton'
import type { abaInterface } from '@/interfaces/abas'
import { type ponRequest } from '@/interfaces/request'
import LoaderButton from './LoaderButton'

interface Props {
    abaInfoId?: string
}
const OltDashboard: React.FC<Props> = ({ abaInfoId }) => {
    const [modalSerial, setmodalSerial] = useState<boolean>(false) //state para modal
    const { data, loading, fetchData, error } = useLazyFetch() // fetch hook
    const { updateAba, setcurrentAbaInfo, abaslist } = useAbas() //context api
    const getAbaFromList = (): abaInterface => {
        return abaslist[abaslist.findIndex((abas) => abas.id == abaInfoId)] //função que retorna a aba utilizando o id
    }
    const [abaInfo, setAbaInfo] = useState<abaInterface>(getAbaFromList())//inicializando a informação de aba usando a função acima

    const handleClickSerialOnu = async () => {
        const requestSerial = { olt: abaInfo!.request!.olt.id, serialOnu: 'ZTEGD4B1126A' }
        if (abaInfo!.request?.olt.model == 'ZTE') {
            fetchData('http://localhost:3031/zte/pon_route', {
                method: 'POST',
                body: requestSerial
            })
        }

    }
    useEffect(() => {
        interface ErrorResponse {message: string}
        function isErrorResponse(data: responseData): data is ErrorResponse {return !Array.isArray(data);} //guarde que retorna se encontoru onu ou Não
        type responseData = OnuInfo[] | ErrorResponse
        //verificação se não consta erro e foi feito fetch
        if (!error && data != null) {
            //@ts-expect-error
            if (isErrorResponse(data)) {
                toast("Nenhuma ONU encontrada", {
                    description: 'Não foram encontradas Onus com o serial informado',
                })
            } else {
                //@ts-expect-error
                const onulist: OnuInfo[] = data
                const requestInfo : ponRequest = {olt:abaInfo.request?.olt!,slot:Number(onulist[0].slot),pon:Number(onulist[0]!.pon)}

                updateAba({ ...abaInfo!, OnuList: onulist ,request:requestInfo}) //atualizando aba atual com OnUlIST
                toast("Busca realizada com sucesso!!", {
                    description: 'Onus carregadas na tabela...',
                })
                setmodalSerial(false)
            }

        }
    }, [data])
    useEffect(() => {
        if (error) {
            toast("Erro inesperado", {
                description: error,
            })
        }
    }, [error])
    useEffect(() => {
        setAbaInfo(getAbaFromList()) //atualizando a info da aba local
    }, [abaslist])
    
    return (
        <>
            {abaInfo ?
                <>
                    <main className="col-end-3 flex-1 my-14 px-14 flex flex-col gap-8 max-w-full ">
                        <div className='grid grid-cols-[0.5fr_0.5fr_0.5fr_1fr] gap-2 justify-center w-fit justify-items-end self-start ml-auto'>
                            <IconButton className='w-fit self-end' variant={'link'} Icon={<TriangleAlert />} text='Incidentes' />
                            <IconButton className='w-fit' variant={'outline'} Icon={<RotateCcw />} text='Atualizar' />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className='w-fit' variant={'outline'}>
                                        <p>Carregar Pon</p>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className='w-40 border rounded-sm bg-background z-10 '>
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                            <Button className='w-full text-start' variant={'ghost'}>Buscar por Pon</Button>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => setmodalSerial(true)}>
                                            <Button className='w-full text-start' variant={'ghost'}>Buscar por Serial</Button>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>

                                </DropdownMenuContent>

                            </DropdownMenu>

                            <SearchInput placeholder='Procurar Onu...' />
                        </div>
                        <Dialog open={modalSerial} onOpenChange={setmodalSerial}>
                             <Overlay className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50" />
                            <DialogContent className="z-50 absolute bg-sidebar border self-center mt-[20%] px-5 pb-5 pt-2 rounded-md flex flex-col">
                                <Button className='self-end w-8 ' size={'icon'} variant={'ghost'} onClick={() => setmodalSerial(false)}><X size={10} /></Button>
                                <DialogTitle className="text-xl font-bold">Buscar Pon por Serial de uma Onu</DialogTitle>
                                <DialogDescription className="text-sm text-muted-foreground">
                                    Digite o serial da ONU
                                </DialogDescription>
                                <Input
                                    type="text"
                                    className="mt-4 w-full "
                                    placeholder="Ex: ZTEG12345678"
                                />
                                <LoaderButton className='mt-4' isLoading={loading} onClick={handleClickSerialOnu} variant='outline' text='Buscar'/>
                            </DialogContent>
                        </Dialog>
                        <TableComponent />
                    </main>
                </> : <div className='flex-1  col-end-3 flex flex-col justify-center items-center'>
                    <p className='text-3xl font-medium'>Sem Tabs abertas...</p>
                    <p className='text-lg'>👈 - Selecione uma Olt para abrir uma Tab</p>
                    <p className='text-sm text-accent'>Version-0.5</p>
                </div>}
        </>

    )
}

export default OltDashboard