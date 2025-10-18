/* This file consists of the code of The GraceApp, with a quick look into the basic functionalities, 
benefits and the coming soon feature of the app.  
*/

import React from "react";
import './Grace_App.css';

function GraceApp() {
    return (
        <div className="grace-app-page">
            <h1 className="grace-app-title">About Grace App</h1>
            <p>
                Welcome to <b> Grace App </b>- it is a centralized digital platform which is built specifically to
                support NGOs across India, whether they're large foundations or small grassroots
                efforts. Our mission is to simplify, connect, and empower , those in need.
            </p>
            <h2 className="grace-app-section-title"> What is there to offer- basic functionalities </h2>
            <ul className="grace-app-list">
                <li>Quick Task Management: We can add, edit, and complete tasks on the go,
                    without having the need to visit website everytime.</li>
                <li>Reminders: Notifications to never miss an important event.</li>
                <li>Sync Across Devices: Access your data instantly on all your devices.</li>
                <li> Faster Performance & Smoother UI: Our app is optimized and can cache data locally, which will lead
                    to quicker load times and more responsive interfaces as compared to the website. </li>
                <li> App has more mobility </li>
                <li> Better usabilty from a user's perspective</li>
            </ul>
            <h2 className="grace-app-section-title"> Benefits of the app </h2>
            <ul className="grace-app-list">
                <li>Access features like camera, GPS, contacts,
                    and file storage to provide seamless and personalized experiences that are often restricted in browser-based sites.</li>
                <li>Home Screen Presence & Quick Launch: Having an icon on the user's device means instant access without needing
                    to type a URL or open a browser, which gives more control to the user. </li>
                <li>Quick actions: Widget support like- Today screen, homescreen widgets.</li>
                <li>Biometric login (Face ID, Touch ID, device PIN unlock).</li>
                <li>Photo/document capture directly from the app. </li>
                <li> Built-in maps. </li>
            </ul>
            <div className="grace-app-coming-soon">
                <h3 className="grace-app-coming-soon-title">What do we have coming soon?</h3>
                <ul className="grace-app-list">
                    <li>Location-based reminders.</li>
                    <li>Better UI according to the user feedbacks. </li>
                    <li>Smart reminders/alerts with the feature of scheduling a notification.</li>
                    <li>Offline access to key features like saved notes, tasks and available resources.</li>
                </ul>
                <h4>Stay tuned for updates!</h4>
            </div>
        </div>
    );
}

export default GraceApp;
