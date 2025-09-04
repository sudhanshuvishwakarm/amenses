// Lists events, re-usable for "owner" and "invited"
import EventCard from "./event-card"

export default function EventList({ events = [], context = "owner" }) {
  if (!events.length) {
    return <p className="mt-3 text-sm text-muted-foreground">No events to show.</p>
  }

  return (
    <ul className="mt-3 grid grid-cols-1 gap-3">
      {events.map((e) => (
        <li key={e.id}>
          <EventCard event={e} context={context} />
        </li>
      ))}
    </ul>
  )
}
