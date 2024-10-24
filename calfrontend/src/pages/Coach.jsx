import React, { useState } from 'react';
import useSWR from 'swr'
import { fetcher } from '../fetchers/fetchers'
import Calendar from 'react-calendar';
import { useParams } from 'react-router-dom';

export const Coach = ({ user }) => {
  const { userId } = useParams()
  const [selectedDate, setSelectedDate] = useState()
  const [startTime, setStartTime] = useState()

  const {
    data: timeSlots, error, loading, mutate
  } = useSWR(`http://localhost:3001/api/v1/time_slots/?user_id=${userId}`, fetcher)

  if (error || timeSlots?.error) return <div>Error loading coach time slots: {error?.message || timeSlots?.error}</div>
  if (loading) return <div>loading...</div>

  const handleSubmit = (e) => {
    e.preventDefault();
    // validation for timeslot overlap could be on backend
    setStartTime(null)
  }

  const handleClickDay = (value) => {
    setSelectedDate(new Date(value))
  }

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value)
  }

  return (
    <div>
      <h2>Coach example</h2>
      <h3>Hi {user.first_name}</h3>

      Create a time slot
      <Calendar onClickDay={handleClickDay} />
      {selectedDate ? `Selected date: ${selectedDate.toDateString()}` : null}
      <form onSubmit={handleSubmit}>
        <label>Pick a start time for a 2-hour appointment
          <input required={true} aria-label="start time" type="time" onChange={handleStartTimeChange} />
        </label>
        <button disabled={!(selectedDate && startTime)} type="submit">Submit</button>
      </form>

      Existing Time slots
      {timeSlots && <ul>
        {timeSlots.map(timeSlot => <li key={`timeslot-${timeSlot.id}`}>{timeSlot.start_time}</li>)}
      </ul>}
    </div>
  )
}

export default Coach;