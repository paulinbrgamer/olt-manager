import AbasProvider from "../../context/olt-abas-provider"
import { ThemeProvider } from "../../context/theme-provider"
import { render, screen, } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import { useAbas } from '@/context/olt-abas-provider'
import type { abaInterface } from "@/interfaces/abas"
import type oltInterface from "@/interfaces/olt-interface"
import { useEffect, useLayoutEffect, useState } from "react"
import { getAbaFromList } from "@/utils/getAbaFromList"
import OltDashboard from "@/components/OltDashboard"
const MockProvider = ()=>{
    
    
}
const MockRender = ({falseId} : {falseId: boolean})=>{
    const {createAba} = useAbas()
    const [infoId, setinfoId] = useState<string | null>(null)
    useLayoutEffect(() => {
        setinfoId(createAba({id:1,location:"Castanhal",model:"ZTE"}))
      }, [])
    if(infoId && !falseId){
        return <OltDashboard abaInfoId={infoId}/>
    }else if(falseId){
        return <OltDashboard abaInfoId={'invalido'}/>
    }
} 
const renderDash = (falseId : boolean)=>{
    render(
        <AbasProvider>
            <MockRender falseId={falseId}/>
        </AbasProvider>
    )
}
describe("OLT-DASHBOARD renderização",()=>{
    
    it('Deve renderizar Id de aba invalida caso não encontre o ID passado por Props',()=>{
        renderDash(true)
        expect(screen.queryByText('Id invalido de aba')).toBeInTheDocument()
    })
    it('Deve renderizar todos os botões de ação',()=>{
        renderDash(false)
        expect(screen.queryByLabelText('Incidents-btn')).toBeInTheDocument()
        expect(screen.queryByLabelText('load-Pon')).toBeInTheDocument()
        expect(screen.queryByLabelText('search-Onu')).toBeInTheDocument()
        expect(screen.queryByLabelText('table-Onus')).toBeInTheDocument()
        
                
    })
})
