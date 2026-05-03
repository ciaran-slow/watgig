import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { useEvent, useUpdateEvent } from "../hooks/events"
import { useUser } from "../hooks/users"

interface FormState {
  name: string
  description: string
  venue: string
  address: string
  date: string
  time: string
  artists: string
  image_url: string
  ticket_link: string
  genre: string
  featured: boolean
}

interface FormFieldProps {
  label: string
  name: string
  type?: string
  value?: string
  checked?: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  rows?: number
}

function FormField({ label, name, type = 'text', value, onChange, rows }: FormFieldProps) {
  const commonClasses = "border border-white/10 rounded-lg px-4 py-3 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 w-full placeholder:text-gray-600"

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="font-black text-xs uppercase tracking-widest text-gray-500 ml-1">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          rows={rows || 4}
          value={value}
          onChange={onChange}
          className={`${commonClasses} resize-none`}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={commonClasses}
          style={{ colorScheme: 'dark' }}
        />
      )}
    </div>
  )
}

function FormSelect({ label, name, value, onChange, options }: FormFieldProps & { options: { value: string, label: string }[] }) {
  const commonClasses = "border border-white/10 rounded-lg px-4 py-3 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 w-full"

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="font-black text-xs uppercase tracking-widest text-gray-500 ml-1">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`${commonClasses} appearance-none cursor-pointer`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value} className="bg-[#1a1a1a] text-white">{option.label}</option>
        ))}
      </select>
    </div>
  )
}

function FormCheckbox({ label, name, checked, onChange }: FormFieldProps) {
  return (
    <div className="flex items-center gap-3 py-2 cursor-pointer group">
      <div className="relative flex items-center">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          className="peer h-6 w-6 cursor-pointer appearance-none rounded-md border-2 border-white/10 bg-white/5 transition-all checked:border-purple-500 checked:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <svg
          className="pointer-events-none absolute left-1 top-1 h-4 w-4 fill-white opacity-0 transition-opacity peer-checked:opacity-100"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
        </svg>
      </div>
      <label htmlFor={name} className="font-black text-xs uppercase tracking-widest text-gray-400 cursor-pointer select-none group-hover:text-white transition-colors">
        {label}
      </label>
    </div>
  )
}

function EditEvent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: event, isLoading, isError } = useEvent(Number(id))
  const updateEvent = useUpdateEvent()
  const { data: currentUser } = useUser()

  const [formData, setFormData] = useState<FormState | null>(null)

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name || '',
        description: event.description || '',
        venue: event.venue_name || '',
        address: event.address || '',
        date: event.date || '',
        time: event.start_time || '',
        artists: event.artists || '',
        image_url: event.image_url || '',
        ticket_link: event.ticket_link || '',
        genre: event.genre || 'rock',
        featured: !!event.featured,
      })
    }
  }, [event])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formData || !id) return
    
    const updatedEvent = {
      ...formData,
      venue_name: formData.venue,
      start_time: formData.time,
    }

    // @ts-ignore
    const { venue, time, ...cleanUpdatedEvent } = updatedEvent
    
    try {
      await updateEvent.mutateAsync({ id: Number(id), updatedEvent: cleanUpdatedEvent })
      navigate(`/event/${id}`)
    } catch (err) {
      console.error('Failed to update event:', err)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    
    setFormData((prev) => prev ? ({
      ...prev,
      [name]: finalValue,
    }) : null)
  }

  const handleUpload = () => {
    // @ts-ignore
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      },
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          setFormData((prev) => prev ? ({
            ...prev,
            image_url: result.info.secure_url,
          }) : null)
        }
      }
    )
    widget.open()
  }

  const genreOptions = [
    { value: 'rock', label: 'Rock / Indie' },
    { value: 'pop', label: 'Pop' },
    { value: 'electronic', label: 'Electronic / DJ' },
    { value: 'hiphop', label: 'Hip-Hop / Rap' },
    { value: 'acoustic', label: 'Acoustic' },
    { value: 'jazz', label: 'Jazz / Blues' },
    { value: 'metal', label: 'Metal / Punk' },
    { value: 'other', label: 'Other' },
  ]

  if (isLoading) return <div className="p-12 text-center text-white">Loading event...</div>
  if (isError || !event) return <div className="p-12 text-center text-red-500">Event not found.</div>
  if (!formData) return null

  // Security check: Only owner can edit (comparing integer database IDs)
  const isOwner = currentUser?.id === event.created_by
  if (!isLoading && currentUser && !isOwner) {
    return (
      <div className="p-24 text-center bg-[#0a0a0a] min-h-screen">
        <h2 className="text-7xl font-black text-white uppercase tracking-tighter mb-4">Unauthorized</h2>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">You do not have permission to edit this event.</p>
        <button onClick={() => navigate(-1)} className="mt-8 text-purple-400 font-black text-xs uppercase tracking-widest hover:text-purple-300 transition-colors">Go Back</button>
      </div>
    )
  }

  return (
    <>
      <section className="p-6 md:p-12 pt-28 md:pt-44 flex bg-[#0a0a0a] min-h-screen">
        <div className="w-full">
          <h2 className="text-5xl md:text-7xl font-black mt-4 mb-8 md:mb-12 tracking-tighter uppercase leading-none text-white border-l-8 border-purple-600 pl-6 md:pl-8">Edit Event</h2>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-8 bg-white/[0.02] p-6 md:p-10 rounded-3xl shadow-2xl border border-white/5 backdrop-blur-sm"
          >
            <FormField 
              label="Event Name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
            />

            <FormSelect
              label="Genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              options={genreOptions}
            />

            <FormField 
              label="Event Description" 
              name="description" 
              type="textarea" 
              value={formData.description} 
              onChange={handleChange} 
            />

            <FormField 
              label="Event Venue" 
              name="venue" 
              value={formData.venue} 
              onChange={handleChange} 
            />

            <FormField 
              label="Venue Address" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
            />

            <FormField 
              label="Event Date" 
              name="date" 
              type="date" 
              value={formData.date} 
              onChange={handleChange} 
            />

            <FormField 
              label="Event Start Time" 
              name="time" 
              type="time" 
              value={formData.time} 
              onChange={handleChange} 
            />

            <FormField 
              label="Artists" 
              name="artists" 
              type="textarea" 
              value={formData.artists} 
              onChange={handleChange} 
            />

            <div className="flex flex-col gap-4">
              <label className="font-black text-xs uppercase tracking-widest text-gray-500 ml-1">Event Image</label>
              <div className="flex flex-col gap-4">
                {formData.image_url ? (
                  <div className="relative w-full h-64 rounded-2xl overflow-hidden border-4 border-purple-500 shadow-xl">
                    <img 
                      src={formData.image_url} 
                      alt="Event Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => prev ? ({ ...prev, image_url: '' }) : null)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-700 transition shadow-lg z-10"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-64 border-4 border-dashed border-white/10 rounded-2xl flex items-center justify-center text-gray-600 bg-white/[0.02]">
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-black text-xs uppercase tracking-widest">No Image Uploaded</span>
                    </div>
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={handleUpload}
                  className="bg-purple-600 text-white px-8 py-3 rounded-xl hover:bg-purple-500 transition shadow-lg shadow-purple-900/20 w-fit font-black text-xs uppercase tracking-widest active:scale-95"
                >
                  Change Image
                </button>
              </div>
            </div>

            <FormField 
              label="Ticket Link" 
              name="ticket_link" 
              value={formData.ticket_link} 
              onChange={handleChange} 
            />

            <FormCheckbox
              label="Featured Event"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
            />

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5">
              <button
                type="submit"
                disabled={updateEvent.isPending}
                className="bg-purple-600 text-white font-black text-xs uppercase tracking-[0.2em] px-6 md:px-10 py-4 rounded-xl hover:bg-purple-500 transition cursor-pointer shadow-lg shadow-purple-900/20 active:scale-95 disabled:bg-gray-800 disabled:text-gray-500 flex-1 sm:flex-none"
              >
                {updateEvent.isPending ? 'Updating...' : 'Update Event'}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="border border-white/10 text-gray-400 px-6 md:px-10 py-4 rounded-xl hover:bg-white/5 transition font-black text-xs uppercase tracking-[0.2em] active:scale-95 flex-1 sm:flex-none text-center"
              >
                Cancel
              </button>
            </div>
            {updateEvent.isError && (
              <p className="text-red-500 text-xs font-bold uppercase tracking-wider">Error updating event: {updateEvent.error.message}</p>
            )}
          </form>
        </div>
      </section>
    </>
  )
}

export default EditEvent
