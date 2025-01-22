import React from "react";
import "../CSS/User_Css/adminUserPage.css";

const adminUser= () => {
  return (
    <div className="adminuser">
        <div className="searchUser">
            <input type="search" placeholder="Search for ..." className="search"/>
            <img src=".../public/logos/searchadmin.svg" alt="" className="searchIcon"/>
        </div>
        <div className="userTable">
            <table className="table">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Gender</th>
                        <th>Age</th>
                        <th>City</th>
                        <th>Country</th>
                        <th>Edit</th>
                        <th>BAN</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>John Doe</td>
                        <td>0YK8S@example.com</td>
                        <td>Male</td>
                        <td>25</td>
                        <td>New York</td>
                        <td>United States</td>
                        <td>
                            <div className="edit"> EDIT</div>
                        </td>
                        <td>
                            <div className="ban"> BAN</div>
                        </td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>John Doe</td>
                        <td>0YK8S@example.com</td>
                        <td>Male</td>
                        <td>25</td>
                        <td>New York</td>
                        <td>United States</td>
                        <td>
                            <div className="edit"> EDIT</div>
                        </td>
                        <td>
                            <div className="ban"> BAN</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    
  );
};

export default adminUser;
