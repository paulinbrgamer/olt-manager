import useAbas from '@/context/useAbas'
import { AnimatePresence, Reorder } from 'framer-motion'
import Tab from '../Tab'

const TabGroup = () => {
    const { abaslist,setAbasList} = useAbas()
    return (
        <Reorder.Group axis={'x'} values={abaslist} onReorder={setAbasList} className="flex h-11 bg-sidebar overflow-hidden min-w-0 gap-0.5">
            <AnimatePresence initial={false}>
                {abaslist?.map(aba => <Tab key={aba.id} abaInfo={aba} />)}
            </AnimatePresence>

        </Reorder.Group >
    )
}

export default TabGroup