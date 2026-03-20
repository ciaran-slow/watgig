function Nav() {
  return (
    <nav className="p-6  flex justify-between border-b-2">
      <h2 className="text-2xl font-bold">WatGig</h2>
      <div className="flex items-center gap-4">
        <button className="font-bold px-4 py-2 bg-purple-500 rounded-xl text-white">+ Event</button>
        <p className="hover:text-purple-500 transition cursor-pointer">Login/Sign Up</p>
      </div>
    </nav>
  )
}

export default Nav