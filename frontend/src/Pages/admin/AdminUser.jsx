import React, { useEffect, useState } from "react";
import { admin_get_cookies_data } from "../../Utility/AdminAuth";

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const requestData = async () => {
      const apiUrl = import.meta.env.VITE_REACT_APP_URL;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin_get_cookies_data(false, true)}`,
        },
      };

      try {
        const response = await fetch(`${apiUrl}/admin_user/getUsers`, options);
        const data = await response.json();
        if (response.status === 200) {
          setUsers(data);
        } else {
          setError("Error fetching users");
        }
      } catch (error) {
        setError("Error fetching users");
      }
    };

    requestData();
  }, []);

  const handleBanUser = (userId) => {
    // Implement the logic to ban the user
    console.log(`Ban user with ID: ${userId}`);
  };

  const handleDeleteUser = (userId) => {
    // Implement the logic to delete the user
    console.log(`Delete user with ID: ${userId}`);
  };

  return (
    <div className="adminuser">
      <div className="searchUser">
        <input type="search" placeholder="Search for ..." className="search" />
        <img
          src=".../public/logos/searchadmin.svg"
          alt=""
          className="searchIcon"
        />
      </div>
      {error && <div className="error">{error}</div>}
      <div className="userTable">
        <table className="table">
          <thead>
            <tr>
              <th className="text-red-500">User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Age</th>
              <th>City</th>
              <th>Country</th>
              <th>Edit</th>
              <th>BAN</th>
              <th>DELETE</th>
            </tr>
          </thead>
          <tbody className="text-black">
            {users.map((user) => (
              <tr
                key={`${user.user_firebase_auth_id || "unknown"}-${
                  user.user_psql_id || "unknown"
                }-${user.email || "unknown"}`}
                className="text-black"
              >
                <td className="text-black">
                  {user.user_firebase_auth_id || user.user_psql_id}
                </td>
                <td className="text-black">
                  {user.displayName || "N/A"} sdsad
                </td>
                <td className="text-black">{user.email}</td>
                <td className="text-black">{user.gender || "N/A"}</td>
                <td className="text-black">{user.age || "N/A"}</td>
                <td className="text-black">{user.city || "N/A"}</td>
                <td className="text-black">{user.country || "N/A"}</td>
                <td className="text-black">
                  <div className="edit">EDIT</div>
                </td>
                <td>
                  <button
                    className="bg-red-500"
                    onClick={() =>
                      handleBanUser(
                        user.user_firebase_auth_id || user.user_psql_id
                      )
                    }
                  >
                    BAN
                  </button>
                </td>
                <td>
                  <button
                    className=" bg-red-800"
                    onClick={() =>
                      handleDeleteUser(
                        user.user_firebase_auth_id || user.user_psql_id
                      )
                    }
                  >
                    DELETE
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUser;
