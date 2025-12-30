import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../main";
import { setUserData } from "../redux/userSlice";

const useCurrentUser = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);

  useEffect(() => {
    if (userData) return; // 🚀 already loaded, skip API call

    const fetchUser = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/user/current`,
          { withCredentials: true }
        );
        dispatch(setUserData(result.data));
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [dispatch, userData]);
};

export default useCurrentUser;
