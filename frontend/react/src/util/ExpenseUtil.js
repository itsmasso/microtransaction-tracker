export const flattenUserGames = (userGames) => {
  return userGames.flatMap((game) => {
    const expenses = game.expenses?.map((expense) => ({
      ...expense,
      type: "Expense",
      gameName: game.gameId.name,
      gameCoverUrl: game.gameId.coverUrl,
    })) || [];

    const subs = game.subscriptions?.map((sub) => ({
      ...sub,
      type: "Subscription",
      gameName: game.gameId.name,
      gameCoverUrl: game.gameId.coverUrl,
    })) || [];

    return [...expenses, ...subs];
  });
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