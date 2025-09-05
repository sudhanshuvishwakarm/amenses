"use client"

import { useEffect, useState } from "react"
import { RefreshCw, BarChart2, CheckCircle, XCircle } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"

// API functions with correct endpoints
async function getPoll(eventId) {
  try {
    console.log("Fetching poll for eventId:", eventId)
    const response = await axios.get(`/api/events/${eventId}/poll`)
    if (response.data.success) {
      return response.data.data
    } else {
      throw new Error(response.data.error || "Failed to fetch poll")
    }
  } catch (error) {
    console.error("Get poll error:", error)
    throw new Error(error.response?.data?.error || "Failed to load poll")
  }
}

async function votePoll(eventId, dateOptionId) {
  try {
    const response = await axios.post(`/api/events/${eventId}/vote`, {
      dateOptionId
    })
    
    if (response.data.success) {
      return response.data
    } else {
      throw new Error(response.data.error || "Failed to vote")
    }
  } catch (error) {
    console.error("Vote error:", error)
    throw new Error(error.response?.data?.error || "Failed to submit vote")
  }
}

async function getVotingStatus(eventId) {
  try {
    const response = await axios.get(`/api/events/${eventId}/vote`)
    if (response.data.success) {
      return response.data.data
    } else {
      throw new Error(response.data.error || "Failed to fetch voting status")
    }
  } catch (error) {
    console.error("Voting status error:", error)
    throw new Error(error.response?.data?.error || "Failed to load voting status")
  }
}

async function removeVote(eventId) {
  try {
    const response = await axios.delete(`/api/events/${eventId}/vote`)
    if (response.data.success) {
      return response.data
    } else {
      throw new Error(response.data.error || "Failed to remove vote")
    }
  } catch (error) {
    console.error("Remove vote error:", error)
    throw new Error(error.response?.data?.error || "Failed to remove vote")
  }
}

export default function Poll({ eventId }) {
  const [loading, setLoading] = useState(false)
  const [poll, setPoll] = useState(null)
  const [selected, setSelected] = useState(null)
  const [message, setMessage] = useState("")
  const [userVoteStatus, setUserVoteStatus] = useState(null)
  const [hasVoted, setHasVoted] = useState(false)

  async function load() {
    setLoading(true)
    setMessage("")
    try {
      // Load poll data
      const pollData = await getPoll(eventId)
      setPoll(pollData || null)
      
      // Load user's voting status
      const status = await getVotingStatus(eventId)
      setUserVoteStatus(status)
      setHasVoted(status.hasVoted)
      
      // If user has already voted, show their selection
      if (status.hasVoted && status.selectedOption) {
        setSelected(status.selectedOption)
      }
    } catch (e) {
      setMessage(e?.message || "Failed to load poll.")
      toast.error(e?.message || "Failed to load poll")
    } finally {
      setLoading(false)
    }
  }

  async function onVote() {
    if (!selected) {
      setMessage("Please select an option to vote.")
      toast.warning("Please select a date option to vote")
      return
    }
    
    setLoading(true)
    setMessage("")
    try {
      await votePoll(eventId, selected)
      await load()
      setMessage("Vote recorded successfully!")
      toast.success("Vote recorded successfully!")
    } catch (e) {
      setMessage(e?.message || "Failed to vote.")
      toast.error(e?.message || "Failed to submit vote")
    } finally {
      setLoading(false)
    }
  }

  async function onRemoveVote() {
    setLoading(true)
    setMessage("")
    try {
      await removeVote(eventId)
      await load()
      setSelected(null)
      setMessage("Vote removed successfully!")
      toast.success("Vote removed successfully!")
    } catch (e) {
      setMessage(e?.message || "Failed to remove vote.")
      toast.error(e?.message || "Failed to remove vote")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (eventId) {
      load()
    }
  }, [eventId])

  // Calculate percentage for each option
  const calculatePercentage = (votes, totalVotes) => {
    if (totalVotes === 0) return 0
    return Math.round((votes / totalVotes) * 100)
  }

  // Find the winning option(s)
  const findWinningOptions = () => {
    if (!poll || !poll.options || poll.options.length === 0) return []
    
    const maxVotes = Math.max(...poll.options.map(opt => opt.votes))
    return poll.options.filter(opt => opt.votes === maxVotes && maxVotes > 0)
  }

  const winningOptions = findWinningOptions()

  return (
    <div className="rounded-lg border border-gray-200 p-4 bg-white">
      <div className="flex items-center justify-between">
        <h2 className="text-base md:text-lg font-medium text-gray-900">
          {poll?.question || "Date Poll"}
        </h2>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 transition disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> 
          Refresh
        </button>
      </div>

      {message && (
        <p className="mt-3 text-sm text-gray-700 p-2 bg-blue-50 rounded-md">
          {message}
        </p>
      )}

      {loading && !poll ? (
        <div className="mt-4 text-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Loading poll...</p>
        </div>
      ) : !poll ? (
        <p className="mt-3 text-sm text-gray-600 p-3 bg-gray-50 rounded-md">
          No poll available for this event.
        </p>
      ) : (
        <>
          <div className="mt-4 space-y-3">
            {(poll.options || []).map((opt) => {
              const percentage = calculatePercentage(opt.votes, poll.totalVotes)
              const isWinning = winningOptions.some(win => win.id === opt.id)
              const isUserVote = userVoteStatus?.selectedOption === opt.id
              
              return (
                <div 
                  key={opt.id} 
                  className={`rounded-md border p-3 transition-all ${
                    isUserVote 
                      ? "border-blue-300 bg-blue-50" 
                      : isWinning
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="poll"
                      value={opt.id}
                      checked={selected === opt.id}
                      onChange={() => setSelected(opt.id)}
                      disabled={hasVoted || loading}
                      className="h-4 w-4 mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {opt.label}
                          {isUserVote && (
                            <span className="ml-2 text-blue-600 text-xs">
                              (Your vote)
                            </span>
                          )}
                          {isWinning && !isUserVote && (
                            <span className="ml-2 text-green-600 text-xs">
                              (Winning)
                            </span>
                          )}
                        </p>
                        <span className="text-xs font-medium text-gray-600">
                          {opt.votes} vote{opt.votes !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            isWinning ? "bg-green-500" : "bg-blue-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">
                          {percentage}%
                        </span>
                        {isWinning && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </div>
                  </label>
                </div>
              )
            })}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 justify-between">
            <div className="flex gap-2">
              {!hasVoted ? (
                <button
                  type="button"
                  onClick={onVote}
                  disabled={loading || !selected}
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
                >
                  Submit Vote
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onRemoveVote}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" />
                  Remove Vote
                </button>
              )}
            </div>
            
            <div className="inline-flex items-center gap-2 text-sm text-gray-700">
              <BarChart2 className="h-4 w-4" />
              <span>Total votes: {poll.totalVotes}</span>
            </div>
          </div>

          {winningOptions.length > 0 && poll.totalVotes > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm font-medium text-green-800 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                {winningOptions.length === 1 
                  ? `Winning option: ${winningOptions[0].label}`
                  : `${winningOptions.length} options are tied for the lead`
                }
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}