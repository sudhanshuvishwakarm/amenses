import React from 'react'

const Loading = () => {
    return (
        <div className="absolute h-screen inset-0 flex items-center justify-center bg-white bg-opacity-30 z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    )
}

export default Loading
