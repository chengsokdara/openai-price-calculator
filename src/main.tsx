import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from 'src/App'

const root = document.getElementById('root') as HTMLElement
ReactDOM.createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
)
