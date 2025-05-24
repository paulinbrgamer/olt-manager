import App from "../../App"
import AbasProvider from "../../context/olt-abas-provider"
import { ThemeProvider } from "../../context/theme-provider"
import { render, screen } from "@testing-library/react"
import userEvent from '@testing-library/user-event'

describe("Teste de troca de Aba lateral", () => {
    it("Deve trocar para Incidents ao clicar no botão de incidents", async () => {
        render(
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <AbasProvider>
                    <App />
                </AbasProvider>
            </ThemeProvider>
        )
        const incidentsBtn = screen.getByLabelText('btn-Incidents')
        expect(incidentsBtn).toBeInTheDocument()
        expect(screen.queryByLabelText("screen-olt")).toBeInTheDocument()

        await userEvent.click(incidentsBtn)
        expect(screen.queryByLabelText("screen-olt")).not.toBeInTheDocument()
        expect(screen.queryByLabelText("screen-incidents")).toBeInTheDocument()
    })

    it("Deve trocar para incidente, e logo após mudar para OLTs novamente", async () => {
        render(
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <AbasProvider>
                    <App />
                </AbasProvider>
            </ThemeProvider>
        )
        const incidentsBtn = screen.getByLabelText('btn-Incidents')
        const oltBtn= screen.getByLabelText('btn-Olt')
        expect(incidentsBtn).toBeInTheDocument()
        expect(screen.queryByLabelText("screen-olt")).toBeInTheDocument()

        await userEvent.click(incidentsBtn)
        expect(screen.queryByLabelText("screen-olt")).not.toBeInTheDocument()
        expect(screen.queryByLabelText("screen-incidents")).toBeInTheDocument()
        await userEvent.click(oltBtn)
        expect(screen.queryByLabelText("screen-olt")).toBeInTheDocument()
        expect(screen.queryByLabelText("screen-incidents")).not.toBeInTheDocument()

    })
})