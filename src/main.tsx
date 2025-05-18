import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import AbasProvider from './context/olt-abas-provider.tsx'

createRoot(document.getElementById('root')!).render(
    <AbasProvider>
    <App />
    </AbasProvider>

)
