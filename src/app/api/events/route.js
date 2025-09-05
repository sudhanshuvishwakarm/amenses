
import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "../../../dbConfig/dbconnection.js";
import getDataFromToken from "../../../utils/getDataFromToken.js";
import Event from "../../../models/Event.js";
import User from "../../../models/User.js";


connectDB();

export async function GET(request) {
  try {
    const userId = await getDataFromToken(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get events created by user
    const createdEvents = await Event.find({ creator: userId })
      .populate('creator', 'username email') // Only populate creator
      .sort({ createdAt: -1 });

    // Get events where user is a participant (but not the creator)
    // First get the current user's email
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const invitedEvents = await Event.find({
      'participants.email': currentUser.email,
      'creator': { $ne: userId }
    })
      .populate('creator', 'username email') // Only populate creator
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: {
        createdEvents,
        invitedEvents
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events', details: error.message },
      { status: 500 }
    );
  }
}


export async function POST(request) {
  try {
    await connectDB();
    const userId = await getDataFromToken(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { title, description, dateOptions, participants, pollQuestion } = await request.json();

    // Validation
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    if (!dateOptions || !Array.isArray(dateOptions) || dateOptions.length === 0) {
      return NextResponse.json(
        { error: 'At least one date option is required' },
        { status: 400 }
      );
    }

    // Get the creator's user data to get their email
    const creatorUser = await User.findById(userId).select('email');
    if (!creatorUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create the event with date options embedded
    const event = new Event({
      title,
      description,
      creator: userId,
      dateOptions: dateOptions.map(dateString => ({
        date: new Date(dateString),
        voters: []
      })),
      participants: [
        // Add creator as participant with accepted status
        { email: creatorUser.email, status: 'accepted' },
        // Add other participants with pending status
        ...(participants || []).map(email => ({ 
          email: email.toLowerCase().trim(), 
          status: 'pending' 
        }))
      ],
      pollQuestion: pollQuestion || 'Choose a suitable date'
    });

    const savedEvent = await event.save();
    
    // Populate the event with creator data for response
    const populatedEvent = await Event.findById(savedEvent._id)
      .populate('creator', 'username email');

    return NextResponse.json(
      { 
        success: true, 
        message: 'Event created successfully',
        data: populatedEvent 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json(
      { error: 'Failed to create event', details: error.message },
      { status: 500 }
    );
  }
}