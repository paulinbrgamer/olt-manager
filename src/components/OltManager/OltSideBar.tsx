import SearchInput from '../../components/SearchInput'
import { motion } from 'framer-motion'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { filterBySearch } from '@/utils/filterBySearch'
import olts from '@/constants/olts'
import { useState } from 'react'
import useAbas from '@/context/useAbas'
import type oltInterface from '@/interfaces/olt-interface'
import OltList from './OltList'
import { ServerCog } from 'lucide-react'
const OltSideBar = () => {
    const [search, setSearch] = useState<string>('') //state que guarda a pesquisa de OLT
    const { createAba } = useAbas()
    const filteredOlts = filterBySearch(olts, search, ['model', 'location']) /*variavel que guarda o filtro do teclado */
    const handleText = (event: any) => {
        setSearch(event.target.value)
    } //função para atualizar estado do search
    const handleClickSelectOlt = (oltItem: oltInterface) => {
        createAba(oltItem)
    }
    return (
        <motion.aside initial={{ width: 0, x: 0 }} animate={{ width: 240 }} className='bg-background grid-cols-1 p-4 pt-3 overflow-hidden  border-border border-r-1  flex flex-col justify-start items-center gap-5 h-screen '> 
            <div className='border-b pb-2 w-full flex gap-1.5 justify-center'>
                <ServerCog className='text-sky-400' />
                <p className='font-medium '>OLT MANAGER</p>
            </div>
            <SearchInput ariaLabel='searchOlt' placeholder='Pesquisar Olt...' onChange={handleText} value={search} />
            {/*Container de Olts*/}
            {search && (
                <OltList filteredOlts={filteredOlts} onClick={handleClickSelectOlt} />
            )}
            {!search && (
                <div className='w-full gap-1 flex flex-col scroll-container'>
                    <Accordion type="single" collapsible className="w-full ">
                        <AccordionItem aria-label='ZTE-GROUP' value="item-1">
                            <AccordionTrigger className=' pl-2 cursor-pointer'>ZTE</AccordionTrigger>
                            <AccordionContent className='w-full overflow-y-scroll gap-1 flex flex-col scroll-container h-52 '>
                                {<OltList onClick={handleClickSelectOlt} filteredOlts={filteredOlts.filter((olt)=>olt.model=='ZTE')}/>  }
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem aria-label='HW-GROUP' value="item-2">
                            <AccordionTrigger className=' pl-2 cursor-pointer'>Huawei</AccordionTrigger>
                            <AccordionContent className='w-full overflow-y-scroll gap-1 flex flex-col scroll-container h-52 '>
                                 {<OltList onClick={handleClickSelectOlt} filteredOlts={filteredOlts.filter((olt)=>olt.model=='HW')}/>  }

                            </AccordionContent>
                        </AccordionItem>

                    </Accordion>
                </div>

            )}

        </motion.aside>
    )
}

export default OltSideBar