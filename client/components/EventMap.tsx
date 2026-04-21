import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const purpleIcon = L.divIcon({
  html: `
    <div class="relative">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-purple-600 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
        <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
      </svg>
      <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-1 bg-black/20 blur-[1px] rounded-full"></div>
    </div>
  `,
  className: 'custom-div-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

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
        console.error('Geocoding error:', err)
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

  return (
    <div className="h-[300px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl isolate">
      <MapContainer 
        center={coords} 
        zoom={15} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%', background: '#1a1a1a' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={coords} icon={purpleIcon}>
          <Popup>
            <div className="text-gray-900 font-sans">
              <strong className="block text-purple-700">{venueName}</strong>
              {address && <span className="text-xs">{address}</span>}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export default EventMap
