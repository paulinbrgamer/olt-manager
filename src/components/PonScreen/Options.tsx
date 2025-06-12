import React, { type ChangeEvent } from 'react'
import IconButton from '../IconButton'
import { TriangleAlert } from 'lucide-react'
import LoaderButton from '../LoaderButton'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Button } from '../ui/button'
import SearchInput from '../SearchInput'
import guardRequestPon from '@/interfaces/request'
interface OptionsInterface {
    update : boolean,
    loading : boolean,
    handleClickPonRequest : ()=>void,
    setmodalPon : (state : boolean)=>void,
    setmodalSerial : (state : boolean)=>void,
    searchFilter : string,
    setsearchFilter : (state : string)=>void

}
const Options : React.FC<OptionsInterface> = ({loading,handleClickPonRequest,setmodalPon,setmodalSerial,searchFilter,setsearchFilter,update}) => {
  return (
    <div className='flex gap-3 justify-center w-fit justify-items-end self-start ml-auto'>
                <IconButton ariaLabel='Incidents-btn' className='w-fit self-end' variant={'link'} Icon={<TriangleAlert />} text='Incidentes' />


                {/*@ts-ignore*/}
                {update &&
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
  )
}

export default Options