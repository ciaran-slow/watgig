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
  return (
    <LocationProvider>
      <div className="min-h-screen flex flex-col">
        <ScrollToTop />
        <Nav/>
        <div className="flex-1">
          <Outlet/>
        </div>
        <Footer/>
      </div>
    </LocationProvider>
  )
}

export default App
