"use client"

import Header from "../../../../components/Header"
import Footer from "../../../../components/Footer.jsx"
import Loading from "../../../../components/Loading.jsx"
import { Plus, Trash2, Users, Save, ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from "next/navigation"

export default function EditEventPage({ params }) {
  const router = useRouter()
  const [id, setId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  
  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dateOptions, setDateOptions] = useState([])
  const [participantQuery, setParticipantQuery] = useState("")
  const [participants, setParticipants] = useState([])
  const [pollQuestion, setPollQuestion] = useState("Choose a suitable date")

  // Extract id from params
  useEffect(() => {
    const extractId = async () => {
      try {
        const resolvedParams = await params
        setId(resolvedParams.id)
      } catch (err) {
        console.error("Failed to extract params:", err)
        setError("Invalid event ID")
        setLoading(false)
      }
    }

    extractId()
  }, [params])

  // Load event data
  useEffect(() => {
    async function loadEvent() {
      if (!id) return
      
      try {
        setLoading(true)
        const response = await axios.get(`/api/events/${id}`)
        
        if (response.data.success) {
          const event = response.data.data
          setTitle(event.title)
          setDescription(event.description)
          setPollQuestion(event.pollQuestion || "Choose a suitable date")
          
          // Format date options for editing
          const formattedDateOptions = event.dateOptions.map(option => ({
            id: option._id || Date.now() + Math.random(),
            date: new Date(option.date).toISOString().split('T')[0],
            time: new Date(option.date).toTimeString().slice(0, 5)
          }))
          setDateOptions(formattedDateOptions.length > 0 ? formattedDateOptions : [{ id: Date.now(), date: "", time: "" }])
          
          // Set participants (exclude the creator)
          const participantEmails = event.participants
            .filter(p => p.email !== event.creator?.email)
            .map(p => p.email)
          setParticipants(participantEmails)
        } else {
          throw new Error(response.data.error || "Failed to load event")
        }
      } catch (err) {
        console.error("Failed to fetch event:", err)
        setError("Event not found or failed to load.")
        toast.error("Failed to load event. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    
    if (id) loadEvent()
  }, [id])

  // Date option functions
  function addDateOption() {
    setDateOptions((prev) => [...prev, { id: Date.now() + Math.random(), date: "", time: "" }])
  }

  function removeDateOption(id) {
    if (dateOptions.length > 1) {
      setDateOptions((prev) => prev.filter((d) => d.id !== id))
    } else {
      toast.warning("At least one date option is required")
    }
  }

  function updateDateOption(id, key, value) {
    setDateOptions((prev) => prev.map((d) => (d.id === id ? { ...d, [key]: value } : d)))
  }

  // Participant functions
  function addParticipantFromQuery() {
    const email = participantQuery.trim().toLowerCase()
    if (!email) return
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address")
      return
    }
    
    if (participants.includes(email)) {
      toast.warning("Participant already added")
      return
    }
    
    setParticipants((prev) => [...prev, email])
    setParticipantQuery("")
  }

  function removeParticipant(email) {
    setParticipants((prev) => prev.filter((x) => x !== email))
  }

  // Form submission
  async function onSubmit(e) {
    e.preventDefault()
    
    // Validation
    if (!title.trim()) {
      toast.error("Title is required")
      return
    }
    
    if (!description.trim()) {
      toast.error("Description is required")
      return
    }
    
    const cleanDates = dateOptions
      .map((d) => ({ date: d.date.trim(), time: d.time.trim() }))
      .filter((d) => d.date && d.time)
      
    if (!cleanDates.length) {
      toast.error("At least one date option (date + time) is required")
      return
    }
    
    // Validate date format
    for (const dateOption of cleanDates) {
      const dateTime = new Date(`${dateOption.date}T${dateOption.time}`)
      if (isNaN(dateTime.getTime())) {
        toast.error("Invalid date or time format")
        return
      }
    }
    
    try {
      setSaving(true)
      
      // Format date options to combine date and time into ISO strings
      const formattedDateOptions = cleanDates.map(option => {
        const dateTime = new Date(`${option.date}T${option.time}`)
        return dateTime.toISOString()
      })

      const payload = {
        title: title.trim(),
        description: description.trim(),
        dateOptions: formattedDateOptions,
        participants: participants,
        pollQuestion: pollQuestion
      }

      const response = await axios.put(`/api/events/${id}`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.data.success) {
        toast.success("Event updated successfully!")
        router.push(`/events/${id}`)
      } else {
        throw new Error(response.data.error || "Failed to update event")
      }
    } catch (err) {
      console.error("Update event error:", err)
      toast.error(err.response?.data?.error || "Failed to update event. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-dvh flex flex-col bg-white">
        <Header />
        <Loading />
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-dvh flex flex-col bg-white">
      <Header />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <section className="flex-1">
        <div className="mx-auto w-full max-w-2xl px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>
            <h1 className="text-lg md:text-xl font-medium text-gray-900">Edit Event</h1>
          </div>

          {error ? (
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <a 
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Return to Dashboard
              </a>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Title *</label>
                <input
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Team offsite"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  aria-label="Title"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Description *</label>
                <textarea
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Describe your event..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  aria-label="Description"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Poll Question</label>
                <input
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Poll question for participants"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  aria-label="Poll Question"
                />
              </div>

              <div>
                <h2 className="text-base font-medium text-gray-900">Date options *</h2>
                <p className="text-sm text-gray-500 mt-1">Add at least one date and time option</p>
                <div className="mt-3 space-y-3">
                  {dateOptions.map((d) => (
                    <div key={d.id} className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                      <input
                        type="date"
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        value={d.date}
                        onChange={(e) => updateDateOption(d.id, "date", e.target.value)}
                        aria-label="Date"
                        required
                      />
                      <input
                        type="time"
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        value={d.time}
                        onChange={(e) => updateDateOption(d.id, "time", e.target.value)}
                        aria-label="Time"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeDateOption(d.id)}
                        className="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 transition"
                        aria-label="Remove date option"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addDateOption}
                  className="mt-3 inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
                >
                  <Plus className="h-4 w-4" />
                  Add date option
                </button>
              </div>

              <div>
                <h2 className="text-base font-medium text-gray-900">Participants</h2>
                <p className="text-sm text-gray-500 mt-1">Add participant email addresses</p>
                <div className="mt-3 flex items-stretch gap-2">
                  <input
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Type email and press Enter"
                    value={participantQuery}
                    onChange={(e) => setParticipantQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addParticipantFromQuery()
                      }
                    }}
                    aria-label="Participant email"
                    type="email"
                  />
                  <button
                    type="button"
                    onClick={addParticipantFromQuery}
                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 transition"
                  >
                    <Users className="h-4 w-4" />
                    Add
                  </button>
                </div>
                {participants.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {participants.map((email) => (
                      <span
                        key={email}
                        className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-900"
                      >
                        {email}
                        <button
                          type="button"
                          onClick={() => removeParticipant(email)}
                          className="text-gray-600 hover:text-gray-900"
                          aria-label={`Remove ${email}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}