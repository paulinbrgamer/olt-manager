import { Loader2, RotateCcw, Server, TriangleAlert, X } from 'lucide-react'
import IconButton from './components/IconButton'
import { icons } from './constants/colors'
import olts from './constants/olts'
import {  useEffect, useState, } from 'react'
import SearchInput from './components/SearchInput'
import { Button } from './components/ui/button'
import TableComponent from './components/TableComponent'
import AbaHeader from './components/AbaHeader'
import { useAbas } from './context/olt-abas-provider'
import type oltInterface from './interfaces/olt-interface'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger, } from '@radix-ui/react-dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { Input } from './components/ui/input'
import { useLazyFetch } from './components/useLazyFetch'
import { toast } from "sonner"
import type { OnuInfo } from './interfaces/onu-interface'
const OltManager = () => {
    const [search, setSearch] = useState<string>("")
    const [modalSerial, setmodalSerial] = useState<boolean>(false)
    const { abaslist, createAba, currentAbaInfo, setcurrentAbaInfo,updateAba } = useAbas()
    const { data, loading, fetchData, error } = useLazyFetch()
    const filteredOlts = olts.filter((item) => `${item.model} ${item.location}`.toLowerCase().includes(search.toLowerCase()))  /*variavel que guarda o filtro do teclado */
    const handleClickSerialOnu = async () => {
        
        const requestSerial = { olt: currentAbaInfo!.request!.olt.id, serialOnu: 'ZTEGD4B1126A' }
        if(currentAbaInfo!.request?.olt.model == 'ZTE'){
            fetchData('http://localhost:3031/zte/pon_route',{
                method:'POST',
                body:requestSerial
            })
        }

        
    }
    useEffect(() => {
        interface ErrorResponse {
            message:string
        }
        function isErrorResponse(data: responseData): data is ErrorResponse {
            return !Array.isArray(data);
          }

        type responseData = OnuInfo[] | ErrorResponse
        if (!error){
            //@ts-expect-error
            if(isErrorResponse(data)){
                toast("Nenhuma ONU encontrada",  {
                    description:'Não foram encontradas Onus com o serial informado',
                })
            }else{
                //@ts-expect-error
                const onulist : OnuInfo[] = data
                updateAba({...currentAbaInfo!,OnuList:onulist})
                setcurrentAbaInfo({...currentAbaInfo!,OnuList:onulist})
                toast("Busca realizada com sucesso!!",  {
                    description:'Onus carregadas na tabela...',
                })
            }
            
        }
    }, [data])
    useEffect(() => {
        if(error){
            toast("Erro inesperado",  {
                description:error,
            }) 
        }
    }, [error])
    
    const handleText = (event: any) => {
        setSearch(event.target.value)
    } //função para atualizar estado do search

    const handleClickSelectOlt = (oltItem: oltInterface) => {
        const idnewAba = createAba(oltItem)
        setcurrentAbaInfo(idnewAba)
    }


    return (
        <div className='grid grid-cols-[260px_2fr] grid-rows-[30px_1fr]  w-full '>
            <aside className='bg-background grid-cols-1 p-4  border-border border-r-1  flex flex-col justify-start items-center gap-5 h-screen w-[260px]'> {/*aside com as OLTs listadas */}
                <SearchInput placeholder='Pesquisar Olt...' onChange={handleText} value={search} />
                {/*Container de Olts*/}
                <div className='w-full overflow-y-scroll gap-1 flex flex-col'>
                    {filteredOlts.map(oltItem =>
                        <IconButton
                            onClick={() => handleClickSelectOlt(oltItem)}
                            className='justify-start'
                            variant={"ghost"}
                            key={oltItem.id}
                            text={oltItem.model + " " + oltItem.location}
                            Icon={<Server color={oltItem.model == "HW" ? icons.red : icons.blue} />} />)}
                </div>
            </aside>
            <header className='flex h-11 bg-accent overflow-x-scroll ' >
                {abaslist?.map(aba => <AbaHeader key={aba.id} abaInfo={aba} />)}
            </header>
            {/*Conteudo principal renderizado*/}
            {currentAbaInfo ?
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
                        <Dialog open={modalSerial} >
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
                                <Button onClick={handleClickSerialOnu} disabled={loading?true:false} className='mt-4' variant={'outline'}>{loading? <Loader2 className='animate-spin'/>:'Buscar'}</Button>
                            </DialogContent>
                        </Dialog>
                        <TableComponent />
                    </main>
                </> : <div className='flex-1  col-end-3 flex flex-col justify-center items-center'>
                    <p className='text-3xl font-medium'>Sem Tabs abertas...</p>
                    <p className='text-lg'>👈 - Selecione uma Olt para abrir uma Tab</p>
                    <p className='text-sm text-accent'>Version-0.5</p>
                </div>}
        </div>
    )
}

export default OltManager