import { Server, ServerCog } from 'lucide-react'
import IconButton from './components/IconButton'
import { icons } from './constants/colors'
import olts from './constants/olts'
import { useState } from 'react'
import SearchInput from './components/SearchInput'
import AbaHeader from './components/AbaHeader'
import { useAbas } from './context/olt-abas-provider'
import type oltInterface from './interfaces/olt-interface'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
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
            <aside className='bg-background grid-cols-1 p-4 pt-3  border-border border-r-1  flex flex-col justify-start items-center gap-5 h-screen w-[260px] '> {/*aside com as OLTs listadas */}
                <div className='border-b pb-2 w-full flex gap-1.5 justify-center'>
                    <ServerCog className='text-sky-400' />
                    <p className='font-medium '>OLT MANAGER</p>
                </div>
                <SearchInput placeholder='Pesquisar Olt...' onChange={handleText} value={search} />
                {/*Container de Olts*/}
                {search && (
                    <div className='w-full overflow-y-scroll gap-1 flex flex-col noscroll'>
                        {filteredOlts.map(oltItem =>
                            <IconButton
                                onClick={() => handleClickSelectOlt(oltItem)}
                                className='justify-start'
                                variant={"ghost"}
                                key={oltItem.id}
                                text={oltItem.model + " " + oltItem.location}
                                Icon={<Server color={oltItem.model == "HW" ? icons.red : icons.blue} />} />)}
                                {filteredOlts.length<1 && <p className='text-sm text-center'>Sem resultados...</p>}
                    </div>
                )}
                <div className='w-full gap-1 flex flex-col scroll-container'>
                    {!search && (
                        <Accordion type="single" collapsible className="w-full ">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className='hover:bg-accent pl-2 cursor-pointer'>ZTE</AccordionTrigger>
                                <AccordionContent className='w-full overflow-y-scroll gap-1 flex flex-col scroll-container h-52 '>
                                    {filteredOlts.map((oltzte) => {
                                        if (oltzte.model === "ZTE") {
                                            return (<IconButton
                                                onClick={() => handleClickSelectOlt(oltzte)}
                                                className='justify-start'
                                                variant={"ghost"}
                                                key={oltzte.id+'group'}
                                                text={oltzte.model + " " + oltzte.location}
                                                Icon={<Server color={ icons.blue} />} />)
                                        }
                                    })}

                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger className='hover:bg-accent pl-2 cursor-pointer'>Huawei</AccordionTrigger>
                                <AccordionContent className='w-full overflow-y-scroll gap-1 flex flex-col scroll-container h-52 '>
                                    {filteredOlts.map((olthw) => {
                                        if (olthw.model === "HW") {
                                            return (<IconButton
                                                onClick={() => handleClickSelectOlt(olthw)}
                                                className='justify-start'
                                                variant={"ghost"}
                                                key={olthw.id+'group'}
                                                text={olthw.model + " " + olthw.location}
                                                Icon={<Server color={ icons.red} />} />)
                                        }
                                    })}

                                </AccordionContent>
                            </AccordionItem>

                        </Accordion>
                    )}

                </div>

            </aside>
            <header className="flex h-11 bg-primary-foreground overflow-hidden min-w-0">
                {abaslist?.map(aba => <AbaHeader key={aba.id} abaInfo={aba} />)}
            </header>
            {/*Conteudo principal renderizado da tab atual*/}
            {currentAbaInfo && abaslist.length > 0 ? (
                abaslist.find(e => e.id === currentAbaInfo)?.dashboard ?? null
            ) : <div className='flex-1 flex col-end-3 justify-center items-center'>
                <p>Sem abas abertas...</p>
            </div>}
            <p className='col-start-2 text-end pr-5 pb-1'>Beta-1.0</p>

        </div>
    )
}

export default OltManager