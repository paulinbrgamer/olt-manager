 import { Toaster } from 'sonner'; 
import { Github, SquareTerminal, TriangleAlert } from "lucide-react"
import { ModeToggle } from "./components/mode-toggle"
import TabBar from "./components/TabBar"
import { ThemeProvider } from "./context/theme-provider"
import { Button } from "./components/ui/button"
import {  useState } from "react"
import OltManager from "./OltManager"
import Incidents from "./Incidents"
import AbasProvider from './context/olt-abas-provider';
type tabSelect = "OLTs" | "Incidentes"

function App() {
  const [tabSelected, settabSelected] = useState<tabSelect>("OLTs")

  
  const handleClickTab = (tab: tabSelect) => {
    settabSelected(tab)
  }
  //função que retorna o elemento a ser renderizado pela tab
  const renderScreen = () => {
    switch (tabSelected) {
      case "Incidentes":
        return <Incidents />
      case "OLTs":
        return <OltManager />
    }
  }
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <AbasProvider>

      {/*Container geral da aplicação, guarda a barra de navegação e o conteudo renderizado */}
      <div className="flex h-screen w-full ">
        {/*Barra lateral  */}
        <TabBar className={"w-[60px]"}>
          {/*Bottoes da tab */}
          <Button className={`${tabSelected == "OLTs" && "bg-accent"} w-10 h-8`} onClick={() => handleClickTab("OLTs")} variant="ghost">
            <SquareTerminal className={`!w-5 !h-5 ${tabSelected === "OLTs" ? "text-sky-400" : "text-foreground"}`} />
          </Button>
          <Button className={`${tabSelected == "Incidentes" && "bg-accent"} w-10 h-8`} onClick={() => handleClickTab("Incidentes")} variant="ghost">
            <TriangleAlert className={`!w-5 !h-5 ${tabSelected === "Incidentes" ? "text-sky-400" : "text-foreground"}`}/>
          </Button>
          
          <ModeToggle />
            <a className="p-2 mt-auto" href="https://github.com/paulinbrgamer">
            <Github size={16}/>
            </a>
        </TabBar>
        {/*Função que retorna qual component deve ser renderizado*/}
        {renderScreen()}
      </div>
      <Toaster  />
      </AbasProvider>
    </ThemeProvider>

  )
}

export default App
