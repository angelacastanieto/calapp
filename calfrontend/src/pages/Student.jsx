import React from 'react';
import { fetcher } from '../fetchers/fetchers'
import useSWR from 'swr'

export const Student = ({ user }) => {
  const { data, error, timeSlotsIsLoading } = useSWR(`http://localhost:3001/api/v1/users/${user.id}`, fetcher)
  if (error || data?.error) return <div>Error: {error.message || data?.error}</div>

    return (
      <div>
        <h2>Student example</h2>
        <h3>Hi {user.first_name}</h3>

      </div>
    )


}

export default Student;