import express from "express";

const router = express.Router();
router.get("/home", async (req, res) => {
  try {
    return res.json({success: true, message: "home page"});
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
