import { Toaster } from 'sonner';
import { Github, SquareTerminal, TriangleAlert } from "lucide-react"
import { ModeToggle } from "./components/mode-toggle"
import SideBar from "./components/SideBar"
import { ThemeProvider } from "./context/theme-provider"
import { Button } from "./components/ui/button"
import { useState } from "react"
import OltManager from "./pages/OltManager"
import Incidents from "./pages/Incidents"
import AppLayout from './layout/AppLayout';
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
      {/*Container geral da aplicação, guarda a barra de navegação e o conteudo renderizado */}
      <AppLayout tabSelected={tabSelected} handleClickTab={handleClickTab}>
        {renderScreen()}
      </AppLayout>
      <Toaster />

    </ThemeProvider>


  )
}

export default App
