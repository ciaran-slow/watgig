import herobg from '../public/hero.webp'
import logo from '../public/logo.webp'

interface Props {
  title?: string
  subtitle?: string
  tag?: string
  image?: string
}

function Hero({ title = "WatGig", subtitle = "Find your next gig!", tag = "Whatever the genre", image }: Props) {
  const backgroundImage = image ? `url(${image})` : `url(${herobg})`
  
  return (
    <div 
      className="h-[350px] md:h-[500px] flex justify-center items-center relative overflow-hidden w-full transition-all duration-500"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.9)), ${backgroundImage}`,
        backgroundSize: "cover",
        backgroundPosition: 'center'
      }}
    >
      <div className='flex flex-col items-center relative z-10 text-center px-4'>
        {title === "WatGig" && <img src={logo} alt="WatGig Logo" className="h-40 md:h-60 mb-2 transition-all"/>}
        <h1 className='text-white font-black text-4xl sm:text-6xl md:text-8xl tracking-tighter uppercase leading-none max-w-5xl'>
          {title}
        </h1>
        {subtitle && (
          <h2 className='text-white font-bold text-lg sm:text-xl md:text-4xl mt-4 tracking-tight max-w-2xl'>
            {subtitle}
          </h2>
        )}
        {tag && (
          <h3 className='text-purple-400 text-[10px] md:text-sm font-black uppercase tracking-[0.3em] mt-6 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/10'>
            {tag}
          </h3>
        )}
      </div>
    </div>
  )
}

export default Hero