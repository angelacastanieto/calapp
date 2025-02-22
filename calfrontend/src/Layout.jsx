import React from 'react';
import { Outlet } from 'react-router-dom';
import useGetAllUsers from './hooks/useGetAllUsers';

const Layout = () => {
  const { data: allUsers, error, loading } = useGetAllUsers()

  if (loading) {
    return '...Loading'
  }

  if (error) {
    return 'Error loading users'
  }

  if (!allUsers) {
    return null
  }
  const students = []
  const coaches = []

  allUsers.forEach(user => {
    if (user.user_type === 'student') {
      students.push(user)
    } else {
      coaches.push(user)
    }
  })

  return (
    <div className="flex flex-row h-screen">
      <header className="bg-gray-200 p-5 w-[250px]">
        <h1 className="text-2xl font-bold text-fuchsia-950">Scheduler App</h1>
        <nav className="flex flex-col space-y-2">
          <a href="/">Home</a>
          <p className="text-xl font-semibold">Example Coaches</p>

          <ul className="pl-2 hover:text-fuchsia-950">
            {
              coaches.map(coach => <li key={coach.id}><a href={`/users/${coach.id}`}>{coach.first_name} {coach.last_name}</a></li>)
            }
          </ul>

          <p className="text-xl font-semibold">Example students</p>
          <ul className="pl-2 hover:text-fuchsia-950">
            {
              students.map(student => <li key={student.id}><a href={`/users/${student.id}`}>{student.first_name} {student.last_name}</a></li>)
            }
          </ul>
        </nav>
      </header>
      <main className="py-8 px-24">
        <Outlet />
      </main>
    </div>
  )
}


export default Layout;