import { RotateCcw, Server, TriangleAlert, X } from 'lucide-react'
import IconButton from './components/IconButton'
import { icons } from './constants/colors'
import olts from './constants/olts'
import { useState, } from 'react'
import SearchInput from './components/SearchInput'
import { Button } from './components/ui/button'
import TableComponent from './components/TableComponent'
import AbaHeader from './components/AbaHeader'
import type { Request } from './interfaces/request'

const OltManager = () => {
    const [search, setSearch] = useState<string>("")

    const filteredOlts = olts.filter((item) => `${item.model} ${item.location}`.toLowerCase().includes(search.toLowerCase()))  /*variavel que guarda o filtro do teclado */

    const handleText = (event: any) => {
        setSearch(event.target.value)
    } //função para atualizar estado do search


    return (
        <div className='flex w-full'>
            <aside className='p-4  border-border border-r-1  flex flex-col justify-start items-center gap-5 h-screen w-[240px]'> {/*aside com as OLTs listadas */}
                <SearchInput placeholder='Pesquisar Olt...' onChange={handleText} value={search} />
                {/*Container de Olts*/}
                <div className='w-full overflow-y-scroll gap-1 flex flex-col'>
                    {filteredOlts.map(oltItem => <IconButton className='justify-start' variant={"ghost"} key={oltItem.id} text={oltItem.model + " " + oltItem.location} Icon={<Server color={oltItem.model == "HW" ? icons.red : icons.blue} />} />)}
                </div>
            </aside>
            {/*Conteudo principal renderizado*/}
            <main className='h-full w-full flex flex-col min-w-0'>

                <main className="flex-1 my-4 px-4 flex flex-col gap-8 max-w-full ">

                    <div className='grid grid-cols-[0.5fr_0.5fr_0.5fr_1fr] gap-2 justify-center w-fit justify-items-end self-start ml-auto'>
                        <IconButton className='w-fit self-end' variant={'link'} Icon={<TriangleAlert />} text='Incidentes' />
                        <IconButton className='w-fit' variant={'outline'} Icon={<RotateCcw />} text='Atualizar' />
                        <Button className='w-fit' variant={'outline'}>
                            <p>Carregar Pon</p>
                        </Button>
                        <SearchInput placeholder='Procurar Onu...' />
                    </div>
                    <TableComponent />
                </main>
            </main>
        </div>
    )
}

export default OltManager