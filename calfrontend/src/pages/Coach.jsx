import React, { useState } from 'react';
import CoachingCalendar from '../components/CoachingCalendar';

export const Coach = ({ user }) => {

  return (
    <div>
      <h2>Coach Portal</h2>
      <h3>Hi {user.first_name}</h3>
      Here is your calendar
      <CoachingCalendar user={user} coachUserId={user.id} isCreator />
     </div>
  )
}

export default Coach;