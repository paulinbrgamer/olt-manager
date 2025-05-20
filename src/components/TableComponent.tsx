import { EllipsisVertical, Signal } from "lucide-react";
import { Button } from "./ui/button";
import type { OnuInfo } from "@/interfaces/onu-interface";
import React, { useRef } from "react";
import { useVirtualizer } from '@tanstack/react-virtual';

interface Props {
  onuList: OnuInfo[];
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

const TableComponent: React.FC<Props> = React.memo(({ onuList }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualized = useVirtualizer({
    count: onuList.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 55,
  });

  return (
    <div className="h-full flex flex-col border rounded-md overflow-hidden">
      {/* Cabeçalho */}
      <div className="grid grid-cols-[0.5fr_2fr_2fr_1fr_80px_3fr] text-sm font-semibold bg-primary-background text-primary px-4 py-3 border-b transition-all  duration-35 hover:bg-muted  ease-in">
        <div className="w-[100px]">ID</div>
        <div>Nome</div>
        <div>Serial</div>
        <div className="text-center">Status</div>
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
                key={virtualItem.key}
                className="grid grid-cols-[0.5fr_2fr_2fr_1fr_80px_3fr] items-center px-4 py-3 border-b text-sm absolute w-full bg-background transition-all  duration-35  hover:bg-muted/30  ease-in"
                style={{
                  top: 0,
                  left: 0,
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`
                }}
              >
                <div className="w-[100px] font-medium text-foreground">{onu.id}</div>
                <div className="text-foreground">{onu.name}</div>
                <div className="text-foreground">{onu.serialNumber}</div>
                <div className="flex justify-center">
                  <StateComponent state={onu.phaseState!} />
                </div>
                <div className="flex gap-2 items-center justify-between text-foreground">
                  {onu.signal ? (
                    <>
                      <Signal className={signalColor(onu.signal)} size={16} />
                      <span>{onu.signal}</span>
                    </>
                  ) : (
                    <p>N/A</p>
                  )}
                </div>
                <div className="flex justify-end gap-2 items-center text-foreground">
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
