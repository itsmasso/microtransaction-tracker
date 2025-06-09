export const getDaysRemaining = (startDate, recurrence) => {
  const now = new Date();
  const start = new Date(startDate);
  let nextRenewal;

  switch (recurrence) {
    case "weekly":
      nextRenewal = new Date(start);
      nextRenewal.setDate(start.getDate() + 7);
      break;
    case "monthly":
      nextRenewal = new Date(start);
      nextRenewal.setMonth(start.getMonth() + 1);
      break;
    case "yearly":
      nextRenewal = new Date(start);
      nextRenewal.setFullYear(start.getFullYear() + 1);
      break;
    default:
      return null;
  }

  const diffTime = nextRenewal - now;
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
};