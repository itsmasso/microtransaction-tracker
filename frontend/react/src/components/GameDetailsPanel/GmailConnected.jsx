import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GmailConnected = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const gameId = localStorage.getItem("currentGameId");
    const tempForm = JSON.parse(localStorage.getItem("tempGameForm") || "{}");

    const receiptEmail = tempForm.receiptEmails?.split(",")[0]?.trim();

    if (!accessToken || !refreshToken || !receiptEmail || !gameId) {
      alert("Missing Gmail or game info.");
      navigate("/");
      return;
    }

    const sync = async () => {
      try {
        // 1. Save game preferences
        await fetch("http://localhost:5000/games/update-user-game", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            gameId,
            purchaseEmail: tempForm.purchaseEmail,
            receiptEmails: tempForm.receiptEmails
              .split(",")
              .map((s) => s.trim()),
            keywords: tempForm.keywords.split(",").map((s) => s.trim()),
            purchasePlatforms: tempForm.purchasePlatforms,
          }),
        });

        // 2. Fetch Gmail receipts
        const res = await fetch(
          `http://localhost:5000/gmail/emails?accessToken=${accessToken}&refreshToken=${refreshToken}&email=${encodeURIComponent(receiptEmail)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({  }),
          }
        );

        const data = await res.json();
        console.log("Gmail receipts:", data);
      } catch (err) {
        console.error("Sync error:", err);
      } finally {
        navigate("/");
      }
    };

    sync();
  }, []);

  return <p>Syncing your expenses from Gmail...</p>;
};

export default GmailConnected;