import { EllipsisVertical, Filter, Signal, X } from "lucide-react";
import { Button } from "./ui/button";
import type { OnuInfo } from "@/interfaces/onu-interface";
import React, { useRef } from "react";
import { useVirtualizer } from '@tanstack/react-virtual';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useAbas } from "@/context/olt-abas-provider";
import { getAbaFromList } from "@/utils/getAbaFromList";
import type { abaInterface } from "@/interfaces/abas";
import type { stateOnu } from "@/interfaces/filter";
interface Props {
  onuList: OnuInfo[];
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
    DyingGasp: "bg-gray-200/10 text-gray-500",
    OffLine: "bg-red-200/10 text-red-500",
    LOS: "bg-red-200/10 text-red-500",
  };

  return (
    <div className={`flex w-fit gap-2 p-1 rounded-full text-sm font-medium ${stateStyles[state as keyof typeof stateStyles] || ""}`}>
      <p>{state}</p>
    </div>
  );
};

const TableComponent: React.FC<Props> = React.memo(({ onuList, abaInfoId, ariaLabel }) => {
  const { updateAba, abaslist } = useAbas()
  const abaInfo: abaInterface = getAbaFromList(abaInfoId!, abaslist)
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualized = useVirtualizer({
    count: onuList?.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 55,
  });
  const handleSelect = (newstate: stateOnu) => {
    updateAba({ ...abaInfo, filter: { ...abaInfo.filter, state: newstate } })
  }
  return (
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
              <Button aria-label="filter-btn" variant={'ghost'} size={'icon'} className="rounded-full h-5"><Filter size={16} /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-fit border rounded-md bg-background z-10 data-[state=open]:animate-in data-[state=open]:fade-in-40 data-[state=open]:slide-in-from-top-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-40 data-[state=closed]:slide-out-to-top-2 '>
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => handleSelect("working")} >
                  <Button aria-label="filter-working" className='w-full text-start' variant={'ghost'}>{<StateComponent state="working" />}</Button>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleSelect("LOS")} >
                  <Button aria-label="filter-LOS" className='w-full text-start' variant={'ghost'}>{<StateComponent state="LOS" />}</Button>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleSelect("DyingGasp")}  >
                  <Button aria-label="filter-DyingGasp" className='w-full text-start' variant={'ghost'}>{<StateComponent state="DyingGasp" />}</Button>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleSelect("OffLine")}  >
                  <Button aria-label="filter-OffLine" className='w-full text-start' variant={'ghost'}>{<StateComponent state="OffLine" />}</Button>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleSelect("")} >
                  <Button aria-label="filter-X" className='w-full text-start' variant={'ghost'}>{<X />}</Button>
                </DropdownMenuItem>
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
            const onu = onuList[virtualItem.index];
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
                  {onu.lastDown !== "N/A" ? (
                    <span>{onu.lastDown!.split(" ").slice(2).join(" ")}</span>
                  ) : (
                    <p>N/A</p>
                  )}
                  <Button variant="ghost" size="icon">
                    <EllipsisVertical />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <p className="text-center text-sm text-muted-foreground p-2">
        Resultados encontrados: {onuList?.length}
      </p>
    </div>
  );
});

export default TableComponent;
