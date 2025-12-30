import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { serverUrl } from "../main";
import { setOtherUsers } from "../redux/userSlice";

const useGetOtherUsers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/user/others`,
          { withCredentials: true }
        );
        dispatch(setOtherUsers(result.data));
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, [dispatch]);
};

export default useGetOtherUsers;
