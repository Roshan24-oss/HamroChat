import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { serverUrl } from "../main"
import { setUserData } from "../redux/userSlice"

const useCurrentUser = () => {
  const dispatch = useDispatch()
  const userData= useSelector(state => state.user.userData)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/user/current`,
          { withCredentials: true }
        )
        dispatch(setUserData(result.data))
      } catch (error) {
        console.log(error)
      }
    }

    fetchUser()
  }, [dispatch]) // ✅ safe dependency
}

export default useCurrentUser
