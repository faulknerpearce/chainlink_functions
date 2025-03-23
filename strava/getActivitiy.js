import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

// Fefreshes the users access token.
async function refreshAccessToken() {
    const url = 'https://www.strava.com/oauth/token';
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            refresh_token: process.env.USER_REFRESH_TOKEN,
            grant_type: 'refresh_token'
        })
    });

    const data = await response.json();
    console.log("New Token Response:", data);

    if (data.access_token) {
        return data.access_token;
    } else {
        throw new Error("Failed to refresh token: " + JSON.stringify(data));
    }
}

// Fetch user activity from Strava API and refresh the access token if expired.
async function fetchUserActivity() {
    try {

        const currentTimestamp = Date.now();

        if (currentTimestamp > process.env.TOKEN_EXPIRY) {
            console.log("Token expired, refreshing...");
            const accessToken = await refreshAccessToken();
            process.env.ACCESS_TOKEN = accessToken;
        }

        else{
            console.log("Token is still valid.");
        }

        console.log("Access Token:", process.env.ACCESS_TOKEN);

        const response = await fetch('https://www.strava.com/api/v3/athlete/activities', {
            method: 'GET',
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const data = await response.json();

        for (const activity of data){
            console.log(`Activity Type: ${activity.type}`);
            console.log(`Activity Distance: ${activity.distance}`);
            console.log(`Activity Start Date: ${activity.start_date}`);
            console.log(`--------------------------------------------`);
        }

    } catch (error) {
        console.error('Error fetching user activity:', error);
    }
}

fetchUserActivity();