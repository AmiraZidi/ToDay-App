const express = require("express");
const Project = require("../models/project");
const projectRouter = express.Router();
const isAuth = require("../middleware/passport");
const transporter = require("../config/email");
const User = require("../models/user");

// add project
projectRouter.post("/add", async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const result = await newProject.save();

    // Récupérer les emails des membres
    const members = await User.find({ _id: { $in: result.members } });

    for (const member of members) {
      await transporter.sendMail({
        to: member.email,
        subject: "ToDay App - Nouveau projet",
        html: `<div style="font-family: Arial, sans-serif; padding: 30px; background-color: #f4f6f8; color: #333;">
  <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); padding: 30px;">
    <h2 style="color: #f76c6c; text-align: center;">🎉 Bonjour ${member.name},</h2>

    <p style="font-size: 16px; margin-top: 20px;">
      Vous avez été ajouté au projet suivant :
    </p>

    <div style="background-color: #d9f7be; padding: 15px 20px; border-left: 5px solid #7ed321; margin: 20px 0; border-radius: 6px;">
      <p style="margin: 0; font-size: 18px;">
        <strong style="color: #2d9535;">${result.name}</strong>
      </p>
    </div>

    <p style="font-size: 16px; margin-bottom: 10px;">
      <strong style="color: #f76c6c;">📝 Description :</strong><br />
      ${result.description}
    </p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />

    <p style="font-size: 14px; color: #555;">
      Merci de votre participation et de votre implication dans ce projet. <br />
      — L'équipe <strong style="color: #f76c6c;">ToDay App</strong>
    </p>
  </div>
</div>
`,
      });
    }

    res
      .status(201)
      .send({ project: result, msg: "Project successfully added" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ msg: "Failed to add project", error: error.message });
  }
});

// get project
projectRouter.get("/", async (req, res) => {
  try {
    let result = await Project.find();
    res.send({ projects: result, msg: "all projects" });
  } catch (error) {
    console.log(error);
  }
});

//delete project
projectRouter.delete("/:id", async (req, res) => {
  try {
    let result = await Project.findByIdAndDelete(req.params.id);
    res.send({ msg: "project is deleted" });
  } catch (error) {
    console.log(error);
  }
});

//update project

projectRouter.put("/:id", async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body } },
      { new: true }
    );

    const members = await User.find({ _id: { $in: updatedProject.members } });

    for (const member of members) {
      await transporter.sendMail({
        to: member.email,
        subject: "ToDay App - Projet modifié",
        html: `<div style="font-family: Arial, sans-serif; padding: 30px; background-color: #f4f6f8; color: #333;">
  <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); padding: 30px;">
    <h2 style="color: #f76c6c; text-align: center;">🔔 Bonjour ${member.name},</h2>

    <p style="font-size: 16px; margin-top: 20px;">
      Le projet suivant a été mis à jour :
    </p>

    <div style="background-color: #d9f7be; padding: 15px 20px; border-left: 5px solid #7ed321; margin: 20px 0; border-radius: 6px;">
      <p style="margin: 0; font-size: 18px;">
        <strong style="color: #2d9535;">${updatedProject.name}</strong>
      </p>
    </div>

    <p style="font-size: 16px; margin-bottom: 10px;">
      <strong style="color: #f76c6c;">📝 Description :</strong><br />
      ${updatedProject.description}
    </p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />

    <p style="font-size: 14px; color: #555;">
      Merci de rester informé et de continuer à suivre l'évolution du projet. <br />
      — L'équipe <strong style="color: #f76c6c;">ToDay App</strong>
    </p>
  </div>
</div>
`,
      });
    }

    res.send({ msg: "project is updated" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ msg: "Failed to update project", error: error.message });
  }
});

module.exports = projectRouter;