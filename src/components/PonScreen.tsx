import { TriangleAlert, X } from 'lucide-react'
import { Button } from './ui/button'
import OnusTable from './OnusTable'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, } from '@radix-ui/react-dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogTitle, Overlay } from '@radix-ui/react-dialog'
import { Input } from './ui/input'
import React, { useEffect, useState, type ChangeEvent, } from 'react'
import { useLazyFetch } from './useLazyFetch'
import { useAbas } from '@/context/olt-abas-provider'
import { toast } from 'sonner'
import type { OnuInfo } from '@/interfaces/onu-interface'
import SearchInput from './SearchInput'
import IconButton from './IconButton'
import type { abaInterface } from '@/interfaces/abas'
import guardRequestPon, { type ponRequest } from '@/interfaces/request'
import LoaderButton from './LoaderButton'
import { getAbaFromList } from '@/utils/getAbaFromList'
import { Label } from './ui/label'
import { useDebounce } from './useDebounce';
import handleKeyDown from '@/utils/onKeyDown'
import { motion } from "framer-motion"
interface Props {
    abaInfoId?: string
}
const PonScreen: React.FC<Props> = ({ abaInfoId }) => {
    const { updateAba, abaslist } = useAbas() //context api
    //retorna texto caso não encontre informações de Aba com o id fornecido
    if (!getAbaFromList(abaInfoId!, abaslist)) {
        return <p>Id invalido de aba</p>
    }
    const abaInfo: abaInterface = getAbaFromList(abaInfoId!, abaslist)!// inicialização da informação da abaLocal
    const [modalSerial, setmodalSerial] = useState<boolean>(false) //state para modal
    const [requestSerialInput, setrequestSerialInput] = useState<string>('') //state para pegar o input do serial do modal
    const [searchFilter, setsearchFilter] = useState<string>(abaInfo.filter.search)// state para receber o filtro
    const debounceSearch = useDebounce(searchFilter, 200) //debouncer que recebe o state searchFilter
    //@ts-ignore
    const [requestPonInput, setrequestPonInput] = useState<{ slot: number | undefined, pon: number | undefined }>(guardRequestPon(abaInfo.request) ? { pon: abaInfo.request?.pon, slot: abaInfo.request.slot } : { pon: undefined, slot: undefined }) //state para pegar slot e pon
    const [modalPon, setmodalPon] = useState<boolean>(false)//state para controlar o modal da pon 

    const { data, loading, fetchData, error } = useLazyFetch() // fetch hook

    const handleClickSerialOnu = async () => {
        if (requestSerialInput.length < 1) {
            toast('Serial inserido invalido!!')
        } else {

            const requestSerial = { olt: abaInfo!.request!.olt.id, serialOnu: requestSerialInput }
            if (abaInfo!.request?.olt.model == 'ZTE') {
                fetchData('http://localhost:3031/zte/pon_route', {
                    method: 'POST',
                    body: requestSerial
                })
            }
            if (abaInfo!.request?.olt.model == 'HW') {
                fetchData('http://localhost:3031/hw/pon_route', {
                    method: 'POST',
                    body: requestSerial
                })
            }
        }
    }
    const handleClickPonRequest = async () => {
        if (requestPonInput.pon && requestPonInput.slot) {
            const requestPon = { olt: abaInfo!.request!.olt.id, slot: requestPonInput.slot, pon: requestPonInput.pon }
            if (abaInfo!.request?.olt.model == 'ZTE') {
                fetchData('http://localhost:3031/zte/pon_route', {
                    method: 'POST',
                    body: requestPon
                })
            }
            if (abaInfo!.request?.olt.model == 'HW') {
                fetchData('http://localhost:3031/hw/pon_route', {
                    method: 'POST',
                    body: requestPon
                })
            }
        }
        else {
            toast('Slot ou Pon invalido!!')
        }
    }

    //useEffect para atualizar a onuList conforme o imput do debounce mudar e também quando o filtro se alterar
    useEffect(() => {

        //verifica se  tem algo digitado e faz o filtro setando as onusFiltradas e atualizando o estado da aba.
        if (debounceSearch) {
            updateAba({ ...abaInfo!, filter: { ...abaInfo.filter, search: debounceSearch } })

        } else {
            //caso o que for digitado seja vazio, retorna as onusFiltradas por state e atualiza o search da aba.
            updateAba({ ...abaInfo!, filter: { ...abaInfo.filter, search: debounceSearch } })
        }
    }, [debounceSearch]);
    //useEffect para o response do fetch
    useEffect(() => {
        //interface para mensagem de erro
        interface ErrorResponse { message: string }
        //type guard 
        function isErrorResponse(data: responseData): data is ErrorResponse { return !Array.isArray(data); } //guarde que retorna se encontoru onu ou Não
        type responseData = OnuInfo[] | ErrorResponse
        //verificação se não consta erro e foi feito fetch
        if (!error && data != null) {
            //@ts-expect-error
            if (isErrorResponse(data)) {
                toast("Nenhuma ONU encontrada", {
                    description: data.message,
                })
            } else {
                //@ts-expect-error
                const onulist: OnuInfo[] = data
                const requestInfo: ponRequest = { olt: abaInfo.request?.olt!, slot: Number(onulist[0].slot), pon: Number(onulist[0]!.pon) }
                updateAba({ ...abaInfo!, OnuList: onulist, request: requestInfo }) //atualizando aba atual com OnUlIST
                setrequestPonInput({ slot: requestInfo.slot, pon: requestInfo.pon })
                toast("Busca realizada com sucesso!!", {
                    description: 'Onus carregadas na tabela...',
                })
                setmodalSerial(false)
                setmodalPon(false)
            }

        }
    }, [data])
    //useEffect para erros no fetch
    useEffect(() => {
        if (error) {
            toast("Erro inesperado", {
                description: error,
            })
        }
    }, [error])
    return (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} aria-label={abaInfo.request?.olt.model + " " + abaInfo.request?.olt.location + ' Dashboard'} className="col-end-3 flex-1 my-14 px-14 flex flex-col gap-8 max-w-full h-[700px] ">
            {/*Div com elementos de interação com a Tabela de Onus */}
            <div className='flex gap-3 justify-center w-fit justify-items-end self-start ml-auto'>
                <IconButton ariaLabel='Incidents-btn' className='w-fit self-end' variant={'link'} Icon={<TriangleAlert />} text='Incidentes' />


                {/*@ts-ignore*/}
                {guardRequestPon(abaInfo.request) &&
                    <LoaderButton isLoading={loading} text='Atualizar' onClick={handleClickPonRequest} />}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={'outline'} aria-label="load-Pon" className="w-fit text-primary" >
                            <p>Carregar Pon</p>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="w-50 mt-3 p-1 border rounded-md bg-sidebar-accent text-popover-foreground z-10 shadow-md data-[state=open]:animate-in data-[state=open]:fade-in-40 data-[state=open]:slide-in-from-top-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-40 data-[state=closed]:slide-out-to-top-2"
                    >
                        <DropdownMenuGroup>
                            <DropdownMenuItem className='dropdown-item' onSelect={() => setmodalPon(true)}>
                                Buscar por Pon
                            </DropdownMenuItem>
                            <DropdownMenuItem className='dropdown-item' onSelect={() => setmodalSerial(true)}>
                                Buscar por Serial
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <SearchInput ariaLabel='search-Onu' value={searchFilter} onChange={(e: ChangeEvent<HTMLInputElement>) => setsearchFilter(e.target.value)} placeholder='Procurar Onu...' />
            </div>
            <Dialog open={modalSerial} onOpenChange={setmodalSerial}>
                <Overlay className="fixed inset-0 bg-black/50 backdrop-blur-xx z-50" />
                <DialogContent className="z-50 absolute bg-sidebar border self-center mt-[10%] mr-[15%] max-w-[340px]  px-5 pb-5 pt-5 rounded-md flex flex-col data-[state=open]:animate-in data-[state=open]:fade-in-40 data-[state=open]:slide-in-from-bottom-2
                          data-[state=closed]:animate-out data-[state=closed]:fade-out-40 data-[state=closed]:slide-out-to-bottom-2">
                    <div className='flex flex-row justify-between items-start  gap-4'>
                        <DialogTitle className="text-xl font-bold text-primary ">Buscar Pon </DialogTitle>
                        <Button className='self-start w-8 ' size={'icon'} variant={'ghost'} onClick={() => setmodalSerial(false)}><X size={10} /></Button>
                    </div>
                    <DialogDescription className='mb-2'>
                        Encontrar por Serial de uma Onu
                    </DialogDescription>
                    <DialogDescription className='text-primary'>
                        Serial:
                    </DialogDescription>
                    <Input
                        onKeyDown={(e) => handleKeyDown(e, handleClickSerialOnu)}
                        value={requestSerialInput}
                        onChange={(e) => setrequestSerialInput(e.target.value)}
                        type="text"
                        className="mt-2 w-full "
                        placeholder="Ex: ZTEG12345678"
                    />
                    <LoaderButton className='mt-6 text-primary font-medium' isLoading={loading} onClick={handleClickSerialOnu} variant='outline' text='Buscar' />
                </DialogContent>
            </Dialog>
            <Dialog open={modalPon} onOpenChange={setmodalPon}>
                <Overlay className="fixed inset-0 bg-black/50 backdrop-blur-xx z-50" />
                <DialogContent className="z-50  absolute bg-sidebar border self-center mt-[10%] mr-[15%] max-w[340px]  px-5 pb-5 pt-5 rounded-md flex flex-col data-[state=open]:animate-in data-[state=open]:fade-in-40 data-[state=open]:slide-in-from-bottom-2
                          data-[state=closed]:animate-out data-[state=closed]:fade-out-40 data-[state=closed]:slide-out-to-bottom-2">
                    <div className='flex flex-row justify-between items-start mb-2 gap-4'>
                        <DialogTitle className="text-xl font-bold text-start text-primary">Carregar informações de Pon</DialogTitle>
                        <Button className='self-start w-8 ' size={'icon'} variant={'ghost'} onClick={() => setmodalPon(false)}><X size={10} /></Button>
                    </div>
                    <DialogDescription className="text-sm text-muted-foreground  text-start ">
                        Carregue as informações digitando o Slot e Pon.
                    </DialogDescription>
                    <Label className='mt-4 text-primary' htmlFor={'slot'}>Slot</Label>
                    <Input
                        id="slot"
                        type="number"
                        placeholder="Ex: 2"
                        className="mt-2 w-full"
                        value={requestPonInput.slot ?? ""}
                        onChange={(e) =>
                            setrequestPonInput((prev) => ({
                                ...prev,
                                slot: e.target.valueAsNumber,
                            }))
                        }
                    />

                    <Label htmlFor="pon" className="mt-4 text-primary">Pon</Label>
                    <Input
                        onKeyDown={(e) => handleKeyDown(e, handleClickPonRequest)}
                        id="pon"
                        type="number"
                        placeholder="Ex: 7"
                        className="mt-2 w-full"
                        value={requestPonInput.pon ?? ""}
                        onChange={(e) =>
                            setrequestPonInput((prev) => ({
                                ...prev,
                                pon: e.target.valueAsNumber,
                            }))
                        }
                    />

                    <LoaderButton className='mt-4 text-primary' isLoading={loading} onClick={handleClickPonRequest} variant='outline' text='Buscar' />
                </DialogContent>
            </Dialog>


            <OnusTable abaInfoId={abaInfoId} />
        </motion.main>
    )
}

export default PonScreen