import { Outlet, useLocation } from 'react-router'
import Nav from './Nav.tsx'
import Footer from './Footer.tsx'
import { useEffect } from 'react'
import { LocationProvider } from './LocationContext.tsx'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  const { pathname } = useLocation()
  return (
    <LocationProvider>
      <div className="min-h-screen flex flex-col">
        <ScrollToTop />
        <Nav/>
        {/* Keyed by path so each page eases in on navigation */}
        <div key={pathname} className="flex-1 animate-fade-in">
          <Outlet/>
        </div>
        <Footer/>
      </div>
    </LocationProvider>
  )
}

export default App
