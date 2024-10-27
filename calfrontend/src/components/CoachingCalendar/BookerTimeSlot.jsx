import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import useCreateBooking from '../../hooks/useCreateBooking';

const BookerTimeSlot = ({ timeSlotData, user, onBookingSuccess }) => {
  const [errors, setErrors] = useState()
  const timeSlot = timeSlotData.time_slot
  const startTime = new Date(timeSlot.start_time).toLocaleTimeString()
  const endTime = new Date(timeSlot.end_time).toLocaleTimeString()

  const { trigger: triggerCreateBooking, error: createBookingError } = useCreateBooking({ onCreateSuccess: onBookingSuccess })

  const handleTimeSlotClick = async (timeSlotId) => {
    setErrors(null)

    const newBooking = {
      time_slot_id: timeSlotId,
      user_id: user.id
    }

    const result = await triggerCreateBooking(newBooking)

    if (result.errors || createBookingError) {
      setErrors(result.errors || createBookingError)
    }
  }

  const bookingState = () => {
    if (!timeSlotData.is_booked) {
      const timeSlot = timeSlotData.time_slot

      return (
        <button className="border border-black p-1 ml-2 rounded hover:cursor-pointer bg-cyan-200 active:bg-cyan-700" key={`timeslot-${timeSlot.id}`} onClick={() => handleTimeSlotClick(timeSlot.id)}>
          Book this time
        </button>
      )
    } else if (timeSlotData.booker?.id === user.id) {
      return (
        <p className="text-gray-500 ml-2">Booked by you - Coach #: {timeSlotData.creator.phone_number}</p>
      )
    } else {
      return <p className="text-gray-500 ml-2">Unavailable</p>
    }
  }
  return (
    <div key={`timeslot-${timeSlot.id}`}>
      {startTime} to {endTime}{bookingState()}
      <div className="text-red-700">{errors}</div>
    </div>
  )
}

export default BookerTimeSlot;