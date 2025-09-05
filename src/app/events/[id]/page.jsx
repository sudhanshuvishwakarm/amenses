"use client"

import Header from "../../../components/Header.jsx"
import Footer from "../../../components/Footer.jsx"
import Poll from "../../../components/poll.jsx"
import Loading from "../../../components/Loading.jsx"
import { Pencil, Trash2, Calendar, Users, Clock, User } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

export default function EventDetailPage({ params }) {
  const [id, setId] = useState(null)
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  useEffect(() => {
    async function loadEvent() {
      if (!id) return
      
      try {
        setLoading(true)
        const response = await axios.get(`/api/events/${id}`)
        
        if (response.data.success) {
          setEvent(response.data.data)
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

  const handleDeleteEvent = async () => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return
    }

    try {
      const response = await axios.delete(`/api/events/${id}`)
      
      if (response.data.success) {
        toast.success("Event deleted successfully!")
        window.location.href = "/dashboard"
      } else {
        throw new Error(response.data.error || "Failed to delete event")
      }
    } catch (err) {
      console.error("Failed to delete event:", err)
      toast.error("Failed to delete event. Please try again.")
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
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
        <div className="mx-auto w-full max-w-4xl px-4 py-6">
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
          ) : event ? (
            <div className="space-y-6">
              {/* Event Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{event.title}</h1>
                  <p className="text-gray-600 mt-1">Created by {event.creator?.username || event.creator?.email}</p>
                </div>
                
                {event.isCreator && (
                  <div className="flex items-center gap-2">
                    <a
                      href={`/events/${event._id}/edit`}
                      className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                      <Pencil className="h-4 w-4" /> Edit Event
                    </a>
                    <button
                      onClick={handleDeleteEvent}
                      className="inline-flex items-center gap-2 rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Event Details Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                    <p className="text-gray-600">{event.description}</p>
                  </div>

                  {/* Poll Question */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Poll Question</h3>
                    <p className="text-gray-600">{event.pollQuestion}</p>
                  </div>

                  {/* Participants */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Users className="h-4 w-4" /> Participants
                    </h3>
                    <div className="space-y-1">
                      {event.participants?.map((participant, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {participant.email}
                            {participant.status && (
                              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                participant.status === 'accepted' 
                                  ? 'bg-green-100 text-green-800'
                                  : participant.status === 'declined'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {participant.status}
                              </span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Date Options */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> Proposed Dates
                    </h3>
                    <div className="space-y-2">
                      {event.dateOptions?.map((option, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>
                              {formatDate(option.date)} at {formatTime(option.date)}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {option.voters?.length || 0} votes
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Poll Component */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Vote on Dates</h2>
                <Poll eventId={event._id} dateOptions={event.dateOptions} />
              </div>
            </div>
          ) : null}
        </div>
      </section>
      <Footer />
    </main>
  )
}