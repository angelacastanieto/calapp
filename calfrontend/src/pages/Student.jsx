import React, { useRef, useState } from 'react';
import CoachingCalendar from '../components/CoachingCalendar/CoachingCalendar';
import useGetCoaches from '../hooks/useGetCoaches';

export const Student = ({ user }) => {
  const [selectedCoach, setSelectedCoach] = useState()

  return (
    <div>
      <h3 className="text-lg">Hi {user.first_name}!</h3>
      <div className="flex flex-col space-y-4s">
        <CoachPicker onCoachSelect={(value) => setSelectedCoach(value)} />
        {selectedCoach && <CoachingCalendar user={user} coachUserId={selectedCoach.id} isBooker />}
      </div>
     </div>
  )
}

const CoachPicker = ({ onCoachSelect }) => {
  const { data: coachUsers, error, loading } = useGetCoaches()
  const coachIdInputRef = useRef()

  if (!coachUsers) {
    return null
  }

  const coachMap = coachUsers.reduce((obj, coachUser) => {
    obj[coachUser.id] = coachUser
    return obj;
  }, {});

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
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Select a coach to view their calendar.</label><br/>
          <select className="border mr-4 my-2 p-1 rounded border-gray-700 bg-gray-300" ref={coachIdInputRef} name="coaches" id="coaches">
            {coachUsers.map(coachUser => <option value={coachUser.id}>{`${coachUser.first_name} ${coachUser.last_name}`}</option>)}
          </select>
          <input className="border border-black p-1 rounded hover:cursor-pointer bg-cyan-200 active:bg-cyan-700" type="submit" value="View calendar"/>
        </div>
      </form>
    </div>
  )
}
export default Student;