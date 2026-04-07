import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

// import { useAuth0 } from '@auth0/auth0-react'
import { useUser } from '../hooks/users'
import { IfAuthenticated, IfNotAuthenticated } from './Authenticated'

import Hero from './Hero'

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
  username: string
  role: string
  profile_image: string
  bio: string
  genre: string
  members: string
  address: string
}

const defaultFormState: FormState = {
  username: '',
  role: '',
  profile_image: '',
  bio: '',
  genre: 'rock',
  members: '',
  address: '',
}

interface FormFieldProps {
  label: string
  name: string
  type?: string
  value: string
  onChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
  rows?: number
  options?: { value: string; label: string }[]
}

function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  rows,
  options,
}: FormFieldProps) {
  const commonClasses =
    'border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500'

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
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={commonClasses}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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

function Register() {
  const user = useUser()
  const [formData, setFormData] = useState<FormState>(defaultFormState)
  const navigate = useNavigate()

  useEffect(() => {
    if (user.data) navigate('/')
  }, [user.data, navigate])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // We will eventually get the token from Auth0, but for now we'll just log
    console.log('Form submitted:', formData)
    // user.add.mutate({ newUser: formData, token: 'fake-token' }) 
  }

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
          console.log('Done! Here is the image info: ', result.info)
          setFormData((prev) => ({
            ...prev,
            profile_image: result.info.secure_url,
          }))
        }
      }
    )
    widget.open()
  }

  const roleOptions = [
    { value: '', label: 'Select role' },
    { value: 'user', label: 'User' },
    { value: 'band', label: 'Band' },
    { value: 'venue', label: 'Venue' },
  ]

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
    <div>
      <div>
        <IfAuthenticated>
          <Hero />

          <section className="p-12 pt-0 flex">
            <div className="w-full">
              <h2 className="text-5xl font-bold my-6">Create Profile</h2>

              <form
                data-testid="form"
                onSubmit={handleSubmit}
                onReset={handleReset}
                className="flex flex-col gap-6 bg-white p-8 rounded-xl shadow-md border"
              >
                <FormField
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />

                <FormField
                  label="Role"
                  name="role"
                  type="select"
                  value={formData.role}
                  options={roleOptions}
                  onChange={handleChange}
                />

                {formData.role === 'band' && (
                  <>
                    <FormField
                      label="Genre"
                      name="genre"
                      type="select"
                      value={formData.genre}
                      options={genreOptions}
                      onChange={handleChange}
                    />

                    <FormField
                      label="Members"
                      name="members"
                      type="text"
                      value={formData.members}
                      onChange={handleChange}
                    />
                  </>
                )}

                {formData.role === 'venue' && (
                  <FormField
                    label="Address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                  />
                )}

                <div className="flex flex-col gap-2">
                  <label className="font-semibold">Profile Image</label>
                  <div className="flex flex-col gap-4">
                    {formData.profile_image ? (
                      <div className="relative w-32 h-32">
                        <img 
                          src={formData.profile_image} 
                          alt="Profile Preview" 
                          className="w-full h-full rounded-xl object-cover border-4 border-purple-800 shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, profile_image: '' }))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-700 transition shadow-lg"
                          title="Remove image"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="w-32 h-32 border-4 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 bg-gray-50">
                        <div className="flex flex-col items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs font-semibold">No Image</span>
                        </div>
                      </div>
                    )}
                    
                    <button
                      type="button"
                      onClick={handleUpload}
                      className="bg-purple-800 text-white px-6 py-2 rounded-lg hover:bg-purple-500 transition focus:outline-none focus:ring-4 focus:ring-purple-500 w-fit font-semibold"
                    >
                      {formData.profile_image ? 'Change Image' : 'Upload Image'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 italic">Images are securely stored on Cloudinary</p>
                </div>

                <FormField
                  label="Bio"
                  name="bio"
                  type="textarea"
                  value={formData.bio}
                  onChange={handleChange}
                />

                <div className="flex gap-4 pt-2">
                  <input
                    type="submit"
                    data-testid="submit"
                    value="Submit"
                    className="bg-black text-white font-semibold px-6 py-2 rounded-lg hover:bg-purple-500 transition cursor-pointer focus:outline-none focus:ring-4 focus:ring-purple-500"
                  />

                  <button
                    type="reset"
                    data-testid="reset"
                    className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100 transition focus:outline-none focus:ring-4 focus:ring-purple-500"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </section>
        </IfAuthenticated>

        <IfNotAuthenticated>
          <h1>Please sign in</h1>
        </IfNotAuthenticated>
      </div>
    </div>
  )
}

export default Register