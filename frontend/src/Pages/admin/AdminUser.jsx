import React, { useEffect, useState } from "react";
import { admin_get_cookies_data } from "../../Utility/AdminAuth";
import { toast } from "react-toastify";

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_REACT_APP_URL;

  useEffect(() => {
    if (!admin_get_cookies_data(false, true)) {
      window.location.href = "/admin";
    }

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

  const handleBanUser = async (userId) => {
    // Implement the logic to ban the user
    const requestbannUser = await fetch(`${apiUrl}/admin_user/banUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${admin_get_cookies_data(false, true)}`,
      },
      body: JSON.stringify({ user_id: userId }),
    });

    const data = await requestbannUser;

    if (requestbannUser.ok) {
      console.log("User banned");
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (
            user.user_firebase_auth_id === userId ||
            user.user_psql_id === userId
          ) {
            return { ...user, banned: !user.banned };
          }
          return user;
        })
      );
      toast.success("User banned");
    } else {
      console.log(data, "data");
      toast.error("Error banning user");
      console.log("Error banning user");
    }
  };

  const handleDeleteUser = async (userId) => {
    // Implement the logic to delete the user
    const requestDeleteUser = await fetch(`${apiUrl}/admin_user/deleteUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${admin_get_cookies_data(false, true)}`,
      },
      body: JSON.stringify({ user_id: userId }),
    });

    const data = await requestDeleteUser;
    if (requestDeleteUser.ok) {
      console.log("User deleted");
      setUsers((prevUsers) =>
        prevUsers.filter(
          (user) =>
            user.user_firebase_auth_id !== userId &&
            user.user_psql_id !== userId
        )
      );
      toast.success("User deleted");
    } else {
      console.log(data, "data");
      toast.error("Error deleting user");
      console.log("Error deleting user");
    }

    console.log(`Delete user with ID: ${userId}`);
  };

  return (
    <div className="adminuser bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen text-white p-6">
      {error && (
        <div className="error bg-red-500 text-white p-4 rounded-md mb-4">
          {error}
        </div>
      )}
      <div className="userTable mt-10">
        <table className="table-auto w-full border-collapse border border-gray-700 shadow-lg">
          <thead>
            <tr className="bg-gradient-to-r from-gray-700 to-gray-600 text-white">
              <th className="p-4 border border-gray-700">User ID</th>
              <th className="p-4 border border-gray-700">Name</th>
              <th className="p-4 border border-gray-700">Email</th>
              <th className="p-4 border border-gray-700">Country</th>
              <th className="p-4 border border-gray-700">Edit</th>
              <th className="p-4 border border-gray-700">BAN</th>
              <th className="p-4 border border-gray-700">DELETE</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={`${user.user_firebase_auth_id || "unknown"}-${
                  user.user_psql_id || "unknown"
                }-${user.email || "unknown"}`}
                className="bg-gray-800 hover:bg-gray-700 transition duration-200"
              >
                <td className="p-4 border border-gray-700 text-center">
                  {user.user_firebase_auth_id || user.user_psql_id}
                </td>
                <td className="p-4 border border-gray-700 text-center">
                  {user.displayName || "N/A"}
                </td>
                <td className="p-4 border border-gray-700 text-center">
                  {user.email}
                </td>
                <td className="p-4 border border-gray-700 text-center">
                  {user.country || "India"}
                </td>
                <td className="p-4 border border-gray-700 text-center">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md">
                    EDIT
                  </button>
                </td>
                <td className="p-4 border border-gray-700 text-center">
                  <button
                    className={`py-1 px-3 rounded-md ${
                      user.banned
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                    } text-white`}
                    onClick={() =>
                      handleBanUser(
                        user.user_firebase_auth_id || user.user_psql_id
                      )
                    }
                  >
                    {user.banned ? "UNBAN" : "BAN"}
                  </button>
                </td>
                <td className="p-4 border border-gray-700 text-center">
                  <button
                    className="bg-red-800 hover:bg-red-900 text-white py-1 px-3 rounded-md"
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
