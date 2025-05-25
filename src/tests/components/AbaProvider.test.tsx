import AbasProvider, { type AbasContextInterface } from "../../context/olt-abas-provider"
import { ThemeProvider } from "../../context/theme-provider"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import { useAbas } from '@/context/olt-abas-provider'
import type { abaInterface } from "@/interfaces/abas"
import type oltInterface from "@/interfaces/olt-interface"
import { useEffect, useState } from "react"
import { getAbaFromList } from "@/utils/getAbaFromList"
import { Info } from "lucide-react"

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

            {abaInfo && <span>
                <p aria-label="abaInfo-id">{abaInfo.id}</p>
                <p aria-label="onuListInit">{abaInfo.OnuList.length}</p>
                <p aria-label="olt-id">{abaInfo.request!.olt.id}</p>
                <p aria-label="abaInfo-Search">{abaInfo.filter!.search}</p>
                <p aria-label="abaInfo-state">{abaInfo.filter!.state}</p>
            </span>}

        </div>
    )
}

export default AbaProviderTest

describe("AbaProvider Testes Inicialização", () => {
    it("Lista de abas deve inicializar vazia", async () => {
        render(<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AbasProvider>
                <AbaProviderTest />
            </AbasProvider>
        </ThemeProvider>)
        const sizeAbasInit = screen.getByText('Abas Iniciais : 0')
        expect(sizeAbasInit).toBeInTheDocument()


    })
    it("Aba atual deve ser nula ao inicializar", async () => {
        render(<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AbasProvider>
                <AbaProviderTest olt={{ id: 1, model: 'ZTE', location: 'Castanhal' }} />
            </AbasProvider>
        </ThemeProvider>)

        const currentAbaValue = screen.getByText('Current Aba :')
        expect(currentAbaValue).toBeInTheDocument()
    })

})
describe("AbaProvider Criação de Abas", () => {
    it("Deve criar aba ao chamar função createAba()", async () => {
        const oltObj : oltInterface = { id: 1, model: 'ZTE', location: 'Castanhal' }
        render(<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AbasProvider>
                <AbaProviderTest olt={oltObj} />
            </AbasProvider>
        </ThemeProvider>)

        const createBtn = screen.getByText('Criar')
        expect(createBtn).toBeInTheDocument()
        await userEvent.click(createBtn)
        const sizeAbasInit = screen.getByText('Abas Iniciais : 1')
        expect(sizeAbasInit).toBeInTheDocument()

    })
    it("Deve retornar ID igual ao objeto criado no abaslist", async () => {
        const oltObj : oltInterface = { id: 1, model: 'ZTE', location: 'Castanhal' }
        render(<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AbasProvider>
                <AbaProviderTest olt={oltObj} />
            </AbasProvider>
        </ThemeProvider>)
        const createBtn = screen.getByText('Criar')
        expect(createBtn).toBeInTheDocument()
        await userEvent.click(createBtn)
        const idAba = screen.queryByLabelText("id-new-aba")
        const idABInfo = screen.queryByLabelText("abaInfo-id")
        expect(idABInfo?.textContent).toBe(idAba?.textContent)


    })
    it("Deve ter Onulist vazia", async () => {
        const oltObj : oltInterface = { id: 1, model: 'ZTE', location: 'Castanhal' }
        render(<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AbasProvider>
                <AbaProviderTest olt={oltObj} />
            </AbasProvider>
        </ThemeProvider>)

        const createBtn = screen.getByText('Criar')
        expect(createBtn).toBeInTheDocument()
        await userEvent.click(createBtn)
        const OnuListSize = screen.getByLabelText("onuListInit")
        expect(OnuListSize.textContent).toBe("0")


    })
    it("Deve ter id do request Olt igual ao que foi passado na criação", async () => {
        const oltObj : oltInterface = { id: 1, model: 'ZTE', location: 'Castanhal' }
        render(<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AbasProvider>
                <AbaProviderTest olt={oltObj} />
            </AbasProvider>
        </ThemeProvider>)

        const createBtn = screen.getByText('Criar')
        expect(createBtn).toBeInTheDocument()
        await userEvent.click(createBtn)
        const abaInfoOltId = screen.getByLabelText("olt-id")
        expect(Number(abaInfoOltId.textContent)).toBe(oltObj.id)


    })
    it("Deve ter filter search vazio na criação", async () => {
        const oltObj : oltInterface = { id: 1, model: 'ZTE', location: 'Castanhal' }
        render(<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AbasProvider>
                <AbaProviderTest olt={oltObj} />
            </AbasProvider>
        </ThemeProvider>)

        const createBtn = screen.getByText('Criar')
        expect(createBtn).toBeInTheDocument()
        await userEvent.click(createBtn)
        const abaInfoSearch = screen.getByLabelText("abaInfo-Search")
        expect(abaInfoSearch.textContent).toBe("")
        

    })
    it("Deve ter filter state vazio na criação", async () => {
        const oltObj : oltInterface = { id: 1, model: 'ZTE', location: 'Castanhal' }
        render(<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AbasProvider>
                <AbaProviderTest olt={oltObj} />
            </AbasProvider>
        </ThemeProvider>)

        const createBtn = screen.getByText('Criar')
        expect(createBtn).toBeInTheDocument()
        await userEvent.click(createBtn)
        const abaInfoState= screen.getByLabelText("abaInfo-state")
        expect(abaInfoState.textContent).toBe("")
        

    })
})