import AbasProvider from "../../context/olt-abas-provider"
import { ThemeProvider } from "../../context/theme-provider"
import { render, screen, waitFor, } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import { useAbas } from '@/context/olt-abas-provider'
import type { abaInterface } from "@/interfaces/abas"
import type oltInterface from "@/interfaces/olt-interface"
import { useEffect, useLayoutEffect, useState } from "react"
import { getAbaFromList } from "@/utils/getAbaFromList"
import OltDashboard from "@/components/OltDashboard"
import { prettyDOM } from '@testing-library/react'
import { vi } from "vitest"
const Mockonu = [{
    slot: "1",
    pon: "3",
    id: "3",
    name: "18:monique.pimentel",
    type: "RE880",
    configuredSpeedMode: "auto",
    currentSpeedMode: "GPON",
    adminState: "enable",
    phaseState: "working",
    serialNumber: "ZTEGD5F24A76",
    onuStatus: "enable",
    omciBwProfile: "704kbps",
    onuDistance: "2358",
    onlineDuration: "14h 49m 04",
    fec: "disable",
    fecActualMode: "disable",
    lastDown: "2025-05-17 15:08:06    2025-05-18 20:38:02 →  (DyingGasp)",
    signal: -22.292,
},
{
    slot: "1",
    pon: "3",
    id: "5",
    name: "22:jose.neto",
    type: "RE880",
    configuredSpeedMode: "auto",
    currentSpeedMode: "GPON",
    adminState: "enable",
    phaseState: "working",
    serialNumber: "HWTC081367A8",
    onuStatus: "enable",
    omciBwProfile: "704kbps",
    onuDistance: "2320",
    onlineDuration: "123h 21m 31",
    fec: "disable",
    fecActualMode: "disable",
    lastDown: "2025-05-10 12:11:14    2025-05-14 08:06:23 →  (DyingGasp)",
    signal: -23.874,
}]
beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
        configurable: true,
        value: 700,
    });

    // mock do ResizeObserver, necessário para bibliotecas como react-virtual
    global.ResizeObserver = class {
        observe() { }
        unobserve() { }
        disconnect() { }
    };
});

const MockRender = ({ falseId }: { falseId: boolean }) => {
    const { createAba, abaslist, updateAba } = useAbas()
    const [infoId, setinfoId] = useState<string | null>(null)
    useLayoutEffect(() => {
        setinfoId(createAba({ id: 1, location: "Castanhal", model: "ZTE" }))
    }, [])
    useEffect(() => {

        const upatingaba: abaInterface = { ...getAbaFromList(infoId!, abaslist)!, OnuList: Mockonu }
        updateAba(upatingaba)
    }, [infoId])
    useEffect(() => {
        console.log(abaslist[0]);

    }, [abaslist[0]])

    if (infoId && !falseId) {
        return <OltDashboard abaInfoId={infoId} />
    } else if (falseId) {
        return <OltDashboard abaInfoId={'invalido'} />
    }
}
const renderDash = (falseId: boolean) => {
    render(
        <AbasProvider>
            <MockRender falseId={falseId} />
        </AbasProvider>
    )
}
describe("OLT-DASHBOARD renderização basica", () => {

    it('Deve renderizar Id de aba invalida caso não encontre o ID passado por Props', () => {
        renderDash(true)
        expect(screen.queryByText('Id invalido de aba')).toBeInTheDocument()
    })
    it('Deve renderizar todas os components iniciais', () => {
        renderDash(false)
        expect(screen.queryByLabelText('Incidents-btn')).toBeInTheDocument()
        expect(screen.queryByLabelText('load-Pon')).toBeInTheDocument()
        expect(screen.queryByLabelText('search-Onu')).toBeInTheDocument()
        expect(screen.queryByLabelText('table-Onus')).toBeInTheDocument()


    })



})

describe("OLT-DASHBOARD Renderizar OnusList", () => {
    it('Deve renderizar todas os onus registradas na Aba', () => {
        renderDash(false)
        expect(screen.queryByLabelText('Incidents-btn')).toBeInTheDocument()
        expect(screen.queryByLabelText('load-Pon')).toBeInTheDocument()
        expect(screen.queryByLabelText('search-Onu')).toBeInTheDocument()
        expect(screen.queryByLabelText('table-Onus')).toBeInTheDocument()
        const onuListRenderized = screen.queryAllByLabelText('row')
        expect(onuListRenderized.length).toBe(Mockonu.length)
        onuListRenderized.forEach(onu => {
            expect(onu).toBeInTheDocument()
        })

    })
    it('Deve exibir 0 Onus caso pesquisa não corresponda a nenhuma Onu', async () => {
        renderDash(false);
        const searchInput = screen.getByLabelText('search-Onu');

        // Digita o texto na barra de busca
        await userEvent.type(searchInput, 'Invalid-Name');

        // Aguarda a lista atualizar após debounce + render
        await waitFor(() => {
            const rows = screen.queryAllByLabelText('row');
            expect(rows.length).toBe(0); // ou o valor esperado com base no mock

        }, { timeout: 1000 });
        console.log(prettyDOM(screen.queryByLabelText('table-onus')!));

    });
    it('Deve filtrar Onus pelo nome', async () => {
        renderDash(false);
        const searchInput = screen.getByLabelText('search-Onu');

        // Digita o texto na barra de busca
        await userEvent.type(searchInput, '22:');

        // Aguarda a lista atualizar após debounce + render
        await waitFor(() => {
            const rows = screen.queryAllByLabelText('row');
            expect(rows.length).toBe(1); // ou o valor esperado com base no mock
            rows.forEach(e=>console.log(prettyDOM(e))
            )
        }, { timeout: 1000 });
        

    });
    it('Deve filtrar Onus pelo serial', async () => {
        renderDash(false);
        const searchInput = screen.getByLabelText('search-Onu');

        // Digita o texto na barra de busca
        await userEvent.type(searchInput, 'ZTEGD5F24A76');

        // Aguarda a lista atualizar após debounce + render
        await waitFor(() => {
            const rows = screen.queryAllByLabelText('row');
            expect(rows.length).toBe(1); // ou o valor esperado com base no mock
            rows.forEach(e=>console.log(prettyDOM(e))
            )
        }, { timeout: 1000 });
        

    });

})
