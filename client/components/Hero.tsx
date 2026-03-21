import herobg from '../public/hero.jpg'

function Hero() {
  return (
    <div 
      className="h-[500px] flex justify-center items-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${herobg})`,
        backgroundSize: "cover",
        backgroundPosition: 'center'
      }}
    >
      <div className='flex flex-col items-center'>
        <h1 className='text-white font-bold text-8xl'>WatGig</h1>
        <p  className='text-white text-4xl mt-2'>Find your next gig!</p>
      </div>
    </div>
  )
}

export default Hero