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

// This function creates the autherisation URL to get the users access token and refresh token
async function createUrl() {

    const firstUrl = `http://www.strava.com/oauth/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=http://localhost/exchange_token&approval_prompt=force&scope=read,activity:read_all`;
    console.log(firstUrl);

    const code = await askQuestion("Enter the code: ");
    return `https://www.strava.com/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}&grant_type=authorization_code`;
}

// This function logs the users access token and refresh token.
async function getToken() {
    const url = await createUrl();

    try {
        const response = await fetch(url, {
            method: 'POST',
            responseType: 'json'
        });

        const data = await response.json();
        console.log(data);

    } catch (error) {
        console.error('Error fetching user activity:', error);
    }
}

getToken().then(() => process.exit(0));
