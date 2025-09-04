import Header from "../../components/Header.jsx"
import Footer from "../../components/Footer.jsx"
import EventCard from "../../components/event-card.jsx"
import NotificationList from "../../components/notification-list.jsx"
// import { getMyEvents, getInvitedEvents } from "@/services/eventService"


// Note: Server component fetching. Replace services to hit your backend.
export default async function DashboardPage() {
  let myEvents = []
  let invitedEvents = []
  try {
    myEvents = await getMyEvents()
    invitedEvents = await getInvitedEvents()
  } catch (e) {
    // Show empty state if backend not available yet
    myEvents = []
    invitedEvents = []
  }

  const pendingInvites = (invitedEvents || []).filter((e) => e?.inviteStatus === "pending")

  return (
    <main className="min-h-dvh flex flex-col bg-white">
      <Header pendingCount={pendingInvites.length} />
      <section className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg md:text-xl font-medium text-gray-900">Dashboard</h1>
            <NotificationList items={pendingInvites} />
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-base md:text-lg font-medium text-gray-900">My Events</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {(myEvents || []).length ? (
                  myEvents.map((evt) => <EventCard key={evt.id} event={evt} />)
                ) : (
                  <p className="text-sm text-gray-600">No events created yet.</p>
                )}
              </div>
            </div>
            <div>
              <h2 className="text-base md:text-lg font-medium text-gray-900">Invited Events</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {(invitedEvents || []).length ? (
                  invitedEvents.map((evt) => <EventCard key={evt.id} event={evt} />)
                ) : (
                  <p className="text-sm text-gray-600">No invitations yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
