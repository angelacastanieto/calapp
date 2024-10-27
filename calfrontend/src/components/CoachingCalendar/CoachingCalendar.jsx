import React, { useState } from 'react';
import useGetTimeSlots from '../../hooks/useGetTimeSlots';
import 'react-calendar/dist/Calendar.css';

import Calendar from 'react-calendar';
import useCreateBooking from '../../hooks/useCreateBooking';
import TimeSlotCreatorForm from './TimeSlotCreatorForm';
import CreatorTimeSlot from './CreatorTimeSlot';
import BookerTimeSlot from './BookerTimeSlot';


const CoachingCalendar = ({ user, coachUserId, isCreator, isBooker }) => {
  const [selectedDate, setSelectedDate] = useState()
  const [errors, setErrors] = useState()
  const { data: timeSlotsData, loading: timeSlotsDataLoading, error: timeSlotsDataError, mutate: refetchTimeSlots } = useGetTimeSlots(user.id, coachUserId, selectedDate)

  const handleClickDay = (value) => {
    if (errors) {
      setErrors(null)
    }
    setSelectedDate(new Date(value))
  }

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
      <TimeSlots 
        timeSlotsData={timeSlotsData} 
        selectedDate={selectedDate} 
        error={timeSlotsDataError} 
        loading={timeSlotsDataLoading} 
        isCreator={isCreator}
        isBooker={isBooker}
        refetch={refetchTimeSlots}
        user={user}
      />
      <div>{errors}</div>
    </div>
  )
}

const TimeSlots = ({ user, timeSlotsData, loading, error, selectedDate, isCreator, isBooker, refetch }) => {

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
          onBookingSuccess={refetch}
        />
      )
    }

    return null;
  }

  if (timeSlotsData?.error) return <div>Error fetching time slots: {timeSlotsData?.error}</div>
  if (error) return <div>Error fetching time slots: {error}</div>
  if (loading) return <div>Loading time slots...</div>

  const noTimeSlots = timeSlotsData?.length === 0

  return (
    <div>
      {timeSlotsData && selectedDate && (
        <div className="flex flex-col space-y-4">
          <h2 className="font-semibold">{`${noTimeSlots ? 'No' : ''} Time slots for: ${selectedDate.toDateString()}`}</h2>
          {timeSlotsData.map(timeSlotData => renderTimeSlot(timeSlotData))}
        </div>
      )
      }
    </div>
  )
}
export default CoachingCalendar;