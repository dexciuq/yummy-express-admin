import { useAuth } from "../../contexts/AuthContext";

export default function Profile() {
  const { user } = useAuth();
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
