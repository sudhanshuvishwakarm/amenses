// components/event-card.jsx
import { Calendar, Users, Clock, MapPin, AlertCircle } from "lucide-react"

export default function EventCard({ event, isInvitation = false }) {
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Format time for display
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Count participants
  const participantCount = event.participants?.length || 0
  
  // Count date options
  const dateOptionCount = event.dateOptions?.length || 0

  // Get creator name - handle both populated and unpopulated cases
  const creatorName = event.creator?.username || event.creator?.email || 'Unknown'

  // Get user's status for this event if it's an invitation
  const userStatus = isInvitation ? 
    event.participants?.find(p => p.email === localStorage.getItem('userEmail'))?.status : 
    null

  return (
    <div className={`bg-white border rounded-lg p-4 hover:shadow-md transition-all ${
      isInvitation ? "border-purple-200" : "border-gray-200"
    }`}>
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-gray-900 text-lg mb-1">{event.title}</h3>
        {isInvitation && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            userStatus === 'pending' 
              ? "bg-yellow-100 text-yellow-800" 
              : userStatus === 'accepted'
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}>
            {userStatus || 'pending'}
          </span>
        )}
      </div>
      
      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{event.description}</p>
      
      <div className="mt-3 flex items-center text-xs text-gray-500">
        <Users className="h-3 w-3 mr-1" />
        <span className="mr-3">{participantCount} participant{participantCount !== 1 ? 's' : ''}</span>
        
        <Clock className="h-3 w-3 mr-1" />
        <span>{dateOptionCount} option{dateOptionCount !== 1 ? 's' : ''}</span>
      </div>
      
      <div className="mt-3 text-xs text-gray-500 flex items-center">
        <span>By: {creatorName}</span>
        <span className="mx-2">•</span>
        <span>Created: {formatDate(event.createdAt)}</span>
      </div>
      
      {event.dateOptions && event.dateOptions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-700 mb-1">Proposed dates:</p>
          <div className="space-y-1">
            {event.dateOptions.slice(0, 2).map((option, index) => (
              <div key={index} className="flex items-center text-xs text-gray-600">
                <Calendar className="h-3 w-3 mr-1" />
                <span>
                  {formatDate(option.date)} at {formatTime(option.date)}
                </span>
              </div>
            ))}
            {event.dateOptions.length > 2 && (
              <p className="text-xs text-gray-500">+{event.dateOptions.length - 2} more options</p>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-4 flex justify-between items-center">
        <a 
          href={`/events/${event._id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
        >
          View details →
        </a>
        
        {isInvitation && userStatus === 'pending' && (
          <span className="flex items-center text-xs text-yellow-600">
            <AlertCircle className="h-3 w-3 mr-1" />
            Action required
          </span>
        )}
      </div>
    </div>
  )
}// // components/event-card.jsx
// export default function EventCard({ event }) {
//   // Format date for display
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       weekday: 'short',
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     })
//   }

//   // Count participants
//   const participantCount = event.participants?.length || 0
  
//   // Count date options
//   const dateOptionCount = event.dateOptions?.length || 0

//   // Get creator name - handle both populated and unpopulated cases
//   const creatorName = event.creator?.username || event.creator?.email || 'Unknown'

//   return (
//     <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
//       <h3 className="font-medium text-gray-900">{event.title}</h3>
//       <p className="text-sm text-gray-600 mt-1 line-clamp-2">{event.description}</p>
      
//       <div className="mt-2 text-xs text-gray-500">
//         Created by: {creatorName}
//       </div>
      
//       <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
//         <span>{participantCount} participant{participantCount !== 1 ? 's' : ''}</span>
//         <span>{dateOptionCount} date option{dateOptionCount !== 1 ? 's' : ''}</span>
//       </div>
      
//       <div className="mt-3 text-xs text-gray-500">
//         Created: {formatDate(event.createdAt)}
//       </div>
      
//       <a 
//         href={`/events/${event._id}`}
//         className="mt-3 inline-block text-sm text-blue-600 hover:text-blue-800"
//       >
//         View details →
//       </a>
//     </div>
//   )
// }