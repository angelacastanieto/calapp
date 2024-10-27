import React from 'react';
import 'react-calendar/dist/Calendar.css';

const CreatorTimeSlot = ({ timeSlotData }) => {
  const timeSlot = timeSlotData.time_slot
  const startTime = new Date(timeSlot.start_time).toLocaleTimeString()
  const endTime = new Date(timeSlot.end_time).toLocaleTimeString()

  const booker = timeSlotData.booker
  return (
    <div className="flex flex-col" key={`timeslot-${timeSlot.id}`}>
      <p>{startTime} to {endTime}</p>
      {booker && (
        <p className="text-gray-500 ml-2">Booked by {booker.first_name} {booker.last_name} - {booker.phone_number}</p>
      )
      }
    </div>
  )
}

export default CreatorTimeSlot;