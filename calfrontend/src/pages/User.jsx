import React from 'react';
import { useParams } from 'react-router-dom';
import { userIsCoach } from '../utils/utils'
import Coach from './Coach'
import Student from './Student'
import useGetUser from '../hooks/useGetUser';

const User = () => {
  let { userId } = useParams();

  // todo turn into hook in hooks file
  const { data: user, error, loading } = useGetUser(userId)

  if (error || user?.error) return <div>Error loading user: {error?.message || user?.error}</div>
  if (loading) return <div>loading...</div>

  if (!user) {
    return null
  }

  const isCoach = userIsCoach(user.user_type)

  return (
    <div>
      <h1 className="text-xl font-semibold">{isCoach ? 'Coach' : 'Student'} Portal</h1>
      {isCoach ? <Coach user={user} /> : <Student user={user} />}
    </div>
  )
}

export default User;