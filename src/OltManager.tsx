import { RotateCcw, Server, TriangleAlert } from 'lucide-react'
import IconButton from './components/IconButton'
import { icons } from './constants/colors'
import olts from './constants/olts'
import { useState, } from 'react'
import SearchInput from './components/SearchInput'
import { Button } from './components/ui/button'
import TableComponent from './components/TableComponent'

const OltManager = () => {
    const [search, setSearch] = useState<string>("")

    const filteredOlts = olts.filter((item) => `${item.model} ${item.location}`.toLowerCase().includes(search.toLowerCase()))  /*variavel que guarda o filtro do teclado */

    const handleText = (event: any) => {
        setSearch(event.target.value)
    } //função para atualizar estado do search


    return (
        <div className='flex w-full'>
            <aside className='p-4 resize-x overflow border-border border-r-1 min-w-[80px] flex flex-col justify-start items-center gap-5 h-screen w-[300px]'> {/*aside com as OLTs listadas */}
                <SearchInput placeholder='Pesquisar Olt...' onChange={handleText} value={search} />
                {/*Container de Olts*/}
                <div className='w-full overflow-scroll gap-1 flex flex-col'>
                    {filteredOlts.map(oltItem => <IconButton className='justify-start' variant={"ghost"} key={oltItem.id} text={oltItem.model + " " + oltItem.location} Icon={<Server color={oltItem.model == "HW" ? icons.red : icons.blue} />} />)}
                </div>
            </aside>
            {/*Conteudo principal renderizado*/}
            <main className='w-full h-full flex flex-col'>
                <header className='bg-accent p-2'>
                    <span className='border-1'>ZTE CENTRAL</span>
                    <span className='border-1'>ZTE CENTRAL</span>
                    <span className='border-1'>ZTE CENTRAL</span>
                </header>
                <main className='flex-1 py-15 px-35 flex flex-col gap-8 '>
                    <div className='grid grid-cols-[0.5fr_0.5fr_0.5fr_1fr] gap-2 justify-center w-fit justify-items-end self-start ml-auto'>
                        <IconButton className='w-fit self-end' variant={'link'} Icon={<TriangleAlert/>} text='Incidentes'/>
                        <IconButton className='w-fit' variant={'outline'} Icon={<RotateCcw />} text='Atualizar'/>
                        <Button className='w-fit' variant={'outline'}>
                            <p>Carregar Pon</p>
                        </Button>
                        <SearchInput placeholder='Procurar Onu...'/>
                    </div>
                    <TableComponent/>
                </main>
            </main>
        </div>
    )
}

export default OltManager