export const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const getTimeSlots = async (userId, date, excludeBooked = false) => {
    // this should already be at beginning of day, but still setting as 0 to be safe
    if (!date) {
        return null
    }

    const fromTime = new Date(date.getTime())
    fromTime.setHours(0, 0, 0, 0)
    // set to end of day
    const toTime = new Date(date.getTime())
    toTime.setHours(23, 59, 59, 59)

    return fetch(`http://localhost:3001/api/v1/time_slots?user_id=${userId}&from_time=${fromTime.toISOString()}&to_time=${toTime.toISOString()}&exclude_booked=${excludeBooked}`, {
        method: 'GET',
    }).then(res => res.json())
}

export const getBookings = async (userId, coachUserId, date) => {
    // this should already be at beginning of day, but still setting as 0 to be safe
    if (!date) {
        return null
    }

    // TODO: DRY

    const fromTime = new Date(date.getTime())
    fromTime.setHours(0, 0, 0, 0)
    // set to end of day
    const toTime = new Date(date.getTime())
    toTime.setHours(23, 59, 59, 59)

    return fetch(`http://localhost:3001/api/v1/bookings?coach_user_id=${coachUserId}&user_id=${userId}&from_time=${fromTime.toISOString()}&to_time=${toTime.toISOString()}`, {
        method: 'GET',
    }).then(res => res.json())
}