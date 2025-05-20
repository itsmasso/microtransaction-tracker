import { getTwitchToken } from "./getTwitchToken.js";

export const fetchIGDBGames = async ({ query }) => {
  const token = await getTwitchToken();

  const response = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${token}`,
      "Content-Type": "text/plain",
    },
    body: ` search "${query}";
            fields name, platforms.name, category, cover.image_id, total_rating_count;
            where total_rating_count != null & total_rating_count > 0 & category = 0 & cover != null;
            limit 20;
            `,
  });
  if (!response.ok) throw new Error("Failed to fetch IGDB games!");

  const data = await response.json();
  const sortedData = data.sort((a, b) => {
    const currentCount = a.total_rating_count || 0;
    const prevCount = b.total_rating_count || 0;
    return prevCount - currentCount; //sort from highest to lowest
  });

  const updatedData = sortedData.map((game) => ({
    igdbId: game.id,
    name: game.name,
    platforms: game.platforms?.map((p) => p.name) || [],
    coverUrl: game.cover
      ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
      : null,
  }));
  console.log(updatedData);
  return updatedData;
};
