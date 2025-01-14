import React from "react";
import "../../../CSS/User_Css/Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="main-footer ">
      <div className="footer-container">
        <div className="footer-legend">
          <h3>Legend</h3>
          <table>
            <tbody>
              <tr>
                <td className="t1">1. Humans</td>
                <td className="t6">6. Cables</td>
              </tr>
              <tr>
                <td className="t2">2. Vehicles</td>
                <td className="t7">7. Water</td>
              </tr>
              <tr>
                <td className="t3">3. Garbage</td>
                <td className="t8">8. Broken Pavement</td>
              </tr>
              <tr>
                <td className="t4">4. Stores</td>
                <td className="t9">9. Crossing</td>
              </tr>
              <tr>
                <td className="t5">5. Animals</td>
                <td className="t10">10. Other</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="footer-contact">
          <h3>Contact us</h3>
          <p>
            <b>Email:</b> joemama@gmail.com
          </p>
          <p>
            <b>Phone:</b> 696969669
          </p>
          <p>
            <b>Address:</b> Lorem ipsum dolor sit amet.
          </p>
        </div>

        <div className="footer-socials">
          <h3>Socials</h3>
          <p>
            <a href="https://instagram.com">Instagram</a>
          </p>
          <p>
            <a href="https://facebook.com">Facebook</a>
          </p>
          <p>
            <a href="https://twitter.com">Twitter</a>
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
