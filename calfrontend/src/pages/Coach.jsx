import React, { useState } from 'react';
import CoachingCalendar from '../components/CoachingCalendar';

export const Student = ({ user }) => {

  return (
    <div>
      <h2>Coach example</h2>
      <h3>Hi {user.first_name}</h3>
      Here is your calendar
      <CoachingCalendar user={user} coachUserId={user.id} isCreator />
     </div>
  )
}

export default Student;