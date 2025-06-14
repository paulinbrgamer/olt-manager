import { EllipsisVertical, Filter, Signal, Wifi, X } from "lucide-react";
import { Button } from "./ui/button";
import type { OnuInfo, OnuInfoHw } from "@/interfaces/onu-interface";
import React, { useEffect, useRef, useState } from "react";
import { useVirtualizer } from '@tanstack/react-virtual';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger, Portal } from "@radix-ui/react-dropdown-menu";
import useAbas from "@/context/useAbas";
import { getAbaFromList } from "@/utils/getAbaFromList";
import type { abaInterface } from "@/interfaces/abas";
import type { stateOnu } from "@/interfaces/filter";
import { filterBySearch } from "@/utils/filterBySearch";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, Overlay } from "@radix-ui/react-dialog";
import OnuDetailsTable from "./OnuDetailsDialog";
import LoaderButton from "./LoaderButton";
import { Badge } from "./ui/badge";
import { DialogFooter, DialogHeader } from "./ui/dialog";
import { useLazyFetch } from "../utils/useLazyFetch";
import { toast } from "sonner";
import OnuDetailsDialog from "./OnuDetailsDialog";
interface Props {
  currentAbaInfo: string | undefined,
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

const OnusTable: React.FC = React.memo(() => {
  const [modalDetails, setmodalDetails] = useState(false)
  const [onuDetailTarget, setOnuDetailTarget] = useState<OnuInfo | OnuInfoHw | null>(null)
  const { updateAba, abaslist, currentAbaInfo } = useAbas()
  const abaInfo: abaInterface = getAbaFromList(currentAbaInfo!, abaslist)!
  const stateFilter = filterBySearch(abaInfo.OnuList, abaInfo.filter.state, ['phaseState']) //variavel com as onusFiltradas por state
  const parentRef = useRef<HTMLDivElement>(null);
  const [filteredOnulistSearch, setFilteredOnulistSearch] = useState<OnuInfo[]>([])//state para guardar as onus filtradas
  const [modalOntEnable, setmodalOntEnable] = useState(false)
  const [ontEnableInfo, setontEnableInfo] = useState<OnuInfo | null>(null)
  const { loading, fetchData, data, error } = useLazyFetch()
  const rowVirtualized = useVirtualizer({
    count: filteredOnulistSearch!.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 55,
  });

  const handleSelectFilter = (newstate: stateOnu) => {
    updateAba({ ...abaInfo, filter: { ...abaInfo.filter, state: newstate } })
  }
  const handleEnableOnt = () => {
    if (!ontEnableInfo) {
      toast("Ont Não selecionada")
    } else {
      const { slot, pon, serialNumber, name, id } = ontEnableInfo


      fetchData('http://localhost:3031/hw/enable_ont', {
        method: 'POST',
        body: { olt: { ...abaInfo.request?.olt }, slot, pon, serialNumber, name, id }
      })
    }
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
  useEffect(() => {
    if (data) {
      //@ts-ignore
      toast("Liberação de ONT finalizada", { description: data.message });
      setmodalOntEnable(false)
    }

  }, [data])
  useEffect(() => {
    if (error) {
      toast("Erro inesperado", { description: error });

      setmodalOntEnable(false)
    }
  }, [error])

  return (
    <>
      <Dialog open={modalOntEnable} onOpenChange={setmodalOntEnable}>
        <Overlay className="fixed inset-0 bg-black/50 backdrop-blur-xx z-50" />
        <DialogContent className="z-50  absolute bg-sidebar border self-center mt-[10%] mr-[15%] max-w[380px]  px-5 pb-5 pt-5 rounded-md flex flex-col data-[state=open]:animate-in data-[state=open]:fade-in-40 data-[state=open]:slide-in-from-bottom-2
                          data-[state=closed]:animate-out data-[state=closed]:fade-out-40 data-[state=closed]:slide-out-to-bottom-2">
          <div className='flex flex-row justify-between items-start  gap-4'>
            <DialogTitle className="text-xl font-bold text-start text-primary">Ativar ONT</DialogTitle>
            <Button className='self-start w-8 ' size={'icon'} variant={'ghost'} onClick={() => setmodalOntEnable(false)}><X size={10} /></Button>
          </div>
          <DialogDescription className="text-sm text-muted-foreground  text-start ">
            Ative o acesso remoto a ONTs Huawei
          </DialogDescription>
          <Badge className="m-auto mt-4" variant="default">{ontEnableInfo?.name}</Badge>
          <LoaderButton onClick={handleEnableOnt} isLoading={loading} className='mt-4' variant='outline' text='Ativar' />
          <DialogFooter className="text-xs mt-4">Somente para ONTs*</DialogFooter>
        </DialogContent>
      </Dialog>
      {onuDetailTarget && modalDetails && (
        <OnuDetailsDialog data={onuDetailTarget} open={modalDetails} onOpenChange={setmodalDetails} />

      )}
      <div className="h-full flex flex-col border rounded-md overflow-hidden" aria-label={'table-Onus'}>
        {/* Cabeçalho */}
        <div className="bg-secondary grid grid-cols-[0.1fr_2fr_1.5fr_1fr_80px_3fr] text-sm font-medium text-textrow px-4 py-3 border-b transition-all  duration-35 hover:bg-secondary/60  ease-in">
          <div className="w-[100px]">ID</div>
          <div>Nome</div>
          <div className="text-start">Serial</div>
          <div className="text-center flex  items-start gap-1 justify-center">
            <p>Status</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-label="filter-btn" variant={'ghost'} size={'icon'} className={`rounded-full h-5 ${abaInfo.filter.state != "" ? 'bg-accent' : ''}`}><Filter size={16} /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-fit mt-3 border rounded-md bg-background z-10 data-[state=open]:animate-in data-[state=open]:fade-in-40 data-[state=open]:slide-in-from-top-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-40 data-[state=closed]:slide-out-to-top-2 '>
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

                        <DropdownMenuContent className='w-fit p-1 border rounded-sm bg-card text-card-foreground z-[100] data-[state=open]:animate-in data-[state=open]:fade-in-40 data-[state=open]:slide-in-from-top-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-40 data-[state=closed]:slide-out-to-top-2 '>
                          <DropdownMenuGroup>
                            <DropdownMenuItem className="dropdown-item" onSelect={() => { setOnuDetailTarget(onu); setmodalDetails(true) }}>
                              Detalhes
                            </DropdownMenuItem>
                            {abaInfo.request?.olt.model == 'HW' && onu.type == "EG8145V5" && (
                              <DropdownMenuItem className="dropdown-item" onClick={() => { setmodalOntEnable(true); setontEnableInfo(onu) }}>
                                Ativar ONT
                              </DropdownMenuItem>

                            )}
                          </DropdownMenuGroup>

                        </DropdownMenuContent>
                      </Portal>

                    </DropdownMenu>

                  </div>
                </div>
              );
            })}
            {filteredOnulistSearch.length ===0 && <p className="text-center p-5 text-sm opacity-55 ">Sem resultados...</p>}
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
