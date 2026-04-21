function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white p-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-bold text-xs uppercase tracking-[0.2em] text-gray-500">
          &copy; {new Date().getFullYear()} Ciaran Slow. All rights reserved.
        </p>
        <div className="flex gap-8">
          <a 
            href="https://github.com/ciaranslow" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="font-black text-xs uppercase tracking-[0.3em] text-gray-400 hover:text-purple-400 transition-colors"
          >
            GitHub
          </a>
          <a 
            href="https://linkedin.com/in/ciaranslow" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="font-black text-xs uppercase tracking-[0.3em] text-gray-400 hover:text-purple-400 transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer