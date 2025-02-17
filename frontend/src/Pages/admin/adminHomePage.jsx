import React, { useState } from "react";
import "../../CSS/User_Css/adminHomePage.css";

const AdminHomePage = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "User 1",
      images: ["image1.png", "image2.png", "image3.png"],
    },
    {
      id: 2,
      name: "User 2",
      images: ["image4.png", "image5.png"],
    },
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const approveImages = (userId) => {
    // Logic to approve images
    console.log(`Approved images for user ${userId}`);
  };

  const viewImages = (user) => {
    setSelectedUser(user);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  const showNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedUser.images.length);
  };

  const showPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + selectedUser.images.length) % selectedUser.images.length);
  };

  return (
    <div className="adminBody">
      <div className="adminMain">
        <div className="adminUp">
          <img src=".../public/logos/image.png" alt="" width="50px" />
          <div className="adminSearchbar">
            <img src=".../public/logos/search.svg" alt="" />
            <input
              type="text"
              placeholder="Search Activities, messages"
              className="adminSearch"
            />
          </div>
        </div>
        <div className="adminmiddle">
          <div className="adminMap">
            <img
              src=".../public/logos/map.png"
              alt=""
              className="adminMapImage"
            />
          </div>
        </div>
        <div className="adminDown">
          {users.map((user) => (
            <div className="userCard" key={user.id}>
              <div className="userName">{user.name}</div>
              <div className="userImages">
                {user.images.map((image, index) => (
                  <img
                    src={`.../public/logos/${image}`}
                    alt=""
                    key={index}
                    className="userImage"
                  />
                ))}
              </div>
              <button
                className="approveButton"
                onClick={() => approveImages(user.id)}
              >
                Approve
              </button>
              <button
                className="viewButton"
                onClick={() => viewImages(user)}
              >
                View
              </button>
            </div>
          ))}
        </div>
      </div>
      {selectedUser && (
        <div className="modal">
          <div className="modalContent">
            <span className="closeButton" onClick={closeModal}>&times;</span>
            <h2>{selectedUser.name}'s Images</h2>
            <div className="modalImages">
              <button className="navButton" onClick={showPreviousImage}>Previous</button>
              <img
                src={`.../public/logos/${selectedUser.images[currentImageIndex]}`}
                alt=""
                className="modalImage"
              />
              <button className="navButton" onClick={showNextImage}>Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHomePage;