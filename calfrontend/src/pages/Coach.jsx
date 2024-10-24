import React, { useState } from 'react';
import useSWRMutation from 'swr/mutation'
import useSWR from 'swr'

import Calendar from 'react-calendar';
import { useParams } from 'react-router-dom';

export const Coach = ({ user }) => {
  const { userId } = useParams()
  const [selectedDate, setSelectedDate] = useState()
  const [startTime, setStartTime] = useState()

  const getTimeSlots = async () => {
    return fetch(`http://localhost:3001/api/v1/time_slots/?user_id=${userId}`, {
      method: 'GET',
    }).then(res => res.json())
  }
  
const createTimeSlot = async(url, { arg }) => {
  console.log(JSON.stringify(arg))
  return fetch(url, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(arg)
    }).then(res => res.json()).then(mutate)
  }
  
  const { data: timeSlots, loading, error, mutate } = useSWR(`http://localhost:3001/api/v1/time_slots?user_id=${userId}`, getTimeSlots)


  const { data, trigger: triggerCreateTimeSlot, isMutating } = useSWRMutation('http://localhost:3001/api/v1/time_slots/', createTimeSlot)

// TODO; handle errors
  // if (error || timeSlots?.error) return <div>Error loading coach time slots: {error?.message || timeSlots?.error}</div>
  // if (loading) return <div>loading...</div>

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
    console.log('acac result', result)
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
        <button disabled={!(selectedDate && startTime) || isMutating} type="submit">Submit</button>
      </form>

      Existing Time slots
      {timeSlots?.length > 0 && <ul>
        {timeSlots.map(timeSlot => <li key={`timeslot-${timeSlot.id}`}>{timeSlot.start_time}</li>)}
      </ul>}
    </div>
  )
}

export default Coach;