import { useState } from "react"
import Hero from "./Hero"

const defaultFormState = {
  name: '',
  description: '',
  venue: '',
  date: '',
  time: '',
}

function AddEvent() {
  const [formData, setFormData] = useState(defaultFormState)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  return (
    <>
        <Hero/>
        <section className="p-12 pt-0 flex">
      <div className="w-full">
        <h2 className="text-5xl font-bold my-6">Add Event</h2>

        <form
          data-testid="form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 bg-white p-8 rounded-xl shadow-md border"
        >
          {/* Event Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-semibold">
              Event Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="font-semibold">
              Event Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Venue */}
          <div className="flex flex-col gap-2">
            <label htmlFor="venue" className="font-semibold">
              Event Venue
            </label>
            <input
              type="text"
              id="venue"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Date */}
          <div className="flex flex-col gap-2">
            <label htmlFor="date" className="font-semibold">
              Event Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Time */}
          <div className="flex flex-col gap-2">
            <label htmlFor="time" className="font-semibold">
              Event Start Time
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Artists */}
          <div className="flex flex-col gap-2">
            <label htmlFor="artists" className="font-semibold">
              Artists
            </label>
            <textarea
              id="artists"
              name="artists"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <input
              type="submit"
              data-testid="submit"
              value="Submit"
              className="bg-purple-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-purple-600 transition cursor-pointer"
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