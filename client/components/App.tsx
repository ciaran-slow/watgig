import { Outlet } from 'react-router'
import Nav from './Nav.tsx'
import Footer from './Footer.tsx'

function App() {
  return (
    <>
      <Nav/>
      <Outlet/>
      <Footer/>
    </>
  )
}

export default App
