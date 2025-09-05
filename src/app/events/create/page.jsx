"use client"

import Header from "../../../components/Header.jsx"
import Footer from "../../../components/Footer.jsx"
import Loading from "../../../components/Loading.jsx"
import axios from "axios"
import { toast } from "react-toastify"
import { Plus, Trash2, Users } from "lucide-react"
import { useState } from "react"
import 'react-toastify/dist/ReactToastify.css'

export default function CreateEventPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dateOptions, setDateOptions] = useState([{ id: Date.now(), date: "", time: "" }])
  const [participantQuery, setParticipantQuery] = useState("")
  const [participants, setParticipants] = useState([])
  const [pollQuestion, setPollQuestion] = useState("Choose a suitable date")
  const [isLoading, setIsLoading] = useState(false)

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

  async function createEvent(eventData) {
    setIsLoading(true)
    try {
      // Format date options to combine date and time into ISO strings
      const formattedDateOptions = eventData.dateOptions.map(option => {
        // Ensure proper date format for backend
        const dateTime = new Date(`${option.date}T${option.time}`);
        return dateTime.toISOString();
      })

      const payload = {
        title: eventData.title,
        description: eventData.description,
        dateOptions: formattedDateOptions,
        participants: eventData.participants,
        pollQuestion: pollQuestion
      }

      const response = await axios.post('/api/events', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.data.success) {
        toast.success("Event created successfully!")
        // Reset form
        setTitle("")
        setDescription("")
        setDateOptions([{ id: Date.now(), date: "", time: "" }])
        setParticipants([])
        setPollQuestion("Choose a suitable date")
      } else {
        throw new Error(response.data.error || "Failed to create event")
      }
    } catch (error) {
      console.error("Create event error:", error)
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error)
      } else if (error.response?.data?.details) {
        throw new Error(error.response.data.details)
      } else {
        throw new Error("Failed to create event. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

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
      const dateTime = new Date(`${dateOption.date}T${dateOption.time}`);
      if (isNaN(dateTime.getTime())) {
        toast.error("Invalid date or time format");
        return;
      }
    }
    
    try {
      await createEvent({
        title: title.trim(),
        description: description.trim(),
        dateOptions: cleanDates,
        participants,
      })
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <main className="min-h-dvh flex flex-col bg-white">
      <Header />
      {isLoading && <Loading />}
      <section className="flex-1">
        <div className="mx-auto w-full max-w-2xl px-4 py-6">
          <h1 className="text-lg md:text-xl font-medium text-gray-900">Create Event</h1>
          <form onSubmit={onSubmit} className="mt-6 space-y-6">
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
                        onClick={() => setParticipants((prev) => prev.filter((x) => x !== email))}
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

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating..." : "Create event"}
              </button>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  )
}