import TabBar from './components/TabBar'
import { Input } from './components/ui/input'
import { Search, Server } from 'lucide-react'
import IconButton from './components/IconButton'
import { icons } from './constants/colors'
import olts from './constants/olts'
import { useEffect, useState, } from 'react'
import type oltInterface from './interfaces/olt-interface'

const OltManager = () => {
    const [search, setSearch] = useState<string>("")
    const filteredOlts = olts.filter((item )=>`${item.model} ${item.location}`.toLowerCase().includes(search.toLowerCase()))
    const handleText = (event : any)=>{
        setSearch(event.target.value)
    }

    
  return (
    <div>
        <TabBar>
            <div className='relative w-full'>
            <Search  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input value={search} onChange={handleText}  placeholder="Pesquisar..." className="pl-10 " />
            </div>

            <div className='w-full overflow-scroll'>
                {filteredOlts.map(oltItem=><IconButton key={oltItem.id} text={oltItem.model+" "+oltItem.location} Icon={<Server color={oltItem.model=="HW"?icons.red:icons.blue}/>} />)}
                
            </div>
        </TabBar>
    </div>
  )
}

export default OltManager