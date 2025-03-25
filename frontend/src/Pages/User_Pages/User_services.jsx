import React from "react";
import "../../CSS/User_Css/Service.css";

const User_services = () => {
  return (
    <>
      <div className="flex1 align -ml-[10%] w-[120%] p-0  -mt-[2%] -mb-[2%] custom-368:-ml-[30%] xs:-ml-[25%] xs:w-[39%]">
        <div className="body_services flex justify-center items-center xs:text-[0.75rem] xs:pr-[15%]">
          <div id="header">
            <h1>Our Services</h1>
            <p className="xs:text-[0.75rem]">
              Making walking easier, safer, and more enjoyable in cities like
              Bengaluru.
            </p>
          </div>

          <div id="services" >
            <h2>What We Offer</h2>

            <div className="service">
              <h3>Street Walkability Ratings</h3>
              <p >
                Rate streets on safety, cleanliness, and sidewalk quality. Help
                others choose the best routes in the city.
              </p>
            </div>

            <div className="service">
              <h3>Photo & Video Uploads</h3>
              <p>
                Upload street images and videos to provide a clearer picture of
                walking conditions.
              </p>
            </div>

            <div className="service">
              <h3>Real-Time Walkability Heatmap</h3>
              <p>
                View the safest and most walkable streets in your area with
                real-time updates from user contributions.
              </p>
            </div>

            <div className="service">
              <h3>AI-Powered Walkability Scores</h3>
              <p>
                Our AI evaluates street conditions to give accurate walkability
                scores based on user data.
              </p>
            </div>

            <div className="service">
              <h3>Pedestrian Navigation</h3>
              <p>
                Get walking directions focused on safety and convenience with
                MapQuest-powered navigation tailored for pedestrians.
              </p>
            </div>

            <div className="service">
              <h3>Community Insights</h3>
              <p>
                Contribute to a growing community of walkability insights to
                improve walking experiences for all.
              </p>
            </div>

            <div className="service">
              <h3>Accessibility Features</h3>
              <p>
                Find accessible streets for people with disabilities, including
                smooth surfaces and wheelchair ramps.
              </p>
            </div>
          </div>

          <div id="why-choose">
            <h2>Why Choose Walkez?</h2>
            <ul>
              <li>
                Reliable, user-driven data and AI analysis for accurate street
                information.
              </li>
              <li>Real-time updates to avoid disruptions during your walks.</li>
              <li>
                Community-centered platform, improving the walking experience
                for everyone.
              </li>
            </ul>
          </div>

          <div id="get-involved" className="width-100">
            <h2>Ready to Walk with Ease?</h2>
            <p class="get-involved-para">
              Explore the city with Walkez. Whether you need a scenic route, a
              quick path, or an accessible street, our services have you
              covered. Download the Wakez app today and start exploring.
            </p>
          </div>

          <div id="footer">
            <h2>Contact Us</h2>
            <p>
              Email:{" "}
              <a href="mailto:your-email@wakez.com">walkezwalk@gmail.com</a>
            </p>
            <p>
              Follow Us:{" "}
              <a href="https://www.linkedin.com/company/walkez/">Linkedin</a>
            </p>
            <p>&copy; 2024 Walkez. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default User_services;
