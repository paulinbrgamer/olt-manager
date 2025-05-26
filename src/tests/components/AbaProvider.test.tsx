import AbasProvider from "../../context/olt-abas-provider"
import { ThemeProvider } from "../../context/theme-provider"
import { render, screen, } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import { useAbas } from '@/context/olt-abas-provider'
import type { abaInterface } from "@/interfaces/abas"
import type oltInterface from "@/interfaces/olt-interface"
import { useEffect, useState } from "react"
import { getAbaFromList } from "@/utils/getAbaFromList"

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
            <button onClick={() => context.removeAba('awdawd')}>Delete</button>
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

describe("AbasProvider Testes Inicialização", () => {
    it("Lista de abas Deve iniciar vazia ao instanciar Provider", async () => {
        render(<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AbasProvider>
                <AbaProviderTest />
            </AbasProvider>
        </ThemeProvider>)
        const sizeAbasInit = screen.getByText('Abas Iniciais : 0')
        expect(sizeAbasInit).toBeInTheDocument()


    })
    it("Aba atual deve ser nula ao inicializar Provider", async () => {
        render(<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AbasProvider>
                <AbaProviderTest olt={{ id: 1, model: 'ZTE', location: 'Castanhal' }} />
            </AbasProvider>
        </ThemeProvider>)

        const currentAbaValue = screen.getByText('Current Aba :')
        expect(currentAbaValue).toBeInTheDocument()
    })

})
describe("AbasProvider Criação de Abas", () => {
    it("Deve criar aba ao chamar função createAba()", async () => {
        const oltObj: oltInterface = { id: 1, model: 'ZTE', location: 'Castanhal' }
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
    it("Deve retornar ID igual ao adicionado na lista de abas quando chamar createAba()", async () => {
        const oltObj: oltInterface = { id: 1, model: 'ZTE', location: 'Castanhal' }
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
    it("Deve ter Onulist vazia ao criar Aba com createAba()", async () => {
        const oltObj: oltInterface = { id: 1, model: 'ZTE', location: 'Castanhal' }
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
    it("Deve ter id do request Olt igual ao que foi passado na criação da Aba", async () => {
        const oltObj: oltInterface = { id: 1, model: 'ZTE', location: 'Castanhal' }
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
    it("Deve ter filter search vazio ao ser criada Aba", async () => {
        const oltObj: oltInterface = { id: 1, model: 'ZTE', location: 'Castanhal' }
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
    it("Deve ter filter state vazio ao ser criada Aba", async () => {
        const oltObj: oltInterface = { id: 1, model: 'ZTE', location: 'Castanhal' }
        render(<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AbasProvider>
                <AbaProviderTest olt={oltObj} />
            </AbasProvider>
        </ThemeProvider>)

        const createBtn = screen.getByText('Criar')
        expect(createBtn).toBeInTheDocument()
        await userEvent.click(createBtn)
        const abaInfoState = screen.getByLabelText("abaInfo-state")
        expect(abaInfoState.textContent).toBe("")


    })
})
describe("AbasProvider Deleção de Abas", () => {
    const NotExistentId = () => {
        const context = useAbas()
        const [abaNova, setabaNova] = useState<string | null>(null)
        return <>
            <span aria-label="size-list">{context.abaslist.length}</span>
            <button onClick={() => context.removeAba("invalid-id")}>Delete</button>
            <button onClick={() => context.removeAba(abaNova!)}>Delete Valid</button>
            <button onClick={() => setabaNova(context.createAba({ id: 1, model: 'ZTE', location: 'Castanhal' }))}>Criar</button>
        </>
    }
    it("Deve retornar a abaslist completa se não encontrar item a ser deletado ao chamar remove()", async () => {

        render(
            <AbasProvider>
                <NotExistentId />
            </AbasProvider>
        )
        const btn = screen.getByText('Delete')
        const create = screen.getByText('Criar')
        expect(btn).toBeInTheDocument()
        await userEvent.click(create)
        expect(screen.getByLabelText("size-list").textContent).toBe("1")
        await userEvent.click(btn)
        expect(screen.getByLabelText("size-list").textContent).toBe("1")
    })
    it("Deve remover item que encontrar com o id passado ao chamar função remove()", async () => {
        render(
            <AbasProvider>
                <NotExistentId />
            </AbasProvider>
        )
        const btn = screen.getByText('Delete Valid')
        const create = screen.getByText('Criar')
        expect(btn).toBeInTheDocument()
        await userEvent.click(create)
        expect(screen.getByLabelText("size-list").textContent).toBe("1")
        await userEvent.click(btn)
        expect(screen.getByLabelText("size-list").textContent).toBe("0")
    })
})
describe("AbasProvider Atualização de Aba", () => {
    const NotExistentId = ({ shouldUpdateId = false }) => {
        const context = useAbas()
        const [abaNova, setabaNova] = useState<string | null>(null)
        const [jsonInfo, setJsonInfo] = useState("")

        useEffect(() => {
            if (abaNova) {
                const aba = getAbaFromList(abaNova, context.abaslist)
                setJsonInfo(JSON.stringify(aba))
            }
        }, [abaNova, context.abaslist])

        const handleCreate = () => {
            const newId = context.createAba({ id: 1, model: 'ZTE', location: 'Castanhal' })
            setabaNova(newId)
        }

        const handleUpdate = () => {
            const original = JSON.parse(jsonInfo)
            const id = shouldUpdateId ? "Invalid" : original.id
            context.updateAba({
                ...original,
                id,
                filter: {
                    ...original.filter,
                    search: "Updated search"
                }
            })
        }

        return (
            <>
                <button onClick={handleCreate}>Criar</button>
                <span aria-label="size-list">{jsonInfo}</span>
                <button onClick={handleUpdate}>update</button>
            </>
        )
    }

    it("Não deve atualizar nada se ID não existir ao chamar update()", async () => {
        render(
            <AbasProvider>
                <NotExistentId shouldUpdateId={true} />
            </AbasProvider>
        )
        await userEvent.click(screen.getByText("Criar"))
        const antes = screen.getByLabelText("size-list").textContent!
        await userEvent.click(screen.getByText("update"))
        const depois = screen.getByLabelText("size-list").textContent!
        expect(depois).toBe(antes)
    })

    it("Deve atualizar a aba se o ID existir ao chamar update()", async () => {
        render(
            <AbasProvider>
                <NotExistentId shouldUpdateId={false} />
            </AbasProvider>
        )
        await userEvent.click(screen.getByText("Criar"))
        const antes = screen.getByLabelText("size-list").textContent!
        await userEvent.click(screen.getByText("update"))
        const depois = screen.getByLabelText("size-list").textContent!
        expect(depois).not.toBe(antes)
        expect(JSON.parse(depois).filter.search).toBe("Updated search")
    })
})