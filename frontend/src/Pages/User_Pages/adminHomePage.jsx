import React from "react";
import "../CSS/User_Css/adminHomePage.css";

const adminHomePage = () => {
  return (
    <div className="adminBody flex">

        <div className="adminMain">
            <div className="adminUp flex">
                <img src=".../public/logos/image.png" alt="" width="50px"/>
                <div className="adminSearchbar">
                    <img src=".../public/logos/search.svg" alt=""/>
                    <input type="text" placeholder="Search Activities, messages" className="adminSearch"/>
                </div>
            </div>
            <div className="adminmiddle flex">
                <div className="adminMap">
                    <img src=".../public/logos/map.png" alt="" className="adminMapImage"/>
                </div>
                <div className="adminRight">
                    <div className="rate">
                        <img src=".../public/logos/foot.svg" alt=""/>
                        Rate the Street
                    </div>
                    <div className="wal">
                        <div className="walkab">
                            <img src=".../public/logos/foot.svg" alt=""/>
                            Rate the Walkability
                        </div>
                    </div>
                </div>
            </div>
            <div className="adminDown flex">
                <div className="cards flex">
                    <div className="cardImage">
                        <img src=".../public/logos/doc.svg" alt="" className="cardLogo"/>
                        <img src=".../public/logos/menu.svg" alt=""/>
                    </div>
                    <div className="cardName">
                        Uploads Photos/Videos
                    </div>
                    Progress
                    <progress value="55" max="100"></progress>
                </div>
                <div className="cards flex">
                    <div className="cardImage">
                        <img src=".../public/logos/running.svg" alt="" className="cardLogo"/>
                        <img src=".../public/logos/menu.svg" alt=""/>
                    </div>
                    <div className="cardName">
                        See the Heatmap
                    </div>
                    Progress
                    <progress value="75" max="100"></progress>
                </div>
                <div className="cards flex">
                    <div className="cardImage">
                        <img src=".../public/logos/foot.svg" alt="" fill="#5634eb" className="cardLogo"/>
                        <img src=".../public/logos/menu.svg" alt=""/>
                    </div>
                    <div className="cardName">
                        With Heatmap Plan Your Walk
                    </div>
                    Progress
                    <progress value="75" max="100"></progress>
                </div>
            </div>

        </div>
        <div className="adminmainleft">
            <div className="adminProfile">
                <div className="Profile">
                    <img src=".../public/logos/profile.svg" alt=""/>
                    ADMIN
                </div>
                <div className="setting">
                    <div className="profileSettings">
                        <img src=".../public/logos/target.svg" alt="na"/>
                        Goals
                    </div>
                    <div className="profileSettings">
                        <img src=".../public/logos/users.svg" alt="na"/>
                        Users
                    </div>
                    <div className="profileSettings">
                        <img src=".../public/logos/map.svg" alt=""/>
                        Maps
                    </div>
                    <div className="profileSettings">
                        <img src=".../public/logos/setting.svg" alt=""/>
                        Settings
                    </div>
                </div>
            </div>
        </div>
    </div>

    
  );
};

export default adminHomePage;
