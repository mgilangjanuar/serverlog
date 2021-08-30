import axios from 'axios'
import useSWR from 'swr'

export function useAuthUrls(): { data: any, isLoading: boolean, error: any } {
  const { data, error } = useSWR(`${process.env.REACT_APP_API_URL}/api/v1/auth/urls`,
    url => axios.get(url).then(res => res.data))
  return {
    data,
    isLoading: !error && !data,
    error
  }
}