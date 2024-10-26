import React, { useState } from 'react';
import CoachingCalendar from '../components/CoachingCalendar';

export const Coach = ({ user }) => {

  return (
    <div>
      <h3 className="text-lg">Hi {user.first_name}, here is your calendar</h3>
      <p className="text-md">Click a date to create or view time slots</p>
      <CoachingCalendar user={user} coachUserId={user.id} isCreator />
     </div>
  )
}

export default Coach;