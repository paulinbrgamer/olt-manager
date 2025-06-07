import { Server, ServerCog } from 'lucide-react'
import IconButton from './components/IconButton'
import { icons } from './constants/colors'
import olts from './constants/olts'
import { useState } from 'react'
import SearchInput from './components/SearchInput'
import AbaHeader from './components/AbaHeader'
import { useAbas } from './context/olt-abas-provider'
import type oltInterface from './interfaces/olt-interface'
import {motion} from 'framer-motion'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { filterBySearch } from './utils/filterBySearch'
import PonScreen from './components/PonScreen'
const OltManager = () => {
    const [search, setSearch] = useState<string>('') //state que guarda a pesquisa de OLT
    const { abaslist, createAba, currentAbaInfo } = useAbas()
    const filteredOlts = filterBySearch(olts, search, ['model', 'location']) /*variavel que guarda o filtro do teclado */

    const handleText = (event: any) => {
        setSearch(event.target.value)
    } //função para atualizar estado do search
    const handleClickSelectOlt = (oltItem: oltInterface) => {
        createAba(oltItem)
    }
    return (
        <div aria-label="screen-olt" className='grid grid-cols-[auto_2fr] grid-rows-[30px_1fr]  w-full '>
            <motion.aside initial={{width:0,x:0}} animate={{width:240}} className='bg-background grid-cols-1 p-4 pt-3 overflow-hidden  border-border border-r-1  flex flex-col justify-start items-center gap-5 h-screen '> {/*aside com as OLTs listadas */}
                <div className='border-b pb-2 w-full flex gap-1.5 justify-center'>
                    <ServerCog className='text-sky-400' />
                    <p className='font-medium '>OLT MANAGER</p>
                </div>
                <SearchInput ariaLabel='searchOlt' placeholder='Pesquisar Olt...' onChange={handleText} value={search} />
                {/*Container de Olts*/}
                {search && (
                    <div className='w-full overflow-y-scroll gap-1 flex flex-col noscroll'>
                        {filteredOlts.map((oltItem, idx) =>
                            <IconButton ariaLabel={`Aba-OLT-btn-${idx}`}
                                onClick={() => handleClickSelectOlt(oltItem)}
                                className='justify-start'
                                variant={"ghost"}
                                key={oltItem.id}
                                text={oltItem.model + " " + oltItem.location}
                                Icon={<Server color={oltItem.model == "HW" ? icons.red : icons.blue} />} />)}
                        {filteredOlts.length < 1 && <p className='text-sm text-center'>Sem resultados...</p>}
                    </div>
                )}
                {!search && (
                    <div className='w-full gap-1 flex flex-col scroll-container'>

                        <Accordion type="single" collapsible className="w-full ">
                            <AccordionItem aria-label='ZTE-GROUP' value="item-1">
                                <AccordionTrigger className=' pl-2 cursor-pointer'>ZTE</AccordionTrigger>
                                <AccordionContent className='w-full overflow-y-scroll gap-1 flex flex-col scroll-container h-52 '>
                                    {filteredOlts.map((oltzte) => {
                                        if (oltzte.model === "ZTE") {
                                            return (<IconButton
                                                onClick={() => handleClickSelectOlt(oltzte)}
                                                className='justify-start'
                                                variant={"ghost"}
                                                key={oltzte.id + 'group'}
                                                text={oltzte.model + " " + oltzte.location}
                                                Icon={<Server color={icons.blue} />} />)
                                        }
                                    })}

                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem aria-label='HW-GROUP' value="item-2">
                                <AccordionTrigger className=' pl-2 cursor-pointer'>Huawei</AccordionTrigger>
                                <AccordionContent className='w-full overflow-y-scroll gap-1 flex flex-col scroll-container h-52 '>
                                    {filteredOlts.map((olthw) => {
                                        if (olthw.model === "HW") {
                                            return (<IconButton
                                                onClick={() => handleClickSelectOlt(olthw)}
                                                className='justify-start'
                                                variant={"ghost"}
                                                key={olthw.id + 'group'}
                                                text={olthw.model + " " + olthw.location}
                                                Icon={<Server color={icons.red} />} />)
                                        }
                                    })}

                                </AccordionContent>
                            </AccordionItem>

                        </Accordion>
                    </div>

                )}

            </motion.aside>
            <header className="flex h-11 bg-primary-foreground overflow-hidden min-w-0">
                {abaslist?.map(aba => <AbaHeader key={aba.id} abaInfo={aba} />)}
            </header>
            {/*Conteudo principal renderizado da tab atual*/}
            {currentAbaInfo && abaslist.length > 0 ? (
                <PonScreen abaInfoId={currentAbaInfo} key={currentAbaInfo} />
            ) : (
                <div className='flex-1 flex col-end-3 justify-center items-center'>
                    <p>Sem abas abertas...</p>
                </div>
            )}
            <p className='col-start-2 text-end pr-5 pb-1'>Beta-1.0</p>

        </div>
    )
}

export default OltManager