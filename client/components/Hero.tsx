import herobg from '../public/hero.webp'
import logo from '../public/logo.webp'

function Hero() {
  return (
    <div 
      className="h-[500px] flex justify-center items-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.9)), url(${herobg})`,
        backgroundSize: "cover",
        backgroundPosition: 'center'
      }}
    >
      <div className='flex flex-col items-center'>
        <img src={logo} alt="WatGig Logo" className="h-60"/>
        <h1 className='text-white font-bold text-8xl'>WatGig</h1>
        <h2  className='text-white text-4xl mt-2'>Find your next gig!</h2>
        <h3  className='text-white text-2xl font-thin mt-2'>Whatever the genre</h3>
      </div>
    </div>
  )
}

export default Hero