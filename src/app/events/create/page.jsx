"use client"

import Header from "../../../components/Header.jsx"
import Footer from "../../../components/Footer.jsx"
import { Plus, Trash2, Users } from "lucide-react"
import { useState } from "react"
// import { createEvent } from "@/services/eventService"

export default function CreateEventPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dateOptions, setDateOptions] = useState([{ id: Date.now(), date: "", time: "" }])
  const [participantQuery, setParticipantQuery] = useState("")
  const [participants, setParticipants] = useState([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  function addDateOption() {
    setDateOptions((prev) => [...prev, { id: Date.now() + Math.random(), date: "", time: "" }])
  }

  function removeDateOption(id) {
    setDateOptions((prev) => prev.filter((d) => d.id !== id))
  }

  function updateDateOption(id, key, value) {
    setDateOptions((prev) => prev.map((d) => (d.id === id ? { ...d, [key]: value } : d)))
  }

  function addParticipantFromQuery() {
    const value = participantQuery.trim()
    if (!value) return
    if (participants.includes(value)) return
    setParticipants((prev) => [...prev, value])
    setParticipantQuery("")
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError("")
    setSuccess("")
    if (!title.trim()) {
      setError("Title is required.")
      return
    }
    const cleanDates = dateOptions
      .map((d) => ({ date: d.date.trim(), time: d.time.trim() }))
      .filter((d) => d.date && d.time)
    if (!cleanDates.length) {
      setError("At least one date option (date + time) is required.")
      return
    }
    try {
      await createEvent({
        title: title.trim(),
        description: description.trim(),
        dateOptions: cleanDates,
        participants,
      })
      setSuccess("Event created successfully.")
      setTitle("")
      setDescription("")
      setDateOptions([{ id: Date.now(), date: "", time: "" }])
      setParticipants([])
    } catch (err) {
      setError(err?.message || "Failed to create event.")
    }
  }

  return (
    <main className="min-h-dvh flex flex-col bg-white">
      <Header />
      <section className="flex-1">
        <div className="mx-auto w-full max-w-2xl px-4 py-6">
          <h1 className="text-lg md:text-xl font-medium text-gray-900">Create Event</h1>
          <form onSubmit={onSubmit} className="mt-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Title</label>
              <input
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Team offsite"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                aria-label="Title"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Description</label>
              <textarea
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Describe your event..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                aria-label="Description"
              />
            </div>

            <div>
              <h2 className="text-base font-medium text-gray-900">Date options</h2>
              <div className="mt-3 space-y-3">
                {dateOptions.map((d) => (
                  <div key={d.id} className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                    <input
                      type="date"
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={d.date}
                      onChange={(e) => updateDateOption(d.id, "date", e.target.value)}
                      aria-label="Date"
                    />
                    <input
                      type="time"
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={d.time}
                      onChange={(e) => updateDateOption(d.id, "time", e.target.value)}
                      aria-label="Time"
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
              {participants.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {participants.map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-900"
                    >
                      {p}
                      <button
                        type="button"
                        onClick={() => setParticipants((prev) => prev.filter((x) => x !== p))}
                        className="text-gray-600 hover:text-gray-900"
                        aria-label={`Remove ${p}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {success ? <p className="text-sm text-green-600">{success}</p> : null}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                Create event
              </button>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  )
}
