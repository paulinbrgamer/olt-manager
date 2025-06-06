import { EllipsisVertical, Filter, Signal, X } from "lucide-react";
import { Button } from "./ui/button";
import type { OnuInfo, OnuInfoHw } from "@/interfaces/onu-interface";
import React, { useEffect, useRef, useState } from "react";
import { useVirtualizer } from '@tanstack/react-virtual';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger, Portal } from "@radix-ui/react-dropdown-menu";
import { useAbas } from "@/context/olt-abas-provider";
import { getAbaFromList } from "@/utils/getAbaFromList";
import type { abaInterface } from "@/interfaces/abas";
import type { stateOnu } from "@/interfaces/filter";
import { filterBySearch } from "@/utils/filterBySearch";
import { Dialog, DialogContent, DialogDescription, DialogTitle, Overlay } from "@radix-ui/react-dialog";
import { Table, TableHead, TableHeader, TableRow } from "./ui/table";
import OnuDetailsTable from "./OnuDetailsTable";
interface Props {
  abaInfoId: string | undefined,
  ariaLabel?: string
}
const signalColor = (signal: number) => {
  if (signal >= -24) return "text-green-500";
  if (signal >= -28) return "text-orange-500";
  return "text-red-500";
};

const StateComponent = ({ state }: { state: string }) => {
  const stateStyles = {
    working: "bg-green-200/10 text-green-500",
    online: "bg-green-200/10 text-green-500",
    DyingGasp: "bg-gray-200/10 text-gray-500",
    OffLine: "bg-red-200/10 text-red-500",
    offline: "bg-red-200/10 text-red-500",
    LOS: "bg-red-200/10 text-red-500",
  };

  return (
    <div className={`flex w-fit gap-2 p-1 rounded-full text-sm font-medium ${stateStyles[state as keyof typeof stateStyles] || ""}`}>
      <p>{state}</p>
    </div>
  );
};

const OnusTable: React.FC<Props> = React.memo(({ abaInfoId, ariaLabel }) => {
  const [modalDetails, setmodalDetails] = useState(false)
  const [onuDetailTarget, setOnuDetailTarget] = useState<OnuInfo | OnuInfoHw | null>(null)
  const { updateAba, abaslist } = useAbas()
  const abaInfo: abaInterface = getAbaFromList(abaInfoId!, abaslist)!
  const stateFilter = filterBySearch(abaInfo.OnuList, abaInfo.filter.state, ['phaseState']) //variavel com as onusFiltradas por state
  const parentRef = useRef<HTMLDivElement>(null);
  const [filteredOnulistSearch, setFilteredOnulistSearch] = useState<OnuInfo[]>([])//state para guardar as onus filtradas

  const rowVirtualized = useVirtualizer({
    count: filteredOnulistSearch!.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 55,
  });
  const handleSelectFilter = (newstate: stateOnu) => {
    updateAba({ ...abaInfo, filter: { ...abaInfo.filter, state: newstate } })
  }
  //carregando a lista de onus filtradas por state no filteredOnulistSearch
  useEffect(() => {
    setFilteredOnulistSearch(stateFilter);


  }, [abaInfo.filter.state])
  //carregando a lista de onus filtradas por state no filteredOnulistSearch toda vez que a lista atualiza
  useEffect(() => {
    setFilteredOnulistSearch(stateFilter);

  }, [abaInfo.OnuList])
  //useEffect para atualizar a onuList conforme o imput do debounce mudar e também quando o filtro se alterar
  useEffect(() => {

    //verifica se  tem algo digitado e faz o filtro setando as onusFiltradas e atualizando o estado da aba.
    if (abaInfo.filter.search) {
      const result = filterBySearch(stateFilter, abaInfo.filter.search, ['name', 'serialNumber']);
      setFilteredOnulistSearch(result);

    } else {
      //caso o que for digitado seja vazio, retorna as onusFiltradas por state e atualiza o search da aba.
      setFilteredOnulistSearch(stateFilter);
    }
  }, [abaInfo.filter.state, abaInfo.OnuList, abaInfo.filter.search]);

  return (
    <>
      <Dialog open={modalDetails} onOpenChange={setmodalDetails}>
        <Overlay className="fixed inset-0 bg-black/50 backdrop-blur-xx z-50" />
        <DialogContent className="z-50 absolute bg-sidebar border self-center  tall  mr-[15%] w-fit  px-5 pb-5 pt-5 rounded-md flex flex-col data-[state=open]:animate-in data-[state=open]:fade-in-40 data-[state=open]:slide-in-from-bottom-2
                          data-[state=closed]:animate-out data-[state=closed]:fade-out-40 data-[state=closed]:slide-out-to-bottom-2">

          <div className='flex flex-row justify-between items-start mb-4 gap-4'>
            <DialogTitle className="text-xl font-bold ">Detalhes da Onu</DialogTitle>
            <Button className='self-start w-8 ' size={'icon'} variant={'ghost'} onClick={() => setmodalDetails(false)}><X size={10} /></Button>
          </div>
          <OnuDetailsTable data={onuDetailTarget!}/>
        </DialogContent>
      </Dialog>
      <div className="h-full flex flex-col border rounded-md overflow-hidden" aria-label={'table-Onus'}>
        {/* Cabeçalho */}
        <div className="grid grid-cols-[0.1fr_2fr_1.5fr_1fr_80px_3fr] text-sm font-medium bg-tablerow text-textrow px-4 py-3 border-b transition-all  duration-35 hover:bg-accent/60  ease-in">
          <div className="w-[100px]">ID</div>
          <div>Nome</div>
          <div className="text-start">Serial</div>
          <div className="text-center flex  items-start gap-1 justify-center">
            <p>Status</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-label="filter-btn" variant={'ghost'} size={'icon'} className={`rounded-full h-5 ${abaInfo.filter.state != "" ? 'bg-accent' : ''}`}><Filter size={16} /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-fit border rounded-md bg-background z-10 data-[state=open]:animate-in data-[state=open]:fade-in-40 data-[state=open]:slide-in-from-top-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-40 data-[state=closed]:slide-out-to-top-2 '>
                <DropdownMenuGroup>
                  {abaInfo.request?.olt.model == "ZTE" ? (
                    <>
                      <DropdownMenuItem onSelect={() => handleSelectFilter("working")} >
                        <Button aria-label="filter-working" className='w-full text-start' variant={'ghost'}>{<StateComponent state="working" />}</Button>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleSelectFilter("LOS")} >
                        <Button aria-label="filter-LOS" className='w-full text-start' variant={'ghost'}>{<StateComponent state="LOS" />}</Button>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleSelectFilter("DyingGasp")}  >
                        <Button aria-label="filter-DyingGasp" className='w-full text-start' variant={'ghost'}>{<StateComponent state="DyingGasp" />}</Button>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleSelectFilter("OffLine")}  >
                        <Button aria-label="filter-OffLine" className='w-full text-start' variant={'ghost'}>{<StateComponent state="OffLine" />}</Button>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleSelectFilter("")} >
                        <Button aria-label="filter-X" className='w-full text-start' variant={'ghost'}>{<X />}</Button>
                      </DropdownMenuItem></>
                  ) : (
                    <>
                      <DropdownMenuItem onSelect={() => handleSelectFilter("offline")}  >
                        <Button aria-label="filter-OffLine" className='w-full text-start' variant={'ghost'}>{<StateComponent state="offline" />}</Button>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleSelectFilter("online")}  >
                        <Button aria-label="filter-OffLine" className='w-full text-start' variant={'ghost'}>{<StateComponent state="online" />}</Button>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleSelectFilter("")} >
                        <Button aria-label="filter-X" className='w-full text-start' variant={'ghost'}>{<X />}</Button>
                      </DropdownMenuItem>
                    </>
                  )}

                </DropdownMenuGroup>

              </DropdownMenuContent>

            </DropdownMenu>
          </div>
          <div className="text-right">Sinal (dbm)</div>
          <div className="text-right">Última queda</div>
        </div>

        {/* Lista virtualizada */}
        <div ref={parentRef} className="overflow-auto flex-1 h-[700px] relative noscroll">
          <div
            style={{
              height: `${rowVirtualized.getTotalSize()}px`,
              position: 'relative',
              width: '100%',
            }}
          >
            {rowVirtualized.getVirtualItems().map((virtualItem) => {
              const onu = filteredOnulistSearch![virtualItem.index];
              return (
                <div
                  aria-label="row"
                  key={virtualItem.key}
                  className="grid grid-cols-[0.1fr_2fr_1.5fr_1fr_80px_3fr]  items-center px-4 py-3 border-b text-sm absolute w-full bg-tablerow transition-all  duration-35  hover:bg-accent/20  ease-in"
                  style={{
                    top: 0,
                    left: 0,
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`
                  }}
                >
                  <div className="w-[100px] font-medium text-textrow">{onu.id}</div>
                  <div className="text-textrow">{onu.name}</div>
                  <div className="text-textrow text-start">{onu.serialNumber}</div>
                  <div className="flex justify-center">
                    <StateComponent state={onu.phaseState!} />
                  </div>
                  <div className="flex gap-2 items-center justify-between text-textrow">
                    {onu.signal ? (
                      <>
                        <Signal className={signalColor(onu.signal)} size={16} />
                        <span>{onu.signal}</span>
                      </>
                    ) : (
                      <p className="w-full text-end ">N/A</p>
                    )}
                  </div>
                  <div className="flex justify-end gap-2 items-center text-textrow">
                    {onu.lastDown && onu.lastDown !== "N/A" ? (
                      <span>
                        {abaInfo?.request?.olt?.model !== "HW"
                          ? onu.lastDown.split(" ").length > 2
                            ? onu.lastDown.split(" ").slice(2).join(" ")
                            : onu.lastDown
                          : onu.lastDown}
                      </span>
                    ) : (
                      <span>N/A</span>
                    )}
                    <DropdownMenu >
                      <DropdownMenuTrigger asChild>
                        <Button aria-label={`dropdown-onu-${onu.id}`} variant="ghost" size="icon">
                          <EllipsisVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <Portal>

                        <DropdownMenuContent className='w-20 border rounded-sm bg-popover text-popover-foreground z-[100] data-[state=open]:animate-in data-[state=open]:fade-in-40 data-[state=open]:slide-in-from-top-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-40 data-[state=closed]:slide-out-to-top-2 '>
                          <DropdownMenuGroup>
                            <DropdownMenuItem onSelect={()=>{setOnuDetailTarget(onu);setmodalDetails(true)}}>
                              <Button className='w-full text-start' variant={'ghost'}>Detalhes</Button>
                            </DropdownMenuItem>
                          </DropdownMenuGroup>

                        </DropdownMenuContent>
                      </Portal>

                    </DropdownMenu>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground p-2">
          Resultados encontrados: {filteredOnulistSearch?.length}
        </p>
      </div>
    </>

  );
});

export default OnusTable;
