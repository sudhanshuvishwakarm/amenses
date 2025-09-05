import { NextResponse } from "next/server";
import { connectDB } from "../../../../../dbConfig/dbconnection.js";
// import getDataFromToken from "../../../../../utils/getDataFromToken.js";
import Event from "../../../../../models/Event.js";

connectDB();

export async function GET(request, { params }) {
  try {
    const { id } = params;
    console.log("Fetching poll for eventId:", id);
    
    const event = await Event.findById(id);
    
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const pollData = {
      question: event.pollQuestion || "Choose a suitable date",
      options: event.dateOptions.map(option => ({
        id: option._id.toString(),
        label: new Date(option.date).toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        votes: option.voters.length
      })),
      totalVotes: event.dateOptions.reduce((sum, option) => sum + option.voters.length, 0)
    };

    return NextResponse.json({ 
      success: true, 
      data: pollData 
    });
  } catch (error) {
    console.error('Get poll error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch poll', details: error.message },
      { status: 500 }
    );
  }
}