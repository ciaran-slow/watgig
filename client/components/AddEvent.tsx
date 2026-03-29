import { useState } from "react"
import Hero from "./Hero"

interface FormState {
  name: string
  description: string
  venue: string
  date: string
  time: string
  artists: string
}

const defaultFormState: FormState = {
  name: '',
  description: '',
  venue: '',
  date: '',
  time: '',
  artists: '',
}

interface FormFieldProps {
  label: string
  name: string
  type?: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  rows?: number
}

function FormField({ label, name, type = 'text', value, onChange, rows }: FormFieldProps) {
  const commonClasses = "border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"

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

function AddEvent() {
  const [formData, setFormData] = useState<FormState>(defaultFormState)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log('Form submitted:', formData)
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleReset = () => {
    setFormData(defaultFormState)
  }

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

            <div className="flex gap-4 pt-2">
              <input
                type="submit"
                data-testid="submit"
                value="Submit"
                className="bg-black text-white font-semibold px-6 py-2 rounded-lg hover:bg-purple-500 transition cursor-pointer"
              />

              <button
                type="reset"
                data-testid="reset"
                className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

export default AddEvent