import App from "../../App"
import AbasProvider from "../../context/olt-abas-provider"
import { ThemeProvider } from "../../context/theme-provider"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from '@testing-library/user-event'

const renderApp = () => {
    render(
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AbasProvider>
                <App />
            </AbasProvider>
        </ThemeProvider>
    )
}
describe("OLT-MANAGER Inicialização", () => {
    it("Deve Não ter aba e dashboard ao inicializar", async () => {
        renderApp()
        const search = screen.getByLabelText('searchOlt')
        await userEvent.type(search, ' ')
        const queryOlts = screen.queryAllByLabelText(/Aba-OLT-btn/i)

        expect(screen.queryByLabelText(queryOlts[0].textContent + ' header')).not.toBeInTheDocument()
        expect(screen.queryByLabelText(queryOlts[0].textContent + ' Dashboard')).not.toBeInTheDocument()
    })
})
describe("OLT-MANAGER Search Olts", () => {
    it("busca deve inicia vazia ao ser renderizado", () => {
        renderApp()
        const search = screen.getByLabelText('searchOlt')
        expect(search).toHaveValue('')
    })
    it("Grupo de Olts deve aparecer quando search for vazio", () => {
        renderApp()
        const search = screen.getByLabelText('searchOlt')
        expect(search).toHaveValue('')

        const zteGroup = screen.getByLabelText('ZTE-GROUP')
        const hwGroup = screen.getByLabelText('HW-GROUP')
        expect(zteGroup).toBeInTheDocument()
        expect(hwGroup).toBeInTheDocument()
    })
    it("Grupo de Olts Não deve aparecer quando search tiver algum digito", async () => {
        renderApp()
        const search = screen.getByLabelText('searchOlt')
        await userEvent.type(search, ' ')

        const zteGroup = screen.queryByLabelText('ZTE-GROUP')
        const hwGroup = screen.queryByLabelText('HW-GROUP')
        expect(zteGroup).not.toBeInTheDocument()
        expect(hwGroup).not.toBeInTheDocument()
    })

})
describe("OLT-MANAGER Seleção de OLT", () => {
    it("Deve abrir e selecionar uma aba ao clicar em uma OLT", async () => {
        renderApp()
        const search = screen.getByLabelText('searchOlt')
        await userEvent.type(search, ' ')
        const queryOlts = screen.queryAllByLabelText(/Aba-OLT-btn/i)

        await userEvent.click(queryOlts[0])

        expect(screen.getByLabelText(queryOlts[0].textContent + ' header')).toBeInTheDocument()
        expect(screen.getByLabelText(queryOlts[0].textContent + ' Dashboard')).toBeInTheDocument()
    })
    it("Não Deve abrir Aba de OLT que não foi selecionada", async () => {
        renderApp()
        const search = screen.getByLabelText('searchOlt')
        await userEvent.type(search, ' ')
        const queryOlts = screen.queryAllByLabelText(/Aba-OLT-btn/i)

        await userEvent.click(queryOlts[1])
        expect(screen.queryByLabelText(queryOlts[0].textContent + ' header')).not.toBeInTheDocument()
        expect(screen.queryByLabelText(queryOlts[0].textContent + ' Dashboard')).not.toBeInTheDocument()
    })

})
describe("OLT-MANAGER Dinamica de Abas", () => {
    it("Deve fechar Aba ao apertar no X", async () => {
        renderApp()
        const search = screen.getByLabelText('searchOlt')
        await userEvent.type(search, ' ')
        const queryOlts = screen.queryAllByLabelText(/Aba-OLT-btn/i)

        await userEvent.click(queryOlts[0])
        const closeBtn = screen.getByLabelText(queryOlts[0].textContent + ' close')
        expect(screen.queryByLabelText(queryOlts[0].textContent + ' header')).toBeInTheDocument()
        expect(screen.queryByLabelText(queryOlts[0].textContent + ' Dashboard')).toBeInTheDocument()
        await userEvent.click(closeBtn)
        waitFor(()=>{
            expect(screen.queryByLabelText(queryOlts[0].textContent + ' header')).not.toBeInTheDocument()
            expect(screen.queryByLabelText(queryOlts[0].textContent + ' Dashboard')).not.toBeInTheDocument()

        },{timeout:500})

    })
    it("Deve selecionar Aba posterior ao apertar no X na aba atual", async () => {
        renderApp()
        const search = screen.getByLabelText('searchOlt')
        await userEvent.type(search, ' ')
        const queryOlts = screen.queryAllByLabelText(/Aba-OLT-btn/i)

        await userEvent.click(queryOlts[0])
        await userEvent.click(queryOlts[1])
        const closeBtn = screen.getByLabelText(queryOlts[0].textContent + ' close')
        await userEvent.click(closeBtn)
        expect(screen.queryByLabelText(queryOlts[1].textContent + ' header')).toBeInTheDocument()
        expect(screen.queryByLabelText(queryOlts[1].textContent + ' Dashboard')).toBeInTheDocument()


    })
    it("Deve selecionar Aba anterior ao apertar no X na aba atual e não haver posterior", async () => {
        renderApp()
        const search = screen.getByLabelText('searchOlt')
        await userEvent.type(search, ' ')
        const queryOlts = screen.queryAllByLabelText(/Aba-OLT-btn/i)

        await userEvent.click(queryOlts[0])
        await userEvent.click(queryOlts[1])
        const closeBtn = screen.getByLabelText(queryOlts[1].textContent + ' close')
        await userEvent.click(closeBtn)
        expect(screen.queryByLabelText(queryOlts[0].textContent + ' header')).toBeInTheDocument()
        expect(screen.queryByLabelText(queryOlts[0].textContent + ' Dashboard')).toBeInTheDocument()


    })
    it("Deve ser capaz de selecionar Aba nova ao clicar novamente em uma OLT", async () => {
        renderApp()
        const search = screen.getByLabelText('searchOlt')
        await userEvent.type(search, ' ')
        const queryOlts = screen.queryAllByLabelText(/Aba-OLT-btn/i)

        await userEvent.click(queryOlts[0])
        expect(screen.queryByLabelText(queryOlts[0].textContent + ' header')).toBeInTheDocument()
        expect(screen.queryByLabelText(queryOlts[0].textContent + ' Dashboard')).toBeInTheDocument()
        await userEvent.click(queryOlts[1])
        expect(screen.queryByLabelText(queryOlts[1].textContent + ' header')).toBeInTheDocument()
        expect(screen.queryByLabelText(queryOlts[1].textContent + ' Dashboard')).toBeInTheDocument()
    })
    it(" deve ser capaz de selecionar outra Aba e voltar ao clicar na primeira", async () => {
        renderApp()
        const search = screen.getByLabelText('searchOlt')
        await userEvent.type(search, ' ')
        const queryOlts = screen.queryAllByLabelText(/Aba-OLT-btn/i)

        await userEvent.click(queryOlts[0])
        expect(screen.queryByLabelText(queryOlts[0].textContent + ' header')).toBeInTheDocument()
        expect(screen.queryByLabelText(queryOlts[0].textContent + ' Dashboard')).toBeInTheDocument()
        await userEvent.click(queryOlts[1])
        expect(screen.queryByLabelText(queryOlts[1].textContent + ' header')).toBeInTheDocument()
        expect(screen.queryByLabelText(queryOlts[1].textContent + ' Dashboard')).toBeInTheDocument()
        const headerBTN = screen.getByLabelText(queryOlts[0].textContent + ' header')
        await userEvent.click(headerBTN)
        expect(screen.queryByLabelText(queryOlts[0].textContent + ' header')).toBeInTheDocument()
        expect(screen.queryByLabelText(queryOlts[0].textContent + ' Dashboard')).toBeInTheDocument()
    })
})