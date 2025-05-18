import { Input } from './components/ui/input'
import { Search, Server } from 'lucide-react'
import IconButton from './components/IconButton'
import { icons } from './constants/colors'
import olts from './constants/olts'
import {  useState, } from 'react'
import SearchInput from './components/SearchInput'

const OltManager = () => {
    const [search, setSearch] = useState<string>("")

    const filteredOlts = olts.filter((item )=>`${item.model} ${item.location}`.toLowerCase().includes(search.toLowerCase()))  /*variavel que guarda o filtro do teclado */

    const handleText = (event : any)=>{
        setSearch(event.target.value)
    } //função para atualizar estado do search

    
  return (
    <div className='flex w-full'>
        <aside className='p-4 resize-x overflow border-border border-r-1 min-w-[80px] flex flex-col justify-start items-center gap-5 h-screen w-[300px]'> {/*aside com as OLTs listadas */}
            
            <SearchInput placeholder='Pesquisar Olt...' onChange={handleText} value={search}/>

            <div className='w-full overflow-scroll gap-1 flex flex-col'>
                {filteredOlts.map(oltItem=><IconButton key={oltItem.id} text={oltItem.model+" "+oltItem.location} Icon={<Server color={oltItem.model=="HW"?icons.red:icons.blue}/>} />)}
            </div>
        </aside>
        
        <main className='w-full bg-green-100'>
            doaw
        </main>
    </div>
  )
}

export default OltManager