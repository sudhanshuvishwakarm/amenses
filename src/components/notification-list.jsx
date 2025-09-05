// components/notification-list.jsx
"use client"

import { useState } from "react"
import { Bell } from "lucide-react"

export default function NotificationList({ items }) {
  const [isOpen, setIsOpen] = useState(false)

  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900"
      >
        <Bell className="h-5 w-5" />
        {items.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {items.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-md bg-white shadow-lg border border-gray-200 z-10">
          <div className="p-3 border-b border-gray-200">
            <h3 className="text-sm font-medium">Pending Invitations</h3>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {items.map((event) => (
              <div key={event._id} className="p-3 border-b border-gray-100 last:border-b-0">
                <p className="text-sm font-medium text-gray-900">{event.title}</p>
                <p className="text-xs text-gray-600 mt-1">
                  From: {event.creator?.username || event.creator?.email || 'Unknown'}
                </p>
                <a 
                  href={`/events/${event._id}`}
                  className="mt-2 inline-block text-xs text-blue-600 hover:text-blue-800"
                >
                  Respond to invitation
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
