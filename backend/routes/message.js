const express = require("express");
const router = express.Router();

const Message = require("../models/Message");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    const { receiver, text } = req.body;

    const message = new Message({
      sender: req.user.id,
      receiver,
      text,
    });

    await message.save();

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/:receiverId", auth, async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.receiverId;

    const messages = await Message.find({
      $or: [
        {
          sender: senderId,
          receiver: receiverId,
        },
        {
          sender: receiverId,
          receiver: senderId,
        },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;