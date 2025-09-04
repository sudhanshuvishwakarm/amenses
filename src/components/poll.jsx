"use client"

import { useEffect, useState } from "react"
import { RefreshCw, BarChart2 } from "lucide-react"
import { getPoll, vote as votePoll } from "@/services/pollService"

export default function Poll({ eventId }) {
  const [loading, setLoading] = useState(false)
  const [poll, setPoll] = useState(null)
  const [selected, setSelected] = useState(null)
  const [message, setMessage] = useState("")

  async function load() {
    setLoading(true)
    setMessage("")
    try {
      const data = await getPoll(eventId)
      setPoll(data || null)
    } catch (e) {
      setMessage(e?.message || "Failed to load poll.")
    } finally {
      setLoading(false)
    }
  }

  async function onVote() {
    if (!selected) {
      setMessage("Please select an option to vote.")
      return
    }
    setLoading(true)
    setMessage("")
    try {
      await votePoll(eventId, selected)
      await load()
      setMessage("Vote recorded.")
    } catch (e) {
      setMessage(e?.message || "Failed to vote.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [eventId])

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base md:text-lg font-medium text-gray-900">Poll</h2>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 transition"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {message ? <p className="mt-3 text-sm text-gray-700">{message}</p> : null}

      {!poll ? (
        <p className="mt-3 text-sm text-gray-600">{loading ? "Loading..." : "No poll available."}</p>
      ) : (
        <>
          <div className="mt-4 space-y-2">
            {(poll.options || []).map((opt) => (
              <label key={opt.id} className="flex items-center gap-3 rounded-md border border-gray-200 p-3">
                <input
                  type="radio"
                  name="poll"
                  value={opt.id}
                  checked={selected === opt.id}
                  onChange={() => setSelected(opt.id)}
                  className="h-4 w-4"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                  <p className="text-xs text-gray-600">Votes: {opt.votes ?? 0}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={onVote}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
              disabled={loading}
            >
              Vote
            </button>
            <div className="ml-auto inline-flex items-center gap-2 text-sm text-gray-700">
              <BarChart2 className="h-4 w-4" />
              <span>Total votes: {poll.totalVotes ?? 0}</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
