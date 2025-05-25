import AbasProvider, { type AbasContextInterface } from "../../context/olt-abas-provider"
import { ThemeProvider } from "../../context/theme-provider"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import { useAbas } from '@/context/olt-abas-provider'
import type { abaInterface } from "@/interfaces/abas"

const AbaProviderTest = ({ aba }: { aba?: abaInterface }) => {
    const context = useAbas()



    return (
        <div>
            <span>Abas Iniciais : {context.abaslist.length}</span>
            <span>Current Aba : {context.currentAbaInfo}</span>
        </div>
    )
}

export default AbaProviderTest

describe("AbaProvider Testes", () => {
    it("Lista de abas deve inicializar vazio", async () => {
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
                <AbaProviderTest />
            </AbasProvider>
        </ThemeProvider>)
    
        const currentAbaValue = screen.getByText('Current Aba :')
        expect(currentAbaValue).toBeInTheDocument()
    })

})