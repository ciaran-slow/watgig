function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white py-12 md:py-20 border-t border-white/5 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex flex-col items-center md:items-start gap-4">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">WatGig</h2>
          <p className="font-bold text-xs uppercase tracking-[0.3em] text-gray-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} WatGig. All rights reserved.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-6">
          <span className="font-black text-xs uppercase tracking-[0.4em] text-purple-500">Connect With Us</span>
          <div className="flex gap-6">
            <a 
              href="https://www.facebook.com/profile.php?id=61583645578816" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-purple-600 hover:border-purple-600 transition-all active:scale-90 group"
              aria-label="Follow us on Facebook"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-2.21c0-.837.398-1.391 1.127-1.391h2.873v-4.127c-.497-.067-2.204-.213-4.191-.213-4.148 0-6.992 2.532-6.992 7.182v2.759z"/>
              </svg>
            </a>
            <a 
              href="https://instagram.com/watgignz" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-purple-600 hover:border-purple-600 transition-all active:scale-90 group"
              aria-label="Follow us on Instagram"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer