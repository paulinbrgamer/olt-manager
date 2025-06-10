import { ModeToggle } from '@/components/mode-toggle'
import { Github, SquareTerminal, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SideBar from '@/components/SideBar'
import type { ReactNode } from 'react'
interface LayoutProps {
    children? : ReactNode,
    tabSelected: "Incidentes" | "OLTs",
    handleClickTab: (newScreen: "Incidentes" | "OLTs") => void

}

const AppLayout: React.FC<LayoutProps> = ({  tabSelected, handleClickTab,children }) => {
    return (
        <div className="flex h-screen w-full ">
            {/*Barra lateral  */}
            <SideBar className={"w-[60px]"}>
                {/*Bottoes da tab */}
                <Button aria-label='btn-Olt' className={`${tabSelected == "OLTs" && "bg-accent"} w-10 h-8`} onClick={() => handleClickTab("OLTs")} variant="ghost">
                    <SquareTerminal className={`!w-5 !h-5 ${tabSelected === "OLTs" ? "text-sky-400" : "text-foreground"}`} />
                </Button>
                <Button aria-label='btn-Incidents' className={`${tabSelected == "Incidentes" && "bg-accent"} w-10 h-8`} onClick={() => handleClickTab("Incidentes")} variant="ghost">
                    <TriangleAlert className={`!w-5 !h-5 ${tabSelected === "Incidentes" ? "text-sky-400" : "text-foreground"}`} />
                </Button>

                <ModeToggle />
                <a className="p-2 mt-auto" href="https://github.com/paulinbrgamer">
                    <Github size={16} />
                </a>
            </SideBar>
            {/*Função que retorna qual component deve ser renderizado*/}
            {children}

        </div>
    )
}

export default AppLayout