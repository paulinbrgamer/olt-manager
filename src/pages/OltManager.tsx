
import Tab from '../components/Tab'
import useAbas from '../context/useAbas'
import { AnimatePresence, Reorder } from 'framer-motion'
import PonScreen from '../components/PonScreen'
import OltSideBar from '@/components/OltManager/OltSideBar'
const OltManager = () => {
    const { abaslist, currentAbaInfo, setAbasList } = useAbas()

    return (
        <div aria-label="screen-olt" className='grid grid-cols-[auto_2fr] grid-rows-[30px_1fr]  w-full '>
            <OltSideBar/>
            <Reorder.Group axis={'x'} values={abaslist} onReorder={setAbasList} className="flex h-11 bg-primary-foreground overflow-hidden min-w-0 gap-2p-2 ">
                <AnimatePresence initial={false}>
                    {abaslist?.map(aba => <Tab key={aba.id} abaInfo={aba} />)}
                </AnimatePresence>

            </Reorder.Group >
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