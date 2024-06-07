import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/v1/profile/me");
        setUser(response.data.user);
      } catch (error) {
        console.error("Fetching profile failed", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <h1>Profile</h1>
          <p>First Name: {user.firstname}</p>
          <p>Last Name: {user.lastname}</p>
          <p>Email: {user.email}</p>
          <p>Phone Number: {user.phone_number}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
