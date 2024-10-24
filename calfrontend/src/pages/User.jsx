import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr'
import { userIsCoach } from '../utils/utils'
import Coach from './Coach'
import Student from './Student'
import { fetcher } from '../fetchers/fetchers'

const User = () => {
  let { userId } = useParams();

  const { data: user, error, loading } = useSWR(`http://localhost:3001/api/v1/users/${userId}`, fetcher)

  if (error || user?.error) return <div>Error loading user: {error?.message || user?.error}</div>
  if (loading) return <div>loading...</div>

  if (!user) {
    return null
  }

  if (userIsCoach(user.user_type)) {
    return <Coach user={user} />
  }

  return <Student user={user} />
}

export default User;