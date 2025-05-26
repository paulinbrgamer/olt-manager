import App from "../../App"
import AbasProvider from "../../context/olt-abas-provider"
import { ThemeProvider } from "../../context/theme-provider"
import { render, screen } from "@testing-library/react"
import userEvent from '@testing-library/user-event'


describe("OLT-MANAGER Search Olts", () => {
    it("busca deve inicia vazia", () => {
        render(
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <AbasProvider>
                    <App />
                </AbasProvider>
            </ThemeProvider>
        )
        const search = screen.getByLabelText('searchOlt')
        expect(search).toHaveValue('')
    })
    it("Grupo de Olts deve aparecer quando search for vazio", () => {
        render(
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <AbasProvider>
                    <App />
                </AbasProvider>
            </ThemeProvider>
        )
        const search = screen.getByLabelText('searchOlt')
        expect(search).toHaveValue('')

        const zteGroup = screen.getByLabelText('ZTE-GROUP')
        const hwGroup = screen.getByLabelText('HW-GROUP')
        expect(zteGroup).toBeInTheDocument()
        expect(hwGroup).toBeInTheDocument()
    })
    it("Grupo de Olts Não deve aparecer quando search tiver algum digito", async () => {
        render(
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <AbasProvider>
                    <App />
                </AbasProvider>
            </ThemeProvider>
        )
        const search = screen.getByLabelText('searchOlt')
        await userEvent.type(search, ' ')

        const zteGroup = screen.queryByLabelText('ZTE-GROUP')
        const hwGroup = screen.queryByLabelText('HW-GROUP')
        expect(zteGroup).not.toBeInTheDocument()
        expect(hwGroup).not.toBeInTheDocument()
    })

})
describe("OLT-MANAGER Seleção de OLT", () => {
    it("Deve abrir e selecionar uma aba ao selecionar OLT", async () => {
        render(
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <AbasProvider>
                    <App />
                </AbasProvider>
            </ThemeProvider>
        )
        const search = screen.getByLabelText('searchOlt')
        await userEvent.type(search, ' ')
        const queryOlts = screen.queryAllByLabelText(/Aba-OLT-btn/i)

        await userEvent.click(queryOlts[0])
        expect(screen.getByLabelText(queryOlts[0].textContent + ' header')).toBeInTheDocument()
        expect(screen.getByLabelText(queryOlts[0].textContent +' Dashboard')).toBeInTheDocument()
    })
})