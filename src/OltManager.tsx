import { RotateCcw, Server, TriangleAlert, X } from 'lucide-react'
import IconButton from './components/IconButton'
import { icons } from './constants/colors'
import olts from './constants/olts'
import { useEffect, useState, } from 'react'
import SearchInput from './components/SearchInput'
import { Button } from './components/ui/button'
import TableComponent from './components/TableComponent'
import AbaHeader from './components/AbaHeader'
import { useAbas } from './context/olt-abas-provider'
import type oltInterface from './interfaces/olt-interface'

const OltManager = () => {
    const [search, setSearch] = useState<string>("")
    const [currentAba, setcurrentAba] = useState<string | null>(null)
    const { abaslist, createAba } = useAbas()
    const filteredOlts = olts.filter((item) => `${item.model} ${item.location}`.toLowerCase().includes(search.toLowerCase()))  /*variavel que guarda o filtro do teclado */

    const handleText = (event: any) => {
        setSearch(event.target.value)
    } //função para atualizar estado do search
    const handleClickSelectOlt = (oltItem: oltInterface) => {
        const idnewAba = createAba(oltItem)
        setcurrentAba(idnewAba)
    }
    useEffect(() => {
        console.log(currentAba);

    }, [currentAba])

    return (
        <div className='grid grid-cols-[240px_2fr] grid-rows-[30px_1fr]  w-full '>
            <aside className='bg-background grid-cols-1 p-4  border-border border-r-1  flex flex-col justify-start items-center gap-5 h-screen w-[240px]'> {/*aside com as OLTs listadas */}
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

            {/*Conteudo principal renderizado*/}
            {abaslist.length > 0 &&
                <>
                    <header className='flex h-11 bg-accent overflow-x-scroll ' >
                        {abaslist?.map(aba => <AbaHeader key={aba.id} setcurrentAba={setcurrentAba} currentSelected={currentAba} abaInfo={aba} />)}
                    </header>
                    <main className="col-end-3 flex-1 my-14 px-14 flex flex-col gap-8 max-w-full ">
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
                </>}
        </div>
    )
}

export default OltManager