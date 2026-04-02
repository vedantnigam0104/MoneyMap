import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// ✅ ADD THIS IMPORT
import { RoleProvider } from './context/RoleContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* ✅ WRAP APP WITH PROVIDER */}
    <RoleProvider>
      <App />
    </RoleProvider>
  </StrictMode>,
)