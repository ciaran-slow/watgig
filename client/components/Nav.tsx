import { useNavigate } from "react-router"
import logo from '../public/logo.webp'

function Nav() {
  const navigate = useNavigate()

  const handleClick = (route : string) => {
    navigate(route)
  }
  return (
    <nav className="p-6  flex justify-between border-b-2">
      <div className="flex gap-2 items-center">
        <img src={logo} alt="WatGig Logo" className="h-14"/>
      <h2 
        className="text-3xl hover:text-purple-800 font-bold cursor-pointer"
        onClick={() => handleClick('/')}
      >WatGig</h2>
      </div>
      <div className="flex items-center gap-4">
        <button 
          className="font-bold px-4 py-2 bg-black hover:bg-purple-800 transition rounded-xl text-white"
          onClick={() => handleClick('/add-event')}
        >+ Event</button>
        <p className="hover:text-purple-500 transition cursor-pointer">Login/Sign Up</p>
      </div>
    </nav>
  )
}

export default Nav