import AbasProvider from "../../context/olt-abas-provider"
import { render, screen, waitFor, } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import { useAbas } from '@/context/olt-abas-provider'
import type { abaInterface } from "@/interfaces/abas"
import { useEffect, useLayoutEffect, useState } from "react"
import { getAbaFromList } from "@/utils/getAbaFromList"
import PonScreen from "@/components/PonScreen"
import { prettyDOM } from '@testing-library/react'
import type { OnuInfo } from "@/interfaces/onu-interface"

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
    phaseState: "LOS",
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
const MockonuFilter = [
    {
    slot: "1",
    pon: "3",
    id: "1",
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
    name: "18:jose.neto",
    type: "RE880",
    configuredSpeedMode: "auto",
    currentSpeedMode: "GPON",
    adminState: "enable",
    phaseState: "LOS",
    serialNumber: "HWTC081367A8",
    onuStatus: "enable",
    omciBwProfile: "704kbps",
    onuDistance: "2320",
    onlineDuration: "123h 21m 31",
    fec: "disable",
    fecActualMode: "disable",
    lastDown: "2025-05-10 12:11:14    2025-05-14 08:06:23 →  (DyingGasp)",
    signal: -23.874,
},{
    slot: "1",
    pon: "3",
    id: "5",
    name: "22:test.gasp",
    type: "RE880",
    configuredSpeedMode: "auto",
    currentSpeedMode: "GPON",
    adminState: "enable",
    phaseState: "DyingGasp",
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
    id: "6",
    name: "22:test.offline",
    type: "RE880",
    configuredSpeedMode: "auto",
    currentSpeedMode: "GPON",
    adminState: "enable",
    phaseState: "OffLine",
    serialNumber: "ZTEGD5F24A76",
    onuStatus: "enable",
    omciBwProfile: "704kbps",
    onuDistance: "2358",
    onlineDuration: "14h 49m 04",
    fec: "disable",
    fecActualMode: "disable",
    lastDown: "2025-05-17 15:08:06    2025-05-18 20:38:02 →  (DyingGasp)",
    signal: -22.292,
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

const MockRender = ({ falseId, mock }: { falseId: boolean, mock: OnuInfo[] }) => {
    const { createAba, abaslist, updateAba } = useAbas()
    const [infoId, setinfoId] = useState<string | null>(null)
    useLayoutEffect(() => {
        setinfoId(createAba({ id: 1, location: "Castanhal", model: "ZTE" }))
    }, [])
    useEffect(() => {

        const upatingaba: abaInterface = { ...getAbaFromList(infoId!, abaslist)!, OnuList: mock }
        updateAba(upatingaba)
    }, [infoId])
    useEffect(() => {
        console.log(abaslist[0]);

    }, [abaslist[0]])

    if (infoId && !falseId) {
        return <PonScreen abaInfoId={infoId} />
    } else if (falseId) {
        return <PonScreen abaInfoId={'invalido'} />
    }
}
const renderDash = (falseId: boolean, mock: OnuInfo[]) => {
    render(
        <AbasProvider>
            <MockRender mock={mock} falseId={falseId} />
        </AbasProvider>
    )
}
describe("PonScreen renderização basica", () => {

    it('Deve renderizar Id de aba invalida caso não encontre o ID passado por Props', () => {
        renderDash(true, Mockonu)
        expect(screen.queryByText('Id invalido de aba')).toBeInTheDocument()
    })
    it('Deve renderizar todas os components iniciais', () => {
        renderDash(false, Mockonu)
        expect(screen.queryByLabelText('Incidents-btn')).toBeInTheDocument()
        expect(screen.queryByLabelText('load-Pon')).toBeInTheDocument()
        expect(screen.queryByLabelText('search-Onu')).toBeInTheDocument()
        expect(screen.queryByLabelText('table-Onus')).toBeInTheDocument()


    })



})

describe("PonScreen Filtrar por nome e serial", () => {
    it('Deve renderizar todas os onus registradas na Aba', () => {
        renderDash(false,Mockonu)
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
        renderDash(false, Mockonu);
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
        renderDash(false, Mockonu);
        const searchInput = screen.getByLabelText('search-Onu');

        // Digita o texto na barra de busca
        await userEvent.type(searchInput, '22:');

        // Aguarda a lista atualizar após debounce + render
        await waitFor(() => {
            const rows = screen.queryAllByLabelText('row');
            expect(rows.length).toBe(1); // ou o valor esperado com base no mock
            rows.forEach(e => console.log(prettyDOM(e))
            )
        }, { timeout: 1000 });


    });
    it('Deve filtrar Onus pelo serial', async () => {
        renderDash(false, Mockonu);
        const searchInput = screen.getByLabelText('search-Onu');

        // Digita o texto na barra de busca
        await userEvent.type(searchInput, 'ZTEGD5F24A76');

        // Aguarda a lista atualizar após debounce + render
        await waitFor(() => {
            const rows = screen.queryAllByLabelText('row');
            expect(rows.length).toBe(1); // ou o valor esperado com base no mock
            rows.forEach(e => console.log(prettyDOM(e))
            )
        }, { timeout: 1000 });


    });

})

describe("PonScreen Filtrar por state,", () => {
    it('Deve filtrar Onus pelo state Working', async () => {
        renderDash(false, MockonuFilter);
        const stateFilter = screen.getByLabelText('filter-btn');
        await userEvent.click(stateFilter)
        const state = screen.getByLabelText("filter-working")
        await userEvent.click(state)
        // Aguarda a lista atualizar após debounce + render
        await waitFor(() => {
            const rows = screen.queryAllByLabelText('row');
            expect(rows.length).toBe(1); // ou o valor esperado com base no mock
            rows.forEach(e => console.log(prettyDOM(e))
            )
        }, { timeout: 1000 });
    });
    it('Deve filtrar Onus pelo state LOS', async () => {
        renderDash(false, MockonuFilter);
        const stateFilter = screen.getByLabelText('filter-btn');
        await userEvent.click(stateFilter)
        const state = screen.getByLabelText("filter-LOS")
        await userEvent.click(state)
        // Aguarda a lista atualizar após debounce + render
        await waitFor(() => {
            const rows = screen.queryAllByLabelText('row');
            expect(rows.length).toBe(1); // ou o valor esperado com base no mock
            rows.forEach(e => console.log(prettyDOM(e))
            )
        }, { timeout: 1000 });
    });
    it('Deve filtrar Onus pelo state DyingGasp', async () => {
        renderDash(false, MockonuFilter);
        const stateFilter = screen.getByLabelText('filter-btn');
        await userEvent.click(stateFilter)
        const state = screen.getByLabelText("filter-DyingGasp")
        await userEvent.click(state)
        // Aguarda a lista atualizar após debounce + render
        await waitFor(() => {
            const rows = screen.queryAllByLabelText('row');
            expect(rows.length).toBe(1); // ou o valor esperado com base no mock
            rows.forEach(e => console.log(prettyDOM(e))
            )
        }, { timeout: 1000 });
    });
    it('Deve filtrar Onus pelo state OffLine', async () => {
        renderDash(false, MockonuFilter);
        const stateFilter = screen.getByLabelText('filter-btn');
        await userEvent.click(stateFilter)
        const state = screen.getByLabelText("filter-OffLine")
        await userEvent.click(state)
        // Aguarda a lista atualizar após debounce + render
        await waitFor(() => {
            const rows = screen.queryAllByLabelText('row');
            expect(rows.length).toBe(1); // ou o valor esperado com base no mock
            rows.forEach(e => console.log(prettyDOM(e))
            )
        }, { timeout: 1000 });
    });
    it('Deve remover Filtros', async () => {
        renderDash(false, MockonuFilter);
        const stateFilter = screen.getByLabelText('filter-btn');
        await userEvent.click(stateFilter)
        const state = screen.getByLabelText("filter-X")
        await userEvent.click(state)
        // Aguarda a lista atualizar após debounce + render
        await waitFor(() => {
            const rows = screen.queryAllByLabelText('row');
            expect(rows.length).toBe(4); // ou o valor esperado com base no mock
            rows.forEach(e => console.log(prettyDOM(e))
            )
        }, { timeout: 1000 });
    });
})
describe("PonScreen Filtrar por state e nome/serial", () => {
  it('Deve filtrar pelo state "LOS" e nome "jose"', async () => {
    renderDash(false, MockonuFilter);
    
    const searchInput = screen.getByLabelText('search-Onu');
    const stateFilterBtn = screen.getByLabelText('filter-btn');

    // Ativa filtro de estado
    await userEvent.click(stateFilterBtn);
    const stateLOS = screen.getByLabelText("filter-LOS");
    await userEvent.click(stateLOS);

    // Digita o nome a ser pesquisado
    await userEvent.type(searchInput, "jose");

    await waitFor(() => {
      const rows = screen.queryAllByLabelText('row');
      expect(rows.length).toBe(1);
      expect(rows[0]).toHaveTextContent("jose.neto");
    }, { timeout: 1000 });
  });

  it('Deve filtrar pelo state "DyingGasp" e serial "ZTE"', async () => {
    renderDash(false, MockonuFilter);

    const searchInput = screen.getByLabelText('search-Onu');
    const stateFilterBtn = screen.getByLabelText('filter-btn');

    await userEvent.click(stateFilterBtn);
    const stateDyingGasp = screen.getByLabelText("filter-DyingGasp");
    await userEvent.click(stateDyingGasp);

    await userEvent.type(searchInput, "ZTE");

    await waitFor(() => {
      const rows = screen.queryAllByLabelText('row');
      expect(rows.length).toBe(1);
      expect(rows[0]).toHaveTextContent("ZTEGD5F24A76");
      expect(rows[0]).toHaveTextContent("DyingGasp");
    }, { timeout: 1000 });
  });

  it('Deve retornar 0 quando não houver combinação entre state e nome', async () => {
    renderDash(false, MockonuFilter);

    const searchInput = screen.getByLabelText('search-Onu');
    const stateFilterBtn = screen.getByLabelText('filter-btn');

    await userEvent.click(stateFilterBtn);
    const stateLOS = screen.getByLabelText("filter-LOS");
    await userEvent.click(stateLOS);

    await userEvent.type(searchInput, "monique"); // monique está no state "working", não "LOS"

    await waitFor(() => {
      const rows = screen.queryAllByLabelText('row');
      expect(rows.length).toBe(0);
    }, { timeout: 1000 });
  });
});
