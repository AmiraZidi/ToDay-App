const express = require("express");
const Task = require("../models/task");
const taskRouter = express.Router();
const isAuth = require("../middleware/passport");
const User = require("../models/user");
const transporter = require("../config/email");

// Add task
taskRouter.post("/add", async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const result = await newTask.save();

    // Récupérer les responsables
    const resp = await User.find({ _id: { $in: result.responsables } });
    // Reformuler la date limite
    const formattedDate = new Date(result.end_at).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Envoyer les emails
    for (const user of resp) {
      await transporter.sendMail({
        to: user.email,
        subject: "ToDay App - Nouvelle tâche assignée",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 30px; background-color: #f4f6f8; color: #333;">
  <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); padding: 30px;">
    <h2 style="color: #f76c6c; text-align: center;">👋 Bonjour ${user.name},</h2>

    <p style="font-size: 16px; margin-top: 20px;">
      Vous avez été <strong style="color: #4a90e2;">assigné(e)</strong> à une nouvelle tâche dans l'application <strong>ToDay</strong> :
    </p>

    <div style="background-color: #f0f8ff; padding: 15px 20px; border-left: 5px solid #4a90e2; margin: 20px 0; border-radius: 6px;">
      <p style="margin: 0; font-size: 18px;">
        <strong style="color: #4a90e2;">${result.name}</strong>
      </p>
    </div>

    <p style="font-size: 16px; margin-bottom: 10px;">
      <strong style="color: #f76c6c;">📝 Description :</strong><br />
      ${result.description}
    </p>

    <p style="font-size: 16px; margin-bottom: 10px;">
      <strong style="color: #333;">📅 Date limite :</strong> ${formattedDate}
    </p>

    <p style="font-size: 16px; margin-bottom: 10px;">
      <strong style="color: #333;">⚡ Priorité :</strong> ${result.priority}
    </p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />

    <p style="font-size: 14px; color: #555;">
      Merci pour votre implication et votre sérieux. <br />
      — L'équipe <strong style="color: #f76c6c;">ToDay App</strong>
    </p>
  </div>
</div>

        `,
      });
    }

    res.status(200).send({ task: result, msg: "Task successfully added" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Failed to add task", error });
  }
});

// Get all tasks
taskRouter.get("/", async (req, res) => {
  try {
    const result = await Task.find();
    res.status(200).send({ tasks: result, msg: "All tasks" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Failed to fetch tasks", error });
  }
});

// Delete task
taskRouter.delete("/:id", async (req, res) => {
  try {
    const result = await Task.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).send({ msg: "Task not found" });
    }
    res.status(200).send({ msg: "Task is deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Failed to delete task", error });
  }
});

// Update task
taskRouter.put("/:id", async (req, res) => {
  try {
    const result = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!result) {
      return res.status(404).send({ msg: "Task not found" });
    }

    // Récupérer les responsables
    const responsables = await User.find({ _id: { $in: result.responsables } });

    // Envoyer les emails
    for (const user of responsables) {
      await transporter.sendMail({
        to: user.email,
        subject: "ToDay App - Tâche mise à jour",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 30px; background-color: #f4f6f8; color: #333;">
  <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); padding: 30px;">
    <h2 style="color: #f76c6c; text-align: center;">🔔 Bonjour ${user.name},</h2>

    <p style="font-size: 16px; margin-top: 20px;">
      La tâche suivante à laquelle vous êtes <strong style="color: #4a90e2;">assigné(e)</strong> a été mise à jour :
    </p>

    <div style="background-color: #fff8dc; padding: 15px 20px; border-left: 5px solid #f5b041; margin: 20px 0; border-radius: 6px;">
      <p style="margin: 0; font-size: 18px;">
        <strong style="color: #e67e22;">${result.name}</strong>
      </p>
    </div>

    <p style="font-size: 16px; margin-bottom: 10px;">
      <strong style="color: #f76c6c;">📝 Nouvelle description :</strong><br />
      ${result.description}
    </p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />

    <p style="font-size: 14px; color: #555;">
      Merci de rester à jour sur vos tâches. <br />
      — L'équipe <strong style="color: #f76c6c;">ToDay App</strong>
    </p>
  </div>
</div>

        `,
      });
    }

    res.status(200).send({ msg: "Task is updated", task: result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Failed to update task", error });
  }
});

module.exports = taskRouter;
