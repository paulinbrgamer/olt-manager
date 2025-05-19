import { Server } from 'lucide-react'
import IconButton from './components/IconButton'
import { icons } from './constants/colors'
import olts from './constants/olts'
import { useState } from 'react'
import SearchInput from './components/SearchInput'
import AbaHeader from './components/AbaHeader'
import AbasProvider, { useAbas } from './context/olt-abas-provider'
import type oltInterface from './interfaces/olt-interface'
import Onus from './constants/onuListTest'
import TableComponent from './components/TableComponent'
import { TableHead, TableHeader, TableRow, Table } from './components/ui/table'
const OltManager = () => {
    const [search, setSearch] = useState<string>("")
    const { abaslist, createAba, setcurrentAbaInfo, currentAbaInfo } = useAbas()
    const filteredOlts = olts.filter((item) => `${item.model} ${item.location}`.toLowerCase().includes(search.toLowerCase()))  /*variavel que guarda o filtro do teclado */
    const handleText = (event: any) => {
        setSearch(event.target.value)
    } //função para atualizar estado do search
    const handleClickSelectOlt = (oltItem: oltInterface) => {
        const idnewAba = createAba(oltItem)
        setcurrentAbaInfo(idnewAba)
    }
    return (
        <div className='grid grid-cols-[260px_2fr] grid-rows-[30px_1fr]  w-full '>
            <aside className='bg-background grid-cols-1 p-4  border-border border-r-1  flex flex-col justify-start items-center gap-5 h-screen w-[260px] '> {/*aside com as OLTs listadas */}
                <SearchInput placeholder='Pesquisar Olt...' onChange={handleText} value={search} />
                {/*Container de Olts*/}
                <div className='w-full overflow-y-scroll gap-1 flex flex-col scroll-container'>
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
            <header className="flex h-11 bg-accent overflow-hidden min-w-0">
                {abaslist?.map(aba => <AbaHeader key={aba.id} abaInfo={aba} />)}
            </header>
            {/*Conteudo principal renderizado da tab atual*/}
            {currentAbaInfo && abaslist.length > 0 ? (
                abaslist.find(e => e.id === currentAbaInfo)?.dashboard ?? null
            ) : <div className='flex-1 flex col-end-3 justify-center items-center'>
                <p>Sem abas abertas...</p>
            </div>}
            

        </div>
    )
}

export default OltManager