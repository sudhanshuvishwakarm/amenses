"use client"

import { Check, X } from "lucide-react"
import { useState } from "react"

export default function NotificationList({ items = [] }) {
  const [open, setOpen] = useState(false)
  const [localItems, setLocalItems] = useState(items)

  async function onRespond(id, accept) {
    try {
      setLocalItems((prev) => prev.filter((i) => i.id !== id))
    } catch (e) {
      // handle error UI if needed
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
      >
        Invitations ({localItems.length})
      </button>
      {open ? (
        <div className="absolute right-0 z-10 mt-2 w-80 rounded-md border border-gray-200 bg-white p-2 shadow">
          {localItems.length ? (
            <ul className="space-y-2">
              {localItems.map((inv) => (
                <li key={inv.id} className="rounded border border-gray-200 p-2">
                  <p className="text-sm font-medium text-gray-900">{inv.title}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onRespond(inv.id, true)}
                      className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700"
                    >
                      <Check className="h-3 w-3" /> Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => onRespond(inv.id, false)}
                      className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-900 hover:bg-gray-50"
                    >
                      <X className="h-3 w-3" /> Decline
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-2 py-1 text-sm text-gray-600">No pending invitations.</p>
          )}
        </div>
      ) : null}
    </div>
  )
}
