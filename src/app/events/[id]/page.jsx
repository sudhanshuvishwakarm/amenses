"use client"

import Header from "../../../components/Header.jsx"
import Footer from "../../../components/Footer.jsx"
import Poll from "../../../components/poll.jsx"
import { getEventById } from "@/services/eventService"
import { Pencil, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

export default function EventDetailPage({ params }) {
  const { id } = params || {}
  const [event, setEvent] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getEventById(id)
        setEvent(data)
      } catch {
        setEvent(null)
      }
    }
    if (id) load()
  }, [id])

  const isCreator = !!event?.isCreator // backend should set this per current user

  return (
    <main className="min-h-dvh flex flex-col bg-white">
      <Header />
      <section className="flex-1">
        <div className="mx-auto w-full max-w-3xl px-4 py-6">
          <h1 className="text-lg md:text-xl font-medium text-gray-900">Event</h1>

          {event ? (
            <div className="mt-4 space-y-6">
              <div className="rounded-lg border border-gray-200 p-4">
                <h2 className="text-base md:text-lg font-medium text-gray-900">{event.title}</h2>
                <p className="mt-1 text-sm text-gray-600">{event.description}</p>
                <div className="mt-3">
                  <h3 className="text-sm font-medium text-gray-900">Date options</h3>
                  <ul className="mt-2 space-y-1">
                    {(event.dateOptions || []).map((d, idx) => (
                      <li key={idx} className="text-sm text-gray-700">
                        {d.date} {d.time ? `• ${d.time}` : ""}
                      </li>
                    ))}
                  </ul>
                </div>

                {isCreator ? (
                  <div className="mt-4 flex items-center gap-2">
                    <a
                      href={`/events/${event.id}/edit`}
                      className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 transition"
                    >
                      <Pencil className="h-4 w-4" /> Edit
                    </a>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                      // onClick={...} // Wire to your backend
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                ) : null}
              </div>

              <Poll eventId={event.id} />
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-600">Event not found or failed to load.</p>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
