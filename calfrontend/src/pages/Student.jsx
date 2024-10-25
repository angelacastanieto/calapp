import React, { useState } from 'react';
import Calendar from 'react-calendar';
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

import { getTimeSlots } from '../fetchers/fetchers';

export const Student = ({ user }) => {
  const [selectedDate, setSelectedDate] = useState()
  const [createBookingErrors, setCreateBookingErrors] = useState()

  const { data: timeSlots, loading, error, mutate: refetchTimeSlots } = useSWR(selectedDate, () => getTimeSlots(1, selectedDate, true))

  const createBooking = async (url, { arg }) => {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(arg)
    }).then(res => {
      if (!res.error) {
        refetchTimeSlots()
      }
      return res.json()
    })
  }

  const { data, trigger: triggerCreateBooking, isMutating } = useSWRMutation('http://localhost:3001/api/v1/bookings/', createBooking)

  if (error || timeSlots?.error) return <div>Error loading coach time slots: {error?.message || timeSlots?.error}</div>
  if (loading) return <div>loading...</div>

  const handleClickDay = (value) => {
    setSelectedDate(new Date(value))
  }

  const handleTimeSlotClick = async (timeSlotId) => {
    const newBooking = {
      time_slot_id: timeSlotId,
      user_id: user.id
    }

    // TODO: make index only on time_slot_id for bookings; only one booking per time slot
    const result = await triggerCreateBooking(newBooking)

    
    if (result.errors) {
      setCreateBookingErrors(result.errors)
    }
  }

  return (
    <div>
      <h2>Student example</h2>
      <h3>Hi {user.first_name}</h3>
      <Calendar onClickDay={handleClickDay} />
      Select an available time slot
      {timeSlots?.length > 0 && <ul>
        {timeSlots.map(timeSlot => {
          const startTime = new Date(timeSlot.start_time).toLocaleTimeString()
          const endTime = new Date(timeSlot.end_time).toLocaleTimeString()

          return (
            <div>
              <button key={`timeslot-${timeSlot.id}`} onClick={() => handleTimeSlotClick(timeSlot.id)}>
                {startTime} to {endTime}
              </button>
            </div>
          )
        })}
      </ul>}
      <div>{createBookingErrors}</div>
    </div>
  )
}

export default Student;