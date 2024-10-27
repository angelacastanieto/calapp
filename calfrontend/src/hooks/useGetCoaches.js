import useSWR from "swr"
import fetcher from "../utils/fetcher"

export const useGetCoaches = () => useSWR(`http://localhost:3001/api/v1/users?user_type=coach`, fetcher)

export default useGetCoaches