import React from 'react'
import "../../CSS/User_Css/About.css";

const User_about = () => {
    return (
        <>
            <div className="main">
                <div style={{ justifyContent: "center", backgroundColor: "#f5f5f5" }} className='body'>
                        <div id="header">
                            <h1>Welcome to Wakez</h1>
                        </div>
                    <div id="section">

                        <div id="mission">
                            <h2>Our Mission</h2>
                            <p>Wakez is here to transform cities into more pedestrian-friendly environments by offering insights and tools to ensure safe, enjoyable walking experiences for everyone.</p>
                        </div>

                        <div id="problem">
                            <h2>The Problem We’re Solving</h2>
                            <p>In cities like Bengaluru, walkability is often a challenge. Sidewalks can be unpredictable, streets congested, and pedestrian safety overlooked. Wakez aims to address these issues, making walking easier and more accessible.</p>
                        </div>

                        <div id="how-it-works">
                            <h2>How Wakez Works</h2>
                            <p>Wakez empowers users to rate streets, share images and videos, and provide feedback on walkability. Our AI model processes this data to give real-time walkability scores, helping users find the most walkable paths quickly and easily.</p>
                        </div>

                        <div id="features">
                            <h2>Unique Features</h2>
                            <ul>
                                <li>Real-time heatmap showing walkable routes</li>
                                <li>Community-driven ratings and feedback</li>
                                <li>AI-powered walkability scores</li>
                                <li>MapQuest navigation for reliable directions</li>
                            </ul>
                        </div>

                        <div id="vision">
                            <h2>Our Vision</h2>
                            <p>We aim to create cities where walking is a preferred mode of transport. Wakez is starting in Bengaluru, but we envision expanding to cities worldwide, promoting walkable, sustainable urban spaces.</p>
                        </div>

                        <div id="get-involved">
                            <h2>Get Involved</h2>
                            <p>Download the app, rate your street, and join us in making Bengaluru more walkable, one step at a time.</p>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default User_about