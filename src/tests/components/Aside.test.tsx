import App from "../../App"
import AbasProvider from "../../context/olt-abas-provider"
import { ThemeProvider } from "../../context/theme-provider"
import { render, screen } from "@testing-library/react"
import userEvent from '@testing-library/user-event'

describe("Teste de troca de Aba lateral", () => {
    it("Deve trocar para Incidents ao clicar no botão de incidents",async () => {
        render(
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <AbasProvider>
                    <App/>
                </AbasProvider>
            </ThemeProvider>
        )
        const incidentsBtn = screen.getByLabelText('btn-Incidents')
        const oltScreenTitle = screen.queryByText(/OLT MANAGER/i)
        expect(oltScreenTitle).toBeInTheDocument()
        expect(incidentsBtn).toBeInTheDocument()

        await userEvent.click(incidentsBtn)
        expect(oltScreenTitle).not.toBeInTheDocument()
    })
})