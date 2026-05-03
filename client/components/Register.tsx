import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

// import { useAuth0 } from '@auth0/auth0-react'
import { useUser } from '../hooks/users'
import { IfAuthenticated } from './Authenticated'

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
  name: string // Changed from username to name
  role: string
  profile_image: string
  bio: string
  genre: string
  members: string
  address: string
}

const defaultFormState: FormState = {
  name: '', // Changed from username to name
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
  placeholder?: string
  maxLength?: number
  required?: boolean
}

function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  rows,
  options,
  placeholder,
  maxLength,
  required,
}: FormFieldProps) {
  const commonClasses =
    'border border-white/10 rounded-lg px-4 py-3 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 placeholder:text-gray-600'

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="font-black text-xs uppercase tracking-widest text-gray-500 ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          rows={rows || 4}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          className={`${commonClasses} resize-none`}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`${commonClasses} appearance-none cursor-pointer`}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value} className="bg-[#1a1a1a] text-white">
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
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          className={commonClasses}
        />
      )}
    </div>
  )
}

function Register() {
  const user = useUser()
  const [formData, setFormData] = useState<FormState>(defaultFormState)
  const [nameAvailable, setNameAvailable] = useState<boolean | null>(null)
  const [nameSuggestions, setNameSuggestions] = useState<string[]>([])
  const [isCheckingName, setIsCheckingName] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (user.data) navigate('/')
  }, [user.data, navigate])

  // Debounce name check
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (formData.name.trim().length > 0) {
        setIsCheckingName(true)
        try {
          const result = await user.checkName(formData.name)
          if (result) {
            setNameAvailable(result.available)
            setNameSuggestions(result.suggestions || [])
          }
        } catch (error) {
          console.error('Error checking name:', error)
        } finally {
          setIsCheckingName(false)
        }
      } else {
        setNameAvailable(null)
        setNameSuggestions([])
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [formData.name])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (nameAvailable === false) return
    // Call the addUser mutation, passing the form data.
    // The email is handled in the useUser hook.
    user.add.mutate(formData) 
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

  const handleSuggestionClick = (suggestion: string) => {
    setFormData(prev => ({ ...prev, name: suggestion }))
  }

  const handleReset = () => {
    setFormData(defaultFormState)
    setNameAvailable(null)
    setNameSuggestions([])
  }

  const getNamePlaceholder = () => {
    switch (formData.role) {
      case 'band':
        return 'Enter your band name'
      case 'venue':
        return 'Enter your venue name'
      default:
        return 'Enter your full name'
    }
  }

  const getBioPlaceholder = () => {
    switch (formData.role) {
      case 'band':
        return 'Tell us about your band, your music, and your journey...'
      case 'venue':
        return 'Tell us about your venue, the kind of events you host...'
      default:
        return 'Tell us about yourself, your musical interests, etc.'
    }
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
          <section className="p-6 md:p-12 pt-28 md:pt-44 flex bg-[#0a0a0a] min-h-screen">
            <div className="w-full">
              <h2 className="text-5xl md:text-7xl font-black mt-4 mb-8 md:mb-12 tracking-tighter uppercase leading-none text-white border-l-8 border-purple-600 pl-6 md:pl-8">Create Profile</h2>

              <form
                data-testid="form"
                onSubmit={handleSubmit}
                onReset={handleReset}
                className="flex flex-col gap-8 bg-white/[0.02] p-6 md:p-10 rounded-3xl shadow-2xl border border-white/5 backdrop-blur-sm"
              >
                <div className="flex flex-col gap-1">
                  <FormField
                    label="Name" // Changed label from Username to Name
                    name="name" // Changed name attribute from username to name
                    value={formData.name} // Changed value from formData.username to formData.name
                    onChange={handleChange}
                    placeholder={getNamePlaceholder()}
                    required
                  />
                  {isCheckingName && (
                    <span className="text-xs text-blue-500 italic">Checking availability...</span>
                  )}
                  {nameAvailable === true && formData.name.trim() !== '' && (
                    <span className="text-xs text-green-600 font-semibold">✓ Name is available</span>
                  )}
                  {nameAvailable === false && (
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-red-500 font-semibold">✗ This name is already taken</span>
                      {nameSuggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2 items-center">
                          <span className="text-xs text-gray-600 italic">Try:</span>
                          {nameSuggestions.map((suggestion) => (
                            <button
                              key={suggestion}
                              type="button"
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition font-semibold"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <FormField
                  label="Role"
                  name="role"
                  type="select"
                  value={formData.role}
                  options={roleOptions}
                  onChange={handleChange}
                  required
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
                      required
                    />

                    <FormField
                      label="Members"
                      name="members"
                      type="text"
                      value={formData.members}
                      onChange={handleChange}
                      placeholder="e.g. John Doe, Jane Smith, Alex Jones"
                      required
                    />
                  </>
                )}

                {formData.role === 'venue' && (
                  <FormField
                    label="Address"
                    name="address"
                    type="textarea"
                    rows={2}
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Music St, Sound Town"
                    required
                  />
                )}

                <div className="flex flex-col gap-2">
                  <label className="font-black text-xs uppercase tracking-widest text-gray-500 ml-1">
                    Profile Image <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col gap-4">
                    {formData.profile_image ? (
                      <div className="relative w-40 h-40">
                        <img 
                          src={formData.profile_image} 
                          alt="Profile Preview" 
                          className="w-full h-full rounded-2xl object-cover border-4 border-purple-500 shadow-xl"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, profile_image: '' }))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-700 transition shadow-lg z-10"
                          title="Remove image"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="w-40 h-40 border-4 border-dashed border-white/10 rounded-2xl flex items-center justify-center text-gray-600 bg-white/[0.02]">
                        <div className="flex flex-col items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-[10px] font-black uppercase tracking-widest">No Image</span>
                        </div>
                      </div>
                    )}
                    
                    <button
                      type="button"
                      onClick={handleUpload}
                      className="bg-purple-600 text-white px-8 py-3 rounded-xl hover:bg-purple-500 transition shadow-lg shadow-purple-900/20 w-fit font-black text-xs uppercase tracking-widest active:scale-95"
                    >
                      {formData.profile_image ? 'Change Image' : 'Upload Image'}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-600 uppercase tracking-wider font-bold">Images are securely stored on Cloudinary</p>
                </div>

                <div className="flex flex-col gap-1">
                  <FormField
                    label="Bio"
                    name="bio"
                    type="textarea"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder={getBioPlaceholder()}
                    maxLength={200}
                    required
                  />
                  <div className="flex justify-end">
                    <span className={`text-xs ${formData.bio.length >= 200 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                      {formData.bio.length} / 200 characters
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5">
                  <input
                    type="submit"
                    data-testid="submit"
                    value="Submit Profile"
                    className="bg-purple-600 text-white font-black text-xs uppercase tracking-[0.2em] px-6 md:px-10 py-4 rounded-xl hover:bg-purple-500 transition cursor-pointer shadow-lg shadow-purple-900/20 active:scale-95 flex-1 sm:flex-none"
                  />

                  <button
                    type="reset"
                    data-testid="reset"
                    className="border border-white/10 text-gray-400 px-6 md:px-10 py-4 rounded-xl hover:bg-white/5 transition font-black text-xs uppercase tracking-[0.2em] active:scale-95 flex-1 sm:flex-none"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </section>
        </IfAuthenticated>
      </div>
    </div>
  )
}

export default Register
