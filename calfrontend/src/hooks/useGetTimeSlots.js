import useSWR from "swr"

const getTimeSlots = async (requesterUserId, coachUserId, date) => {
    if (!date) {
        return null
    }

    const fromTime = new Date(date.getTime())
    // set to beginning of day
    fromTime.setHours(0, 0, 0, 0)
    // set to end of day
    const toTime = new Date(date.getTime())
    toTime.setHours(23, 59, 59, 59)

    return fetch(`http://localhost:3001/api/v1/time_slots?requester_user_id=${requesterUserId}&creator_user_id=${coachUserId}&from_time=${fromTime.toISOString()}&to_time=${toTime.toISOString()}&include_bookings=true&include_creator=true`, {
        method: 'GET',
    }).then(res => res.json())
}

export const useGetTimeSlots = (userId, coachUserId, selectedDate) => {
    return useSWR(selectedDate, () => getTimeSlots(userId, coachUserId, selectedDate))
}


export default useGetTimeSlots