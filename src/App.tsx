import { SquareTerminal, TriangleAlert } from "lucide-react"
import { ModeToggle } from "./components/mode-toggle"
import TabBar from "./components/TabBar"
import { ThemeProvider } from "./context/theme-provider"
import { Button } from "./components/ui/button"
import { useState } from "react"
import OltManager from "./OltManager"
import Incidents from "./Incidents"
import { icons } from "./constants/colors"

type tabSelect = "OLTs" | "Incidentes"

function App() {
  const [tabSelected, settabSelected] = useState<tabSelect>("OLTs")

  const handleClickTab = (tab: tabSelect) => {
    settabSelected(tab)
  }
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
      {/*Container geral da aplicação, guarda a barra de navegação e o conteudo renderizado */}
      <div className="flex h-screen w-full ">
        {/*Barra lateral  */}
        <TabBar>
          {/*Bottoes da tab */}
          <Button className={`${tabSelected == "OLTs" && "bg-accent"} w-12 h-10`} onClick={() => handleClickTab("OLTs")} variant="ghost">
            <SquareTerminal className={`!w-6 !h-6 ${tabSelected === "OLTs" ? "text-sky-400" : "text-foreground"}`} />
          </Button>
          <Button className={`${tabSelected == "Incidentes" && "bg-accent"} w-12 h-10`} onClick={() => handleClickTab("Incidentes")} variant="ghost">
            <TriangleAlert className={`!w-6 !h-6 ${tabSelected === "Incidentes" ? "text-sky-400" : "text-foreground"}`}/>
          </Button>
          <ModeToggle />
        </TabBar>
        {/*Função que retorna qual component deve ser renderizado*/}
        {renderScreen()}
      </div>
    </ThemeProvider>

  )
}

export default App
