import { useState, useEffect, useRef } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

// OpenFreeMap: free vector tiles, no API key. Its "dark" style suits the app.
const MAP_STYLE = 'https://tiles.openfreemap.org/styles/dark'

const PIN_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="36" height="36" style="color:#9333ea;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5))">
    <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
  </svg>`

interface Props {
  venueName: string
  address?: string
  lat?: number
  lng?: number
}

function EventMap({ venueName, address, lat, lng }: Props) {
  const [coords, setCoords] = useState<[number, number] | null>(
    lat && lng ? [lat, lng] : null
  )
  const [loading, setLoading] = useState(!coords && !!address)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If we already have coords (from DB), don't geocode
    if (coords) return

    async function geocode() {
      if (!address) return
      
      setLoading(true)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            address
          )}&limit=1`
        )
        const data = await response.json()
        
        if (data && data.length > 0) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)])
        } else {
          setError('Location not found')
        }
      } catch (err) {
        setError('Failed to load map')
      } finally {
        setLoading(false)
      }
    }

    geocode()
  }, [address, coords])

  if (loading) {
    return (
      <div className="h-[300px] w-full rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center animate-pulse">
        <p className="text-gray-500 font-black text-xs uppercase tracking-widest">Locating Venue...</p>
      </div>
    )
  }

  if (error || !coords) {
    return (
      <div className="h-[300px] w-full rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
        <p className="text-gray-500 font-black text-xs uppercase tracking-widest">Map Unavailable</p>
      </div>
    )
  }

  return <MapView coords={coords} venueName={venueName} address={address} />
}

function MapView({
  coords,
  venueName,
  address,
}: {
  coords: [number, number]
  venueName: string
  address?: string
}) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!container.current) return
    const [lat, lng] = coords
    const map = new maplibregl.Map({
      container: container.current,
      style: MAP_STYLE,
      center: [lng, lat],
      zoom: 15,
      cooperativeGestures: true, // two-finger pan on touch, ctrl+scroll to zoom
    })
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')

    const pin = document.createElement('div')
    pin.innerHTML = PIN_SVG
    pin.style.cursor = 'pointer'

    const popupContent = document.createElement('div')
    const title = document.createElement('strong')
    title.textContent = venueName
    title.style.display = 'block'
    popupContent.appendChild(title)
    if (address) {
      const addr = document.createElement('span')
      addr.textContent = address
      addr.style.fontSize = '12px'
      popupContent.appendChild(addr)
    }

    new maplibregl.Marker({ element: pin, anchor: 'bottom' })
      .setLngLat([lng, lat])
      .setPopup(new maplibregl.Popup({ offset: 32, closeButton: false }).setDOMContent(popupContent))
      .addTo(map)

    return () => map.remove()
  }, [coords, venueName, address])

  return (
    <div className="h-[300px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl isolate bg-[#0c0c0c]">
      <div ref={container} className="h-full w-full" />
    </div>
  )
}

export default EventMap
