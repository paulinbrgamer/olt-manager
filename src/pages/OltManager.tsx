
import useAbas from '../context/useAbas'
import PonScreen from '../components/PonScreen'
import OltSideBar from '@/components/OltManager/OltSideBar'
import TabGroup from '@/components/OltManager/TabGroup'
const OltManager = () => {
    const { abaslist, currentAbaInfo } = useAbas()

    return (
        <div aria-label="screen-olt" className='grid grid-cols-[auto_2fr] grid-rows-[30px_1fr]  w-full '>
            <OltSideBar/>
            <TabGroup/>
            
            {/*Conteudo principal renderizado da tab atual*/}
            {currentAbaInfo && abaslist.length > 0 ? (
                <PonScreen abaInfoId={currentAbaInfo} key={currentAbaInfo} />
            ) : (
                <div className='flex-1 flex col-end-3 justify-center items-center flex-col'>
                    <p>👈 Selecione uma Olt para abrir uma aba</p>
                </div>
            )}
            <p className='col-start-2 text-end pr-5 pb-1'>Beta-1.0</p>

        </div>
    )
}

export default OltManager