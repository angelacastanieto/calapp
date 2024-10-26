import useSWRMutation from 'swr/mutation'

// const createTimeSlot = async (url, { arg }) => {
//     return fetch(url, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(arg)
//     }).then(res => {
//       if (!res.error) {
//         refetchTimeSlots()
//       }
//       return res.json()
//     })
//   }

const useCreateTimeSlot = ({ onCreateSuccess }) => useSWRMutation(
    'http://localhost:3001/api/v1/time_slots/', 
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

export default useCreateTimeSlot