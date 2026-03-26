import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './index.css'
import PageLoader from './components/PageLoader'

const App = lazy(() => import('./App'))

let router = createBrowserRouter([
  {
    path: "/",
    element: (
    <Suspense fallback={<PageLoader />}>
      <App />
    </Suspense>
    
  ),
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

