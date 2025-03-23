import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => rl.question(query, (ans) => {
        rl.close();
        resolve(ans);
    }));
}

async function createUrl() {
    const state = 'fitbit';
    const firstUrl = `https://www.fitbit.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${process.env.REDIRECT_URI}&scope=${process.env.SCOPES}&prompt=login&state=${state}`;
    console.log('Click this URL and authorize the app:');
    console.log(firstUrl);

    const code = await askQuestion("Paste the 'code' from the URL after authorizing: ");
    const body = new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.REDIRECT_URI
    });
    return { url: 'https://api.fitbit.com/oauth2/token', body };
}

async function getToken() {
    const { url, body } = await createUrl();

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')
            },
            body: body
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
        }

        const data = await response.json();
        console.log('Access Token:', data.access_token);
        console.log('Refresh Token:', data.refresh_token);
        console.log('Expires In:', data.expires_in);
        console.log('Full Response:', data);
    } catch (error) {
        console.error('Error fetching Fitbit token:', error);
    }
}

getToken().then(() => process.exit(0));