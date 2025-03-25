import React from "react";
import "../../CSS/User_Css/Contact.css";

const Contact = () => {
  return (
    <>
      <div className="flex1 align -ml-[10%] w-[120%] p-0 -mt-[2%] -mb-[2%] custom-368:-ml-[30%]">
        <div className="body_contact flex justify-center items-center xs:w-[95%] xs:mr-[5%] xs:text-[0.7rem]">
          <div id="header" className="header_contact">
            <h1 className="" >Contact Us</h1>
            <p className="">
              We are here to help you. Reach out to us for any queries or support.
            </p>
          </div>

          <div id="contact-details">
            <h2>Get in Touch</h2>

            <div className="contact-item">
              <h3>Email</h3>
              <p>
                Email us at:{" "}
                <a href="mailto:walkezwalk@gmail.com">walkezwalk@gmail.com</a>
              </p>
            </div>

            <div className="contact-item">
              <h3>Follow Us</h3>
              <p>
                Connect with us on:{" "}
                <a href="https://www.linkedin.com/company/walkez/">LinkedIn</a>
              </p>
            </div>

            <div className="contact-item">
              <h3>Address</h3>
              <p>
                PESU Ec Campus, Electronic City, Bengaluru, India
              </p>
            </div>
          </div>

          <div id="team">
            <h2>Our Team</h2>
            <div className="team-member">
              <h3>Srujan</h3>
              <p>Email: <a href="mailto:kashyapsrujan12@gmail.com">kashyapsrujan12@gmail.com</a></p>
            </div>
            <div className="team-member">
              <h3>Vaibhav</h3>
              <p>Email: <a href="mailto:vaibhav762005@gmail.com">vaibhav762005@gmail.com</a></p>
            </div>
            <div className="team-member">
              <h3>Yaashvin</h3>
              <p>Email: <a href="mailto:yaashvinsv@gmail.com">yashvinsv@gmail.com</a></p>
            </div>
            <div className="team-member">
              <h3>Tarun</h3>
              <p>Email: <a href="mailto:r.tarunnayaka25042005@gmail.com">r.tarunnayaka25042005@gmail.com</a></p>
            </div>
          </div>

          <div id="footer">
            <h2>Stay Connected</h2>
            <p>
              Follow us on social media for the latest updates and news.
            </p>
            <p>&copy; 2024 Walkez. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;