"use client"

import Header from "../../components/Header.jsx"
import Footer from "../../components/Footer.jsx"
import EventCard from "../../components/event-card.jsx"
import NotificationList from "../../components/notification-list.jsx"
import Loading from "../../components/Loading.jsx"
import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { ToastContainer } from "react-toastify"
import { Calendar, Users, Clock, Plus, Bell } from "lucide-react"
import 'react-toastify/dist/ReactToastify.css'

export default function DashboardPage() {
  const [myEvents, setMyEvents] = useState([])
  const [invitedEvents, setInvitedEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("all") // "all", "myEvents", "invitedEvents"

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch events from your existing API endpoint
      const response = await axios.get('/api/events')
      
      if (response.data.success) {
        setMyEvents(response.data.data.createdEvents || [])
        setInvitedEvents(response.data.data.invitedEvents || [])
      } else {
        throw new Error(response.data.error || "Failed to fetch events")
      }
    } catch (err) {
      console.error("Failed to fetch events:", err)
      setError("Failed to load events. Please try again later.")
      toast.error("Failed to load events. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Calculate pending invites - check if current user has pending status in any event
  const pendingInvites = invitedEvents.filter(event => {
    // Get current user's email from localStorage or wherever you store it
    const userEmail = localStorage.getItem('userEmail') || '';
    return event.participants?.some(participant => 
      participant.email === userEmail && participant.status === 'pending'
    );
  });

  if (loading) {
    return (
      <main className="min-h-dvh flex flex-col bg-gray-50">
        <Header pendingCount={0} />
        <Loading />
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-dvh flex flex-col bg-gray-50">
      <Header pendingCount={pendingInvites.length} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <section className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 py-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Event Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage your events and invitations in one place
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <NotificationList items={pendingInvites} />
              <a 
                href="/events/create"
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition shadow-sm"
              >
                <Plus className="h-4 w-4" />
                Create Event
              </a>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-100 p-3 mr-4">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Events</p>
                  <p className="text-2xl font-bold text-gray-900">{myEvents.length + invitedEvents.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center">
                <div className="rounded-full bg-green-100 p-3 mr-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">My Events</p>
                  <p className="text-2xl font-bold text-gray-900">{myEvents.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center">
                <div className="rounded-full bg-purple-100 p-3 mr-4">
                  <Bell className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Invitations</p>
                  <p className="text-2xl font-bold text-gray-900">{invitedEvents.length}</p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md mb-6">
              <p className="text-red-700">{error}</p>
              <button 
                onClick={fetchEvents}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("all")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "all"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                All Events
              </button>
              <button
                onClick={() => setActiveTab("myEvents")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "myEvents"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                My Events
              </button>
              <button
                onClick={() => setActiveTab("invitedEvents")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "invitedEvents"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Invitations
              </button>
            </nav>
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* My Events Section */}
            <div className={`lg:w-1/2 ${activeTab !== "invitedEvents" ? "block" : "hidden lg:block"}`}>
              <div className="bg-white rounded-lg border border-blue-200 shadow-sm p-5 h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    My Events
                  </h2>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {myEvents.length} events
                  </span>
                </div>
                
                {myEvents.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {myEvents.map((event) => (
                      <EventCard key={event._id} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No events yet</h3>
                    <p className="text-gray-500 mb-4">Create your first event to get started</p>
                    <a 
                      href="/events/create" 
                      className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
                    >
                      <Plus className="h-4 w-4" />
                      Create Event
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Invited Events Section */}
            <div className={`lg:w-1/2 ${activeTab !== "myEvents" ? "block" : "hidden lg:block"}`}>
              <div className="bg-white rounded-lg border border-purple-200 shadow-sm p-5 h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Bell className="h-5 w-5 text-purple-600" />
                    Invited Events
                  </h2>
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {invitedEvents.length} events
                  </span>
                </div>
                
                {invitedEvents.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {invitedEvents.map((event) => (
                      <EventCard key={event._id} event={event} isInvitation={true} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No invitations yet</h3>
                    <p className="text-gray-500">You haven't been invited to any events</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}// "use client"

// import Header from "../../components/Header.jsx"
// import Footer from "../../components/Footer.jsx"
// import EventCard from "../../components/event-card.jsx"
// import NotificationList from "../../components/notification-list.jsx"
// import Loading from "../../components/Loading.jsx"
// import { useState, useEffect } from "react"
// import axios from "axios"
// import { toast } from "react-toastify"
// import { ToastContainer } from "react-toastify"
// import 'react-toastify/dist/ReactToastify.css'

// export default function DashboardPage() {
//   const [myEvents, setMyEvents] = useState([])
//   const [invitedEvents, setInvitedEvents] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     fetchEvents()
//   }, [])

//   const fetchEvents = async () => {
//     try {
//       setLoading(true)
//       setError(null)
      
//       // Fetch events from your existing API endpoint
//       const response = await axios.get('/api/events')
      
//       if (response.data.success) {
//         setMyEvents(response.data.data.createdEvents || [])
//         setInvitedEvents(response.data.data.invitedEvents || [])
//       } else {
//         throw new Error(response.data.error || "Failed to fetch events")
//       }
//     } catch (err) {
//       console.error("Failed to fetch events:", err)
//       setError("Failed to load events. Please try again later.")
//       toast.error("Failed to load events. Please try again later.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Calculate pending invites - check if current user has pending status in any event
//   const pendingInvites = invitedEvents.filter(event => {
//     // Get current user's email from localStorage or wherever you store it
//     const userEmail = localStorage.getItem('userEmail') || '';
//     return event.participants?.some(participant => 
//       participant.email === userEmail && participant.status === 'pending'
//     );
//   });

//   if (loading) {
//     return (
//       <main className="min-h-dvh flex flex-col bg-white">
//         <Header pendingCount={0} />
//         <Loading />
//         <Footer />
//       </main>
//     )
//   }

//   return (
//     <main className="min-h-dvh flex flex-col bg-white">
//       <Header pendingCount={pendingInvites.length} />
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//       />
      
//       <section className="flex-1">
//         <div className="mx-auto w-full max-w-6xl px-4 py-6">
//           <div className="flex items-center justify-between">
//             <h1 className="text-lg md:text-xl font-medium text-gray-900">Dashboard</h1>
//             <NotificationList items={pendingInvites} />
//           </div>

//           {error && (
//             <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
//               <p className="text-red-700">{error}</p>
//               <button 
//                 onClick={fetchEvents}
//                 className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
//               >
//                 Try Again
//               </button>
//             </div>
//           )}

//           <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <div>
//               <h2 className="text-base md:text-lg font-medium text-gray-900">My Events</h2>
//               <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {myEvents.length ? (
//                   myEvents.map((event) => <EventCard key={event._id} event={event} />)
//                 ) : (
//                   <div className="col-span-2 py-8 text-center">
//                     <p className="text-sm text-gray-600">No events created yet.</p>
//                     <a 
//                       href="/events/create" 
//                       className="mt-2 inline-block text-blue-600 hover:text-blue-800"
//                     >
//                       Create your first event
//                     </a>
//                   </div>
//                 )}
//               </div>
//             </div>
            
//             <div>
//               <h2 className="text-base md:text-lg font-medium text-gray-900">Invited Events</h2>
//               <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {invitedEvents.length ? (
//                   invitedEvents.map((event) => <EventCard key={event._id} event={event} />)
//                 ) : (
//                   <p className="text-sm text-gray-600">No invitations yet.</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <Footer />
//     </main>
//   )
// }
