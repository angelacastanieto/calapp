import useSWR from 'swr'
import fetcher from "../utils/fetcher"

export const useGetAllUsers = () => useSWR(`http://localhost:3001/api/v1/users`, fetcher)


export default useGetAllUsers