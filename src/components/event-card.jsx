import { CalendarDays, Users } from "lucide-react"

export default function EventCard({ event }) {
  const people = event?.participants?.length || 0
  const firstOption = event?.dateOptions?.[0]
  const dateLabel = firstOption ? `${firstOption.date}${firstOption.time ? ` • ${firstOption.time}` : ""}` : "TBD"

  return (
    <a
      href={`/events/${event?.id ?? ""}`}
      className="block rounded-lg border border-gray-200 p-4 hover:shadow-sm transition"
    >
      <h3 className="text-base font-medium text-gray-900">{event?.title || "Untitled"}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-gray-600">{event?.description || "No description."}</p>
      <div className="mt-3 flex items-center gap-4 text-sm text-gray-700">
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="h-4 w-4" />
          {dateLabel}
        </span>
        <span className="inline-flex items-center gap-1">
          <Users className="h-4 w-4" />
          {people} invited
        </span>
      </div>
    </a>
  )
}
