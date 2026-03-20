function Footer() {
  return (
    <footer className="bg-white text-black p-6 border-t-2">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4">
        <p className="text-sm md:text-base">&copy; {new Date().getFullYear()} Ciaran Slow. All rights reserved.</p>
        <div className="flex gap-4">
          <a 
            href="https://github.com/ciaranslow" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-purple-500 transition-colors text-sm md:text-base"
          >
            GitHub
          </a>
          <a 
            href="https://linkedin.com/in/ciaranslow" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-purple-500 transition-colors text-sm md:text-base"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer