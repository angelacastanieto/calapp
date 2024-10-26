import React, { useRef, useState } from 'react';
import useSWR from 'swr';
import CoachingCalendar from '../components/CoachingCalendar';
import { fetcher } from '../fetchers/fetchers'

export const Student = ({ user }) => {
  const [selectedCoach, setSelectedCoach] = useState()

  const renderCoachCalendar = () => {
    console.log('acac selectedCoach', JSON.stringify(selectedCoach))
    return selectedCoach && <div>Calendar for {`${selectedCoach.first_name} ${selectedCoach.last_name}`}<CoachingCalendar user={user} coachUserId={selectedCoach.id} isBooker /></div>
  }

  return (
    <div>
      <h2>Student example</h2>
      <h3>Hi {user.first_name}</h3>
      <CoachPicker onCoachSelect={(value) => setSelectedCoach(value)} />
      {renderCoachCalendar()}
     </div>
  )
}

const CoachPicker = ({ onCoachSelect }) => {
  const { data: coachUsers, error, loading } = useSWR(`http://localhost:3001/api/v1/users?user_type=coach`, fetcher)
  const coachIdInputRef = useRef()

  if (!coachUsers) {
    return null
  }

  const coachMap = coachUsers.reduce((obj, coachUser) => {
    obj[coachUser.id] = coachUser
    return obj;
  }, {});

  console.log('acac coachMap', coachMap)

  if (error) {
    return error
  }

  if (loading) {
    return loading
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const coachId = coachIdInputRef.current.value
    onCoachSelect(coachMap[coachId])
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Select a coach:</label>
      <select ref={coachIdInputRef} name="coaches" id="coaches">
        {coachUsers.map(coachUser => <option value={coachUser.id}>{`${coachUser.first_name} ${coachUser.last_name}`}</option>)}
      </select>
      <input type="submit" value="View calendar"/>
    </form>
  )
}
export default Student;