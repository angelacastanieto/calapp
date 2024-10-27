import React, { useRef, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import useCreateTimeSlot from '../../hooks/useCreateTimeSlot';

export const TimeSlotCreatorForm = ({
  user,
  selectedDate,
  onCreateSuccess
}) => {
  const [errors, setErrors] = useState()
  const {
    trigger: triggerCreateTimeSlot,
    error: triggerCreateTimeSlotError,
    isMutating } = useCreateTimeSlot({ onCreateSuccess })

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
      <div className="text-red-700 w-1/2">{errors}</div>
    </div>
  )
}

export default TimeSlotCreatorForm;