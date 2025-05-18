import { Input } from './components/ui/input'
import { Search, Server } from 'lucide-react'
import IconButton from './components/IconButton'
import { icons } from './constants/colors'
import olts from './constants/olts'
import {  useState, } from 'react'

const OltManager = () => {
    const [search, setSearch] = useState<string>("")
    const filteredOlts = olts.filter((item )=>`${item.model} ${item.location}`.toLowerCase().includes(search.toLowerCase()))
    const handleText = (event : any)=>{
        setSearch(event.target.value)
    }

    
  return (
    <div>
        <aside className='p-4 resize-x overflow border-border border-r-1 min-w-[80px] flex flex-col justify-start items-center gap-5 h-screen w-[300px]'>
            <div className='relative w-full'>
            <Search  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input value={search} onChange={handleText}  placeholder="Pesquisar OLT..." className="pl-10 " />
            </div>

            <div className='w-full overflow-scroll gap-1 flex flex-col'>
                {filteredOlts.map(oltItem=><IconButton key={oltItem.id} text={oltItem.model+" "+oltItem.location} Icon={<Server color={oltItem.model=="HW"?icons.red:icons.blue}/>} />)}
                
            </div>
        </aside>
    </div>
  )
}

export default OltManager