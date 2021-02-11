const express = require("express");
const Task = require("../models/task");
const router = new express.Router();

router.post("/tasks", async (req, res) => {
  try {
    await new Task(req.body).save();
    res.status(201).send(req.body);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/tasks/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Task.findById(_id);

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(400).send();
  }
});

router.patch("/tasks/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    res.status(400).send();
  } else {
    try {
      const _id = req.params.id;
      const task = await Task.findByIdAndUpdate(_id, req.body, {
        isNew: true,
        runValidators: true,
      });

      if (!task) {
        return res.status(404).send({ error: "Invalid updates!" });
      }

      res.send(task);
    } catch (e) {
      res.status(400).send();
    }
  }
});

router.delete("/tasks/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Task.findByIdAndDelete(_id);

    if (!task) {
      res.status(404).send();
    } else {
      res.send(task);
    }
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
