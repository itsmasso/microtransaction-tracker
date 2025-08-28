export const flattenUserGames = (userGames) => {
  const result = userGames.flatMap((game) => {
    // Handle both demo data structure and regular data structure
    const gameName = game.gameId?.name || game.name;
    const gameCoverUrl = game.gameId?.coverUrl || game.cover || game.gameId?.coverUrl;
    
    const expenses = game.expenses?.map((expense) => ({
      ...expense,
      type: "Expense",
      gameName: gameName,
      gameCoverUrl: gameCoverUrl,
    })) || [];

    const subs = game.subscriptions?.map((sub) => ({
      ...sub,
      type: "Subscription",
      gameName: gameName,
      gameCoverUrl: gameCoverUrl,
    })) || [];

    return [...expenses, ...subs];
  });
  
  return result;
};

export const sortItems = (items, sortType, sortOrder) => {
  return items.slice().sort((a, b) => {
    if (sortType === "date") {
      return sortOrder === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    } else if (sortType === "purchaseAmount") {
      return sortOrder === "asc"
        ? Number(a.purchaseAmount) - Number(b.purchaseAmount)
        : Number(b.purchaseAmount) - Number(a.purchaseAmount);
    }
    return 0;
  });
};
