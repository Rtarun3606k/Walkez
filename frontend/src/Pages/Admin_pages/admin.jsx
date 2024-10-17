import React from 'react';
import './admin.css'; // Assuming you place your admin.css in the same folder

const AdminDashboard = () => {
  return (
    <div className="App">
      {/* Sidebar */}
      <div className="sidebar">
        <a href="#">Dashboard</a>
        <a href="#">User Management</a>
        <a href="#">Content Moderation</a>
        <a href="#">Heat Map</a>
        <a href="#">Security Alerts</a>
        <a href="#">Feedback</a>
        <a href="#">Settings</a>
      </div>

      {/* Content Area */}
      <div className="content">
        <h2>Admin Dashboard</h2>

        {/* Cards for Quick Metrics */}
        <div className="row">
          <div className="col-md-3">
            <div className="card">
              <div className="card-title">Total Users</div>
              <div className="card-number">1,234</div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card">
              <div className="card-title">Photos Uploaded</div>
              <div className="card-number">2,567</div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card">
              <div className="card-title">Flagged Incidents</div>
              <div className="card-number">120</div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card">
              <div className="card-title">Active Streets</div>
              <div className="card-number">98</div>
            </div>
          </div>
        </div>

        {/* User Management Table */}
        <h3>User Management</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>john@example.com</td>
              <td>2024-08-16</td>
              <td>
                <button className="btn btn-warning btn-sm">Suspend</button>
                <button className="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
            <tr>
              <td>Jane Smith</td>
              <td>jane@example.com</td>
              <td>2024-07-10</td>
              <td>
                <button className="btn btn-warning btn-sm">Suspend</button>
                <button className="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
