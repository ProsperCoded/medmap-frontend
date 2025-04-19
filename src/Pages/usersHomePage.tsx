// import { useEffect } from "react";
import { useAuth } from "../context/authContext";
// import { getSession } from "../lib/utils";

const HomePage = () => {
  const { logout } = useAuth();
  return (
    <div>
      Food
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

export default HomePage;
