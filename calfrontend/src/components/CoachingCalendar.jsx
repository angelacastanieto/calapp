import React, { useRef, useState } from 'react';
import useGetTimeSlots from '../hooks/useGetTimeSlots';
import 'react-calendar/dist/Calendar.css';

import Calendar from 'react-calendar';
import useCreateTimeSlot from '../hooks/useCreateTimeSlot';
import useCreateBooking from '../hooks/useCreateBooking';

const TimeSlotCreatorForm = ({
  user,
  selectedDate,
  onCreateSuccess
}) => {
  const [errors, setErrors] = useState()
  const { trigger: triggerCreateTimeSlot, error: triggerCreateTimeSlotError, isMutating } = useCreateTimeSlot({ onCreateSuccess })
  const startTimeinputRef = useRef()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null)

    const value = startTimeinputRef.current.value
    const [hours, minutes] = value.split(':')

    // copy selected date so do not update selectedDate before submit
    const dateToSubmit = new Date(selectedDate.getTime())
    dateToSubmit.setHours(hours)
    dateToSubmit.setMinutes(minutes)

    const newTimeSlot = {
      start_time: dateToSubmit.toISOString(),
      user_id: user.id
    }

    const result = await triggerCreateTimeSlot(newTimeSlot)

    if (result.errors || triggerCreateTimeSlotError) {
      setErrors(result.errors[0] || triggerCreateTimeSlotError)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Pick a start time for a 2-hour appointment
          <br />
          <input
            className="border border-black px-2 py-1 mt-2 rounded"
            ref={startTimeinputRef}
            required={true}
            min="08:00"
            max="18:00"
            aria-label="start time"
            type="time"
          />
        </label>
        <button className="border border-black p-1 ml-2 rounded hover:cursor-pointer bg-cyan-200 active:bg-cyan-700" disabled={!(selectedDate) || isMutating} type="submit">Submit</button>
      </form>
      <div className="text-red-700">{errors}</div>
    </div>
  )
}
const CoachingCalendar = ({ user, coachUserId, isCreator, isBooker }) => {
  const [selectedDate, setSelectedDate] = useState()
  const [errors, setErrors] = useState()

  const { data: timeSlotsData, loading: timeSlotsDataLoading, error: timeSlotsDataError, mutate: refetchTimeSlots } = useGetTimeSlots(user.id, coachUserId, selectedDate)

  if (timeSlotsData?.error) return <div>Error loading time slots: {timeSlotsData?.error}</div> //  todo: move down
  if (timeSlotsDataError) return <div>Error loading time slots: {timeSlotsDataError}</div> // todo: move down
  if (timeSlotsDataLoading) return <div>Looading...</div> // todo: move down

  const handleClickDay = (value) => {
    if (errors) {
      setErrors(null)
    }
    setSelectedDate(new Date(value))
  }

  const renderTimeSlot = (timeSlotData) => {
    if (!timeSlotData) {
      return null
    }

    if (isCreator) {
      return (
        <CreatorTimeSlot
          timeSlotData={timeSlotData}
        />
      )
    }

    if (isBooker) {
      return (
        <BookerTimeSlot
          timeSlotData={timeSlotData}
          user={user}
          onBookingSuccess={refetchTimeSlots}
        />
      )
    }

    return null;
  }

  const noTimeSlots = timeSlotsData?.length === 0

  return (
    <div className="flex flex-row space-x-20 py-10">
      <div className="flex flex-col space-y-10">
        <Calendar className="rounded" onClickDay={handleClickDay} />
        {selectedDate && isCreator && <TimeSlotCreatorForm
          user={user}
          selectedDate={selectedDate}
          onCreateSuccess={refetchTimeSlots}
        />}
      </div>
      <div>
        {timeSlotsData && selectedDate && (
          <div className="flex flex-col space-y-4">
            <h2 className="font-semibold">{`${noTimeSlots ? 'No' : ''} Time slots for: ${selectedDate.toDateString()}`}</h2>
            {timeSlotsData.map(timeSlotData => renderTimeSlot(timeSlotData))}
          </div>
        )
        }
      </div>
      <div>{errors}</div>
    </div>
  )
}

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

export default CoachingCalendar;