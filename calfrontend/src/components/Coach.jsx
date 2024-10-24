import React from 'react';
import useSWR from 'swr'
import { fetcher } from '../fetchers/fetchers'

export const Coach = ({ user }) => {
  const {
    data: timeSlots, error, loading } = useSWR(`http://localhost:3001/api/v1/users/${user.id}`, fetcher)
    
  if (error || timeSlots?.error) return <div>Error loading coach time slots: {error?.message || timeSlots?.error}</div>
  if (loading) return <div>loading...</div>
  return (
    <div>
      <h2>Coach example</h2>
      <h3>Hi {user.first_name}</h3>

    </div>
  )
}

export default Coach;