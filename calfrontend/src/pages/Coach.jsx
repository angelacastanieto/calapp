import React, { useEffect, useState } from 'react';
import useSWRMutation from 'swr/mutation'
import useSWR from 'swr'

import Calendar from 'react-calendar';
import { useParams } from 'react-router-dom';

export const Coach = ({ user }) => {
  return (
    <div>
      <h2>Coach example</h2>
      <h3>Hi {user.first_name}</h3>
      <TimeSlotPicker user={user} />
    </div>
  )
}

const TimeSlotPicker = ({ user }) => {
  const { userId } = useParams()
  const [selectedDate, setSelectedDate] = useState()
  const [startTime, setStartTime] = useState()
  const [createTimeSlotErrors, setCreateTimeSlotErrors] = useState()

  const getTimeSlots = async () => {
    // this should already be at beginning of day, but still setting as 0 to be safe
    if (!selectedDate) {
      return null
    }

    const fromTime = new Date(selectedDate.getTime())
    fromTime.setHours(0, 0, 0, 0)
    // set to end of day
    const toTime = new Date(selectedDate.getTime())
    toTime.setHours(23, 59, 59, 59)

    return fetch(`http://localhost:3001/api/v1/time_slots/?user_id=${userId}&from_time=${fromTime.toISOString()}&to_time=${toTime.toISOString()}`, {
      method: 'GET',
    }).then(res => res.json())
  }

  const createTimeSlot = async (url, { arg }) => {
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

  const { data: timeSlots, loading, error, mutate: refetchTimeSlots } = useSWR(selectedDate, getTimeSlots)

  const { data, trigger: triggerCreateTimeSlot, isMutating } = useSWRMutation('http://localhost:3001/api/v1/time_slots/', createTimeSlot)

  // TODO: move this loading and error handling closer to the Time slot.  Should move to own components
  if (error || timeSlots?.error) return <div>Error loading coach time slots: {error?.message || timeSlots?.error}</div>
  if (loading) return <div>loading...</div>

  const handleSubmit = async (e) => {
    e.preventDefault();
    // validation for timeslot overlap can be on backend
    setStartTime(null)


    const [hours, minutes] = startTime.split(':')
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
      setCreateTimeSlotErrors(result.errors)
    }
    setStartTime(null)
  }

  const handleClickDay = (value) => {
    if (startTime) {
      setStartTime(null)
    }
    if (createTimeSlotErrors) {
      setCreateTimeSlotErrors(null)
    }
    setSelectedDate(new Date(value))
  }

  const handleStartTimeChange = (e) => {
    if (createTimeSlotErrors) {
      setCreateTimeSlotErrors(null)
    }
    setStartTime(e.target.value)
  }

  return (
    <div>
      <Calendar onClickDay={handleClickDay} />
      <form onSubmit={handleSubmit}>
        <label>Pick a start time for a 2-hour appointment
          <input required={true} value={startTime || ''} min="08:00" max="18:00" aria-label="start time" type="time" onChange={handleStartTimeChange} />
        </label>
        <button disabled={!(selectedDate) || isMutating} type="submit">Submit</button>
      </form>

      {selectedDate ? `Your time slots for: ${selectedDate.toDateString()}` : null}
      {timeSlots?.length > 0 && <ul>
        {timeSlots.map(timeSlot => {
          const startTime = new Date(timeSlot.start_time).toLocaleTimeString()
          const endTime = new Date(timeSlot.end_time).toLocaleTimeString()

          return (
            <li key={`timeslot-${timeSlot.id}`}>
              {startTime} to {endTime}</li>)
        })}
      </ul>}
      <div>{createTimeSlotErrors}</div>
    </div>
  )
}

export default Coach;