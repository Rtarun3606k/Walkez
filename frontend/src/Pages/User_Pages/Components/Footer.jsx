import React from "react";
import "../../../CSS/User_Css/Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="main-footer">
      <div className="footer-container xs:text-[0.5rem]">
        

        <div className="footer-contact ">
          <h3>Contact us</h3>
          <p className="xs:text-[0.75rem]">
            <b>Email:</b> walkezwalk@gmail.com
          </p>
          <p className="xs:text-[0.75rem]">
            <b>Phone:</b> 696969669
          </p>
          <p className="xs:text-[0.75rem]">
            <b>Address:</b> Lorem ipsum dolor sit amet.
          </p>
        </div>

        <div className="footer-socials  ">
          <h3 className="xs:text-[0.75rem] xs:pb-0">Socials</h3>
          <p>
            <a href="https://www.instagram.com/invites/contact/?igsh=1fbtk2hmxuzk5&utm_content=vxccn7e">Instagram</a>
          </p>
          <p>
            <a href="https://youtube.com/@walkez?si=Jp9rAz3xx5hc9f68">Youtube</a>
          </p>
          <p>
            <a href="https://x.com/walkezwalk?t=Skd97YZFBYCTp5ZW_Uq-xw&s=08">Twitter</a>
          </p>
        </div>
      </div>

      <div className="footer-copy">
        <p>&copy; {currentYear} Walk-ez. All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
