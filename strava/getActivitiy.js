import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

// This function refreshes the users access token.
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

async function fetchUserActivity() {
    try {
        const accessToken = await refreshAccessToken();

        const response = await fetch('https://www.strava.com/api/v3/athlete/activities', {
            method: 'GET',
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const data = await response.json();
        console.log(data);

    } catch (error) {
        console.error('Error fetching user activity:', error);
    }
}



fetchUserActivity();