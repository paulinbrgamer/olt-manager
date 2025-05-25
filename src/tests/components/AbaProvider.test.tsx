import AbasProvider, { type AbasContextInterface } from "../../context/olt-abas-provider"
import { ThemeProvider } from "../../context/theme-provider"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import AbaProviderTest from "./AbaProviderTest"
import { vi } from "vitest"
describe("AbaProvider Testes", () => {
    it("Lista de abas deve inicializar vazio", async () => {
        const callback = vi.fn()
        render(<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AbasProvider>
                <AbaProviderTest callback={callback} />
            </AbasProvider>
        </ThemeProvider>)

        expect(callback).toHaveBeenCalled()
        const context : AbasContextInterface = callback.mock.calls[0][0]
        expect(context.abaslist).toStrictEqual([])
        
        
    })
    it("Aba atual deve ser nula ao inicializar", async () => {
        const callback = vi.fn()
        render(<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AbasProvider>
                <AbaProviderTest callback={callback} />
            </AbasProvider>
        </ThemeProvider>)

        expect(callback).toHaveBeenCalled()
        const context : AbasContextInterface = callback.mock.calls[0][0]
        
        expect(context.currentAbaInfo).toBe(null)
        
        
    })
    
})