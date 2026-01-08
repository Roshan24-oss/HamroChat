import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../main";
import { setUserData } from "../redux/userSlice";

const useCurrentUser = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);

  useEffect(() => {
    if (userData) return; // already loaded

    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
        });
        dispatch(setUserData(result.data)); // update Redux immediately
      } catch (error) {
        console.error("Failed to fetch current user:", error);
        dispatch(setUserData(null)); // failed, ensure we don't block routes
      }
    };

    fetchUser();
  }, [dispatch, userData]);
};

export default useCurrentUser;
