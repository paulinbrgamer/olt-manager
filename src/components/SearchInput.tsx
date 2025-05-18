import { Search } from 'lucide-react'
import React from 'react'
import { Input } from './ui/input'
interface propsSearch {
    value : string,
    onChange(event:any) : void,
    placeholder : string
}
const SearchInput : React.FC <propsSearch> = ({value,onChange,placeholder}) => {
    return (
        <div className='relative w-full'>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input value={value} onChange={onChange} placeholder={placeholder} className="pl-10 " />
        </div>
    )
}

export default SearchInput