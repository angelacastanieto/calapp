import useSWR from 'swr'
import fetcher from "../utils/fetcher"

export const useGetUser = (userId) => useSWR(`http://localhost:3001/api/v1/users/${userId}`, fetcher)

export default useGetUser