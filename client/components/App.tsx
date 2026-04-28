import { Outlet } from 'react-router'
import Nav from './Nav.tsx'
import Footer from './Footer.tsx'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav/>
      <div className="flex-1">
        <Outlet/>
      </div>
      <Footer/>
    </div>
  )
}

export default App
