import { useAbas } from '@/context/olt-abas-provider'
import { isAbaInterface, type abaInterface } from "@/interfaces/abas"
import type oltInterface from "@/interfaces/olt-interface"
import { useEffect, useState } from "react"
import { getAbaFromList } from "@/utils/getAbaFromList"
import AbasProvider from "../../context/olt-abas-provider"
import { ThemeProvider } from "../../context/theme-provider"
import { render, screen, } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
const AbaProviderTest = ({ olt }: { olt?: oltInterface }) => {
    const context = useAbas()
    const [abaNova, setabaNova] = useState<string | null>(null)
    const [abaInfo, setAbaInfo] = useState<abaInterface | null>(null)
    useEffect(() => {
        if (abaNova) {
            setAbaInfo(getAbaFromList(abaNova, context.abaslist)!)
        }
    }, [abaNova])

    return (
        <div>
            <span>Abas Iniciais : {context.abaslist.length}</span>
            <span>Current Aba : {context.currentAbaInfo}</span>
            <span aria-label="id-new-aba">{abaNova}</span>
            <button onClick={() => setabaNova(context.createAba(olt!))}>Criar</button>
            <button onClick={() => setabaNova(context.createAba(olt!)+'erro')}>Criar Erro</button>
            <div aria-label='state-string'>{JSON.stringify(abaInfo)}
            </div>

        </div>
    )
}
describe("Função GetAbaFromList Testes", () => {
    it("Deve retornar null quando não encontrar Aba", async () => {
        const oltObj: oltInterface = { id: 1, model: 'ZTE', location: 'Castanhal' }
        render(<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AbasProvider>
                <AbaProviderTest olt={oltObj} />
            </AbasProvider>
        </ThemeProvider>)

        const createBtn = screen.getByText('Criar Erro')
        expect(createBtn).toBeInTheDocument()
        await userEvent.click(createBtn)
        const state = screen.queryByLabelText('state-string')
        expect(state?.textContent).toBe("")
        

    })
    it("Deve retornar Aba quando encontrar Aba", async () => {
        const oltObj: oltInterface = { id: 1, model: 'ZTE', location: 'Castanhal' }
        render(<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AbasProvider>
                <AbaProviderTest olt={oltObj} />
            </AbasProvider>
        </ThemeProvider>)

        const createBtn = screen.getByText('Criar')
        expect(createBtn).toBeInTheDocument()
        await userEvent.click(createBtn)
        const state = screen.queryByLabelText('state-string')?.textContent
        const jsonParsed =JSON.parse(state!) 
        expect(isAbaInterface(jsonParsed)).toBe(true)
        
        
        

    })
})