import { useEffect, useState } from 'react'
import herobg from '../public/hero.webp'
import { optimisedImage } from '../utils/image'
import logo from '../public/logo.webp'

interface Props {
  title?: string
  subtitle?: string
  tag?: string
  image?: string
  slides?: string[]
}

const SLIDE_MS = 6000

function Hero({ title = "WatGig", subtitle = "Find your next gig!", tag = "Whatever the genre", image, slides }: Props) {
  const images = slides && slides.length > 0 ? slides : [image ?? herobg]
  const [active, setActive] = useState(0)

  // Cross-fade through the images; skip the motion if the user prefers reduced motion
  useEffect(() => {
    setActive(0)
    if (images.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => setActive((i) => (i + 1) % images.length), SLIDE_MS)
    return () => clearInterval(timer)
  }, [images.length, images[0]])

  return (
    <div className="h-[480px] md:h-[700px] flex justify-center items-center relative overflow-hidden w-full bg-[#0a0a0a]">
      {images.map((src, i) => (
        <div
          key={src}
          aria-hidden="true"
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-long ease-smooth ${
            i === active ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${optimisedImage(src, 1600) ?? src})` }}
        />
      ))}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundImage: 'linear-gradient(to bottom, #0a0a0a 0%, rgba(0,0,0,0.6) 15%, rgba(0,0,0,0.6) 85%, #0a0a0a 100%)' }}
      />
      <div className='flex flex-col items-center relative z-10 text-center px-4 pt-14 md:pt-16'>
        {title === "WatGig" && <img src={logo} alt="WatGig Logo" className="hidden md:block md:h-60 mb-2 transition-all"/>}
        <h1 className='text-white font-black text-4xl sm:text-6xl md:text-8xl tracking-tighter uppercase leading-[1.05] max-w-5xl break-words'>
          {title}
        </h1>
        {subtitle && (
          <h2 className='text-white font-bold text-lg sm:text-xl md:text-4xl mt-4 tracking-tight max-w-2xl'>
            {subtitle}
          </h2>
        )}
        {tag && (
          <h3 className='text-purple-400 text-[11px] md:text-sm font-black uppercase tracking-[0.3em] mt-4 md:mt-6 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/10'>
            {tag}
          </h3>
        )}
      </div>
    </div>
  )
}

export default Hero