import { NextResponse } from "next/server";
import { connectDB } from "../../../../../dbConfig/dbconnection.js";
import getDataFromToken from "../../../../../utils/getDataFromToken.js";
import Event from "../../../../../models/Event.js";

connectDB();

export async function POST(request, { params }) {
  try {
    const userId = await getDataFromToken(request);
    const { id } = params;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { dateOptionId } = await request.json();
    
    if (!dateOptionId) {
      return NextResponse.json(
        { error: 'Date option ID is required' },
        { status: 400 }
      );
    }

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    event.dateOptions.forEach(option => {
      option.voters = option.voters.filter(voter => voter.toString() !== userId);
    });

    const selectedOption = event.dateOptions.id(dateOptionId);
    if (selectedOption) {
      selectedOption.voters.push(userId);
      await event.save();
      
      return NextResponse.json({ 
        success: true, 
        message: 'Vote recorded successfully' 
      });
    } else {
      return NextResponse.json(
        { error: 'Date option not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json(
      { error: 'Failed to vote', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const userId = await getDataFromToken(request);
    const { id } = params;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    let selectedOption = null;
    let hasVoted = false;

    for (const option of event.dateOptions) {
      if (option.voters.some(voter => voter.toString() === userId)) {
        selectedOption = option._id.toString();
        hasVoted = true;
        break;
      }
    }

    return NextResponse.json({
      success: true,
      data: { hasVoted, selectedOption }
    });
  } catch (error) {
    console.error('Vote status error:', error);
    return NextResponse.json(
      { error: 'Failed to get vote status', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const userId = await getDataFromToken(request);
    const { id } = params;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    let voteRemoved = false;
    event.dateOptions.forEach(option => {
      const initialLength = option.voters.length;
      option.voters = option.voters.filter(voter => voter.toString() !== userId);
      if (option.voters.length < initialLength) {
        voteRemoved = true;
      }
    });

    if (voteRemoved) {
      await event.save();
      return NextResponse.json({ 
        success: true, 
        message: 'Vote removed successfully' 
      });
    } else {
      return NextResponse.json(
        { error: 'No vote found to remove' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Remove vote error:', error);
    return NextResponse.json(
      { error: 'Failed to remove vote', details: error.message },
      { status: 500 }
    );
  }
}