// const createBooking = async (url, { arg }) => {
//     return fetch(url, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(arg)
//     }).then(res => {
//         if (!res.error) {
//             refetchTimeSlots()
//             refetchBookings()
//         }
//         return res.json()
//     })
// }

import useSWRMutation from 'swr/mutation'

const useCreateBooking = ({ onCreateSuccess }) => useSWRMutation(
    'http://localhost:3001/api/v1/bookings/',
    async (url, { arg }) => {
        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(arg)
        }).then(res => {
            if (!res.error) {
                onCreateSuccess()
            }
            return res.json()
        })
    }
)

export default useCreateBooking