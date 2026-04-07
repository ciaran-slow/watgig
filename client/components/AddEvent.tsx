import { useState } from "react"
import { useNavigate } from "react-router"
import Hero from "./Hero"
import { useAddEvent } from "../hooks/events"

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
  const commonClasses = "border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="font-semibold">
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
  const commonClasses = "border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="font-semibold">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={commonClasses}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  )
}

function FormCheckbox({ label, name, checked, onChange }: FormFieldProps) {
  return (
    <div className="flex items-center gap-3 py-2 cursor-pointer">
      <div className="relative flex items-center">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          className="peer h-6 w-6 cursor-pointer appearance-none rounded-md border-2 border-gray-300 transition-all checked:border-purple-500 checked:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <svg
          className="pointer-events-none absolute left-1 top-1 h-4 w-4 fill-white opacity-0 transition-opacity peer-checked:opacity-100"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
        </svg>
      </div>
      <label htmlFor={name} className="font-semibold cursor-pointer select-none">
        {label}
      </label>
    </div>
  )
}

function AddEvent() {
  const [formData, setFormData] = useState<FormState>(defaultFormState)
  const addEvent = useAddEvent()
  const navigate = useNavigate()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    const newEvent = {
      ...formData,
      venue_name: formData.venue,
      start_time: formData.time,
      created_by: '1', // Temporary placeholder as per instructions to ignore user
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
      <section className="p-12 pt-0 flex">
        <div className="w-full">
          <h2 className="text-5xl font-bold my-6">Add Event</h2>

          <form
            data-testid="form"
            onSubmit={handleSubmit}
            onReset={handleReset}
            className="flex flex-col gap-6 bg-white p-8 rounded-xl shadow-md border"
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
              <label className="font-semibold">Event Image</label>
              <div className="flex flex-col gap-4">
                {formData.image_url ? (
                  <div className="relative w-full h-64 rounded-xl overflow-hidden border-4 border-purple-800 shadow-md">
                    <img 
                      src={formData.image_url} 
                      alt="Event Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-700 transition shadow-lg"
                      title="Remove image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-64 border-4 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 bg-gray-50">
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-semibold text-sm">No Image Uploaded</span>
                    </div>
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={handleUpload}
                  className="bg-purple-800 text-white px-6 py-2 rounded-lg hover:bg-purple-500 transition focus:outline-none focus:ring-4 focus:ring-purple-500 w-fit font-semibold"
                >
                  {formData.image_url ? 'Change Image' : 'Upload Image'}
                </button>
              </div>
              <p className="text-xs text-gray-500 italic">Images are securely stored on Cloudinary</p>
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

            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={addEvent.isPending}
                className="bg-black text-white font-semibold px-6 py-2 rounded-lg hover:bg-purple-500 transition cursor-pointer disabled:bg-gray-400"
              >
                {addEvent.isPending ? 'Submitting...' : 'Submit'}
              </button>

              <button
                type="reset"
                className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Reset
              </button>
            </div>
            {addEvent.isError && (
              <p className="text-red-500">Error adding event: {addEvent.error.message}</p>
            )}
          </form>
        </div>
      </section>
    </>
  )
}

export default AddEvent