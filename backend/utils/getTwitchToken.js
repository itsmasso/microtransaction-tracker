export const getTwitchToken = async () => {
  const params = new URLSearchParams({
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_CLIENT_SECRET,
    grant_type: "client_credentials",
  });

  const response = await fetch(`https://id.twitch.tv/oauth2/token`, {
    method: "POST",
    body: params,
  });

  if (!response.ok) throw new Error("Failed to get Twitch token");

  const data = await response.json();
  
  return data.access_token;
};

