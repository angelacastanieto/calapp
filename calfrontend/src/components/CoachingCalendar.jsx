import React, { useEffect, useRef, useState } from 'react';
import useSWR from 'swr'
import { getTimeSlots } from '../fetchers/fetchers';

import Calendar from 'react-calendar';
import useCreateTimeSlot from '../hooks/useCreateTimeSlot';
import useCreateBooking from '../hooks/useCreateBooking';

const TimeSlotCreatorForm = ({ 
    user, 
    selectedDate, 
    onStartTimeChange,
    onCreateSuccess 
  }) => {
  const [errors, setErrors] = useState()
  const { trigger: triggerCreateTimeSlot, isMutating } = useCreateTimeSlot({ onCreateSuccess })
  const startTimeinputRef = useRef()

  const handleSubmit = async (e) => {
    e.preventDefault();

    const value = startTimeinputRef.current.value
    console.log('acac value', startTimeinputRef.current.value)
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

    if (result.errors) {
      setErrors(result.errors)
    }
  }

  const handleStartTimeChange = (e) => {
    if (errors) {
      setErrors(null)
    }
    onStartTimeChange(e.target.value)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Pick a start time for a 2-hour appointment
          <input 
            ref={startTimeinputRef}
            required={true} 
            min="08:00" 
            max="18:00" 
            aria-label="start time" 
            type="time" 
          />
        </label>
        <button disabled={!(selectedDate) || isMutating} type="submit">Submit</button>
      </form>
    </div>
  )
}
const CoachingCalendar = ({ user, isCreator, isBooker }) => {
  const [selectedDate, setSelectedDate] = useState()
  const [errors, setErrors] = useState()

  // TODO move into hooks, remove fetchers
  const { data: timeSlotsData, loading: timeSlotsDataLoading, error: timeSlotsDataError, mutate: refetchTimeSlots } = useSWR(selectedDate, () => getTimeSlots(user.id, coachUserId, selectedDate))

  if (timeSlotsData?.error) return <div>Error loading time slots: {timeSlotsData?.error}</div> //  todo: move down
  if (timeSlotsDataError) return <div>Error loading time slots: {timeSlotsDataError}</div> // todo: move down
  if (timeSlotsDataLoading) return <div>Looading...</div> // todo: move down

  const coachUserId = 1 // TODO: make this selectable dropdown? 

  const handleClickDay = (value) => {
    if (errors) {
      setErrors(null)
    }
    setSelectedDate(new Date(value))
  }

  const renderCalendar = (timeSlotData) => {
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

  return (
    <div>
      <Calendar onClickDay={handleClickDay} />
      {isCreator && <TimeSlotCreatorForm
        user={user}
        selectedDate={selectedDate}
        onCreateSuccess={refetchTimeSlots}
      />}

      {selectedDate ? `Your time slots for: ${selectedDate.toDateString()}` : null}
      {timeSlotsData && ( 
          <div>
            {timeSlotsData.map(timeSlotData => renderCalendar(timeSlotData))}
          </div>
        )
      }
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
    <div key={`timeslot-${timeSlot.id}`}>
      {startTime} to {endTime}{booker && ` (Booked by ${booker.first_name} ${booker.last_name}) - ${booker.phone_number}`}
    </div>
  )
}

const BookerTimeSlot = ({ timeSlotData, user, onBookingSuccess }) => {
  const [errors, setErrors] = useState()
  const timeSlot = timeSlotData.time_slot
  const startTime = new Date(timeSlot.start_time).toLocaleTimeString()
  const endTime = new Date(timeSlot.end_time).toLocaleTimeString()

  const { trigger: triggerCreateBooking, error: createBookingError } = useCreateBooking({onCreateSuccess: onBookingSuccess})

  const handleTimeSlotClick = async (timeSlotId) => {
    setErrors(null)

    const newBooking = {
      time_slot_id: timeSlotId,
      user_id: user.id
    }

    const result = await triggerCreateBooking(newBooking)
    
    if (result.errors) {
      setErrors(result.errors)
    }
  }
  
  const bookingState = () => {
    if (!timeSlotData.is_booked) {
      const timeSlot = timeSlotData.time_slot
      return (
        <button key={`timeslot-${timeSlot.id}`} onClick={() => handleTimeSlotClick(timeSlot.id)}>
          Book this time
        </button>
      )
    } else if (timeSlotData.booker?.id == user.id) {
      return `(Booked by you - Coach #: ${timeSlotData.creator.phone_number}`
    } else {
      return '(Booked)'
    }
  }
  return (
    <div key={`timeslot-${timeSlot.id}`}>
      {startTime} to {endTime}{bookingState()}
      {errors}
    </div>
  )
}

export default CoachingCalendar;