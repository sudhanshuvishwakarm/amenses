import { NextResponse } from "next/server";
import { connectDB } from "../../../../dbConfig/dbconnection.js";
import getDataFromToken from "../../../../utils/getDataFromToken.js";
import Event from "../../../../models/Event.js";
import User from "../../../../models/User.js";

connectDB();

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

    const event = await Event.findById(id)
      .populate('creator', 'username email');

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    const isCreator = event.creator._id.toString() === userId;

    const responseData = {
      _id: event._id,
      title: event.title,
      description: event.description,
      pollQuestion: event.pollQuestion,
      creator: {
        _id: event.creator._id,
        username: event.creator.username,
        email: event.creator.email
      },
      dateOptions: event.dateOptions.map(option => ({
        _id: option._id,
        date: option.date.toISOString(),
        voters: option.voters
      })),
      participants: event.participants,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      isCreator: isCreator
    };

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Get event error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event', details: error.message },
      { status: 500 }
    );
  }
}



export async function PUT(request, { params }) {
  try {
    const userId = await getDataFromToken(request);
    const { id } = params;

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { title, description, dateOptions, participants, pollQuestion } = await request.json();

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

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    if (event.creator.toString() !== userId) {
      return NextResponse.json(
        { error: 'Not authorized to edit this event' },
        { status: 403 }
      );
    }

    const creatorUser = await User.findById(userId).select('email');
    if (!creatorUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    event.title = title;
    event.description = description;
    event.pollQuestion = pollQuestion || 'Choose a suitable date';
    
    event.dateOptions = dateOptions.map(dateString => ({
      date: new Date(dateString),
      voters: [] 
    }));
    
    event.participants = [
      { email: creatorUser.email, status: 'accepted' },
      ...(participants || []).map(email => ({ 
        email: email.toLowerCase().trim(), 
        status: 'pending' 
      }))
    ];

    const savedEvent = await event.save();
    
    const populatedEvent = await Event.findById(savedEvent._id)
      .populate('creator', 'username email');

    return NextResponse.json(
      { 
        success: true, 
        message: 'Event updated successfully',
        data: populatedEvent 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update event error:', error);
    return NextResponse.json(
      { error: 'Failed to update event', details: error.message },
      { status: 500 }
    );
  }
}