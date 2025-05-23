export const checkAuth = async () => {
  try {
    const response = await fetch("http://localhost:5000/user/get-user", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Not Authenticated");
    }
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error("Not Authenticated");
  }
};
