import { useState } from "react"
import { useNavigate } from "react-router"
import Hero from "./Hero"
import { useAddEvent } from "../hooks/events"
import { useUser } from "../hooks/users"

// Type for Cloudinary widget
declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        options: {
          cloudName: string
          uploadPreset: string
          [key: string]: string | number | boolean | object
        },
        callback: (error: Error | null, result: { event: string; info: { secure_url: string } }) => void
      ) => { open: () => void }
    }
  }
}

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

const defaultFormState: FormState = {
  name: '',
  description: '',
  venue: '',
  address: '',
  date: '',
  time: '',
  artists: '',
  image_url: '',
  ticket_link: '',
  genre: 'rock',
  featured: false,
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

function AddEvent() {
  const [formData, setFormData] = useState<FormState>(defaultFormState)
  const addEvent = useAddEvent()
  const { data: currentUser } = useUser()
  const navigate = useNavigate()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    const newEvent = {
      ...formData,
      venue_name: formData.venue,
      start_time: formData.time,
      created_by: currentUser?.auth0Id || '1', 
    }

    // Remove the temporary form state fields that don't match the model
    const { venue, time, ...eventData } = newEvent
    
    try {
      await addEvent.mutateAsync(eventData)
      navigate('/')
    } catch (err) {
      console.error('Failed to add event:', err)
    }
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target
    const finalValue = type === 'checkbox' ? (event.target as HTMLInputElement).checked : value
    
    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }))
  }


  const handleReset = () => {
    setFormData(defaultFormState)
  }

  const handleUpload = () => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset || cloudName === 'YOUR_CLOUD_NAME') {
      console.warn('Cloudinary cloud name or upload preset is not configured.')
      return
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          setFormData((prev) => ({
            ...prev,
            image_url: result.info.secure_url,
          }))
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

  return (
    <>
      <Hero />
      <section className="p-6 md:p-12 pt-0 flex bg-[#0a0a0a] min-h-screen">
        <div className="w-full">
          <h2 className="text-5xl md:text-7xl font-black my-8 md:my-12 tracking-tighter uppercase leading-none text-white border-l-8 border-purple-600 pl-6 md:pl-8">Add Event</h2>

          <form
            data-testid="form"
            onSubmit={handleSubmit}
            onReset={handleReset}
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
                      onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-700 transition shadow-lg z-10"
                      title="Remove image"
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
                  {formData.image_url ? 'Change Image' : 'Upload Image'}
                </button>
              </div>
              <p className="text-[10px] text-gray-600 uppercase tracking-wider font-bold">Images are securely stored on Cloudinary</p>
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
                disabled={addEvent.isPending}
                className="bg-purple-600 text-white font-black text-xs uppercase tracking-[0.2em] px-6 md:px-10 py-4 rounded-xl hover:bg-purple-500 transition cursor-pointer shadow-lg shadow-purple-900/20 active:scale-95 disabled:bg-gray-800 disabled:text-gray-500 flex-1 sm:flex-none"
              >
                {addEvent.isPending ? 'Submitting...' : 'Submit Event'}
              </button>

              <button
                type="reset"
                className="border border-white/10 text-gray-400 px-6 md:px-10 py-4 rounded-xl hover:bg-white/5 transition font-black text-xs uppercase tracking-[0.2em] active:scale-95 flex-1 sm:flex-none"
              >
                Reset
              </button>
            </div>
            {addEvent.isError && (
              <p className="text-red-500 text-xs font-bold uppercase tracking-wider">Error adding event: {addEvent.error.message}</p>
            )}
          </form>
        </div>
      </section>
    </>
  )
}

export default AddEvent
