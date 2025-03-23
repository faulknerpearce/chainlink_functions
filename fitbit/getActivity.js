import dotenv from "dotenv";

dotenv.config();

// Function to get the current date in YYYY-MM-DD format
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

async function getUserActivities(accessToken) {
  const activitiesUrl = `https://api.fitbit.com/1/user/-/activities/date/${getCurrentDate()}.json`;

  try {
    const response = await fetch(activitiesUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
    }

    const data = await response.json();

    console.log("Activities:", data.activities);

    return data.activities;

  } catch (error) {
    console.error("Error fetching Fitbit activities:", error);
    return null;
  }
}

getUserActivities(process.env.ACCESS_TOKEN).then(() => process.exit(0));