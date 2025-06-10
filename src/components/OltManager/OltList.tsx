import IconButton from '@/components/IconButton'
import { icons } from '@/constants/colors'
import type oltInterface from '@/interfaces/olt-interface'
import {  Server } from 'lucide-react'
interface OltListI {
  filteredOlts : oltInterface[],
  onClick : (oltItem : oltInterface)=>void
}
const OltList : React.FC<OltListI>= ({filteredOlts,onClick : handleClickSelectOlt}) => {
  return (
    <div className='w-full overflow-y-scroll gap-1 flex flex-col noscroll'>
                    {filteredOlts.map((oltItem, idx) =>
                        <IconButton ariaLabel={`Aba-OLT-btn-${idx}`}
                            onClick={() => handleClickSelectOlt(oltItem)}
                            className='justify-start'
                            variant={"ghost"}
                            key={oltItem.id}
                            text={oltItem.model + " " + oltItem.location}
                            Icon={<Server color={oltItem.model == "HW" ? icons.red : icons.blue} />
                            } />
                    )}
                    {filteredOlts.length < 1 && <p className='text-sm text-center'>Sem resultados...</p>}
                </div>
  )
}

export default OltList