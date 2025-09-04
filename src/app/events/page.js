import Header from "../../components/Header.jsx"
import Footer from "../../components/Footer.jsx"
import EventCard from "../../components/event-card.jsx"
// import { getAllEvents } from "@/services/eventService"

export default async function EventsListPage() {
  let events = []

  return (
    <main className="min-h-dvh flex flex-col bg-white">
      <Header />
      <section className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg md:text-xl font-medium text-gray-900">All Events</h1>
            <a
              href="/events/create"
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              Create event
            </a>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {(events || []).length ? (
              events.map((evt) => <EventCard key={evt.id} event={evt} />)
            ) : (
              <p className="text-sm text-gray-600">No events to show.</p>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
