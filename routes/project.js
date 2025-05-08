const express = require("express");
const Project = require("../models/project");
const projectRouter = express.Router();
const isAuth = require("../middleware/passport");

// add project
projectRouter.post("/add", async (req, res) => {
  try {
    let newProject = new Project(req.body);
    let result = await newProject.save();
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
    let result = await Project.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { ...req.body } }
    );
    res.send({ msg: "project is updated" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = projectRouter;
