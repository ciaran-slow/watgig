import { useAuth0 } from "@auth0/auth0-react"
import { useNavigate } from "react-router"
import { useState } from "react"
import logo from '../public/logo.webp'
import { useUser } from "../hooks/users"

function Nav() {
  const navigate = useNavigate()
  const auth = useAuth0()
  const dbUser = useUser()
  const authUser = auth.user
  const logout = auth.logout
  const loginWithRedirect = auth.loginWithRedirect
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleClick = (route: string) => {
    navigate(route)
    setIsMenuOpen(false)
  }

  const handleSignOut = () => {
    logout()
    setIsMenuOpen(false)
  }

  const handleSignIn = () => {
    loginWithRedirect({
      authorizationParams: {
        redirectUri: `${window.location.origin}/register`,
      },
    })
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="p-6 flex justify-between items-center border-b border-white/5 bg-[#0a0a0a] relative z-50">
      <div className="flex gap-2 items-center">
        <img src={logo} alt="WatGig Logo" className="h-14" />
        <h2
          className="text-3xl md:text-4xl hover:text-purple-400 font-black tracking-tighter cursor-pointer uppercase text-white transition-colors"
          onClick={() => handleClick('/')}
        >
          WatGig
        </h2>
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center gap-6">
        {!authUser ? (
          <p
            className="font-bold text-sm uppercase tracking-widest text-gray-400 hover:text-purple-400 transition cursor-pointer"
            onClick={handleSignIn}
          >
            Login/Sign Up
          </p>
        ) : (
          <>
            <button
              className="font-black text-sm uppercase tracking-widest px-6 py-3 bg-purple-600 hover:bg-purple-500 transition rounded-full text-white focus:outline-none focus:ring-4 focus:ring-purple-500 shadow-lg active:scale-95"
              onClick={() => handleClick('/add-event')}
            >
              + Event
            </button>

            {dbUser.data && (
              <div 
                className="flex items-center gap-3 border-l pl-6 border-white/10 cursor-pointer group"
                onClick={() => handleClick(`/profile/${dbUser.data.id}`)}
              >
                <span className="font-bold text-sm uppercase tracking-wider text-gray-300 group-hover:text-purple-400 transition-colors">{dbUser.data.name}</span>
                <img 
                  src={dbUser.data.profile_image} 
                  alt={dbUser.data.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-500 shadow-sm group-hover:border-purple-400 transition-all group-hover:scale-105"
                />
              </div>
            )}

            <p
              className="font-bold text-sm uppercase tracking-widest text-gray-400 hover:text-purple-400 transition cursor-pointer"
              onClick={handleSignOut}
            >
              Logout
            </p>
          </>
        )}
      </div>

      {/* Hamburger Icon (Tablet/Mobile) */}
      <button
        onClick={toggleMenu}
        className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 focus:outline-none z-[60]"
        aria-label="Toggle Menu"
      >
        <span
          className={`h-0.5 w-8 bg-white transition-all duration-300 transform origin-center ${
            isMenuOpen ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`h-0.5 w-8 bg-white transition-all duration-300 ${
            isMenuOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`h-0.5 w-8 bg-white transition-all duration-300 transform origin-center ${
            isMenuOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {/* Fullscreen Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-[#0a0a0a] transition-all duration-500 ease-in-out z-50 flex flex-col items-center justify-center gap-8 ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {!authUser ? (
          <p
            className="text-2xl font-black uppercase tracking-[0.2em] text-white hover:text-purple-500 transition cursor-pointer"
            onClick={handleSignIn}
          >
            Login/Sign Up
          </p>
        ) : (
          <>
            {dbUser.data && (
              <div className="flex flex-col items-center gap-4 mb-4">
                <img
                  src={dbUser.data.profile_image}
                  alt={dbUser.data.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-purple-500 shadow-2xl"
                />
                <span className="text-xl font-black uppercase tracking-widest text-white">
                  {dbUser.data.name}
                </span>
              </div>
            )}
            
            <button
              className="text-2xl font-black uppercase tracking-[0.2em] text-white hover:text-purple-500 transition"
              onClick={() => handleClick('/')}
            >
              Home
            </button>

            <button
              className="text-2xl font-black uppercase tracking-[0.2em] text-purple-500 border-2 border-purple-500 px-8 py-4 rounded-full hover:bg-purple-500 hover:text-white transition shadow-lg shadow-purple-900/20"
              onClick={() => handleClick('/add-event')}
            >
              + Add Event
            </button>

            <button
              className="text-2xl font-black uppercase tracking-[0.2em] text-gray-400 hover:text-red-500 transition mt-8"
              onClick={handleSignOut}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Nav