const accessTokens = JSON.parse(args[0]);
const activityType = args[1];

const results = [];

for (const userID in accessTokens) {
  const accessToken = accessTokens[userID];

  const apiResponse = await Functions.makeHttpRequest({
    url: "https://www.strava.com/api/v3/athlete/activities",
    headers: { Authorization: `Bearer ${accessToken}` },
    responseType: "json",
  });

  if (apiResponse.error) {
    throw new Error("Request failed.");
  }

  const data = apiResponse.data;

  const activities = data.filter((activity) => activity.type === activityType);

  const latestActivity = activities[0];

  if (latestActivity) {
    results.push(Number(userID));
    results.push({
      distance: Math.round(Number(latestActivity.distance)),
      type: latestActivity.type,
      startDate: latestActivity.start_date,
      duration: latestActivity.moving_time,
    });
  }
}

return Functions.encodeString(JSON.stringify(results));