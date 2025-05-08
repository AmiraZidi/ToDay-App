import React, { useState } from "react";
import {
  Container,
  Row,
  Modal,
  Col,
  Table,
  Button,
  Form,
  ProgressBar,
} from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navbarr from "../components/Navbarr";
import { addtask, edittask } from "../Redux/taskSlice";
import AddTask from "./AddTask";
import { ArrowRepeat } from "react-bootstrap-icons";

ChartJS.register(ArcElement, Tooltip, Legend);

const Project = ({ ping, setping }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  const users = useSelector((state) => state.user.userList);
  const projects = useSelector((state) => state.project.projectList);
  const tasks = useSelector((state) => state.task.taskList || []);

  const project = projects.find((p) => p._id === params.id);
  const mytasks = tasks.filter((task) => task.projectId === project?._id);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    admin: user?._id,
    projectId: params.id,
    status: "En attente",
    priority: "",
    end_at: "",
  });

  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const openEditModal = (taskId, responsables) => {
    setSelectedTaskId(taskId);
    setSelectedMembers(responsables);
    setShowEditModal(true);
  };

  const handleUpdateResponsables = () => {
    if (!selectedTaskId) return;
    dispatch(
      edittask({
        id: selectedTaskId,
        editedtask: { responsables: selectedMembers },
      })
    )
      .unwrap()
      .then(() => {
        setShowEditModal(false);
        Swal.fire("Succès", "Responsables modifiés", "success");
        setping(!ping);
      })
      .catch((err) => Swal.fire("Erreur", err.message, "error"));
  };

  const toggleSelectMember = (selectedUser) => {
    setSelectedMembers((prev) =>
      prev.includes(selectedUser._id)
        ? prev.filter((id) => id !== selectedUser._id)
        : [...prev, selectedUser._id]
    );
  };

  const handleAddTask = () => {
    if (
      !newTask.name ||
      !newTask.description ||
      !newTask.priority ||
      !newTask.end_at
    ) {
      Swal.fire({
        title: "Veuillez remplir tous les champs requis.",
        icon: "warning",
      });
      return;
    }

    const taskToAdd = {
      ...newTask,
      responsables: selectedMembers,
    };

    dispatch(addtask(taskToAdd))
      .unwrap()
      .then(() => {
        setping(!ping);
        Swal.fire("Succès", "Tâche ajoutée avec succès !", "success");
        setShowModal(false);
        navigate(`/profil`);
      })
      .catch((error) => {
        Swal.fire(
          "Erreur",
          error.message || "Erreur lors de la création",
          "error"
        );
      });
  };

  const filteredUsers =
    users
      ?.filter((u) => project?.members?.includes(u._id))
      ?.filter((u) => {
        const term = searchTerm.toLowerCase();
        return (
          u.name?.toLowerCase().includes(term) ||
          u.email?.toLowerCase().includes(term)
        );
      }) || [];

  const tachesCompletees = mytasks.filter(
    (t) => t.status === "Complétée"
  ).length;
  const tachesEnCours = mytasks.filter((t) => t.status === "En cours").length;
  const tachesEnAttente = mytasks.filter(
    (t) => t.status === "En attente"
  ).length;

  const data = {
    labels: ["Complétées", "En cours", "En attente"],
    datasets: [
      {
        label: "Statistiques des tâches",
        data: [tachesCompletees, tachesEnCours, tachesEnAttente],
        backgroundColor: ["#28a745", "#17a2b8", "#dc3545"],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const [editedtask, setEditedtask] = useState({
    status: "",
  });

  const changeStatus = (id, currentStatus) => {
    if (!id) {
      console.error("Task ID is undefined");
      Swal.fire("Erreur", "L'ID de la tâche est invalide", "error");
      return;
    }

    let newStatus = currentStatus;

    if (currentStatus === "En attente") {
      newStatus = "En cours";
    } else if (currentStatus === "En cours") {
      newStatus = "Complétée";
    }

    console.log("Changement de statut:", { id, newStatus }); // Log des données envoyées

    dispatch(edittask({ id, editedtask: { status: newStatus } }))
      .unwrap()
      .then(() => {
        Swal.fire("Succès", "Statut mis à jour avec succès !", "success");
        setping(!ping);
      })
      .catch((error) => {
        console.error("Erreur:", error); // Log de l'erreur
        Swal.fire(
          "Erreur",
          error.message || "Erreur lors de la mise à jour du statut",
          "error"
        );
      });
  };

  if (!project) {
    return <p style={{ padding: "2rem" }}>Projet introuvable.</p>;
  }

  return (
    <>
      <Navbarr />
      <div
        style={{
          backgroundColor: "#f4f4f4",
          minHeight: "100vh",
          padding: "2rem",
          color: "#000",
        }}
      >
        <Container>
          <Row className="mb-4">
            <Col>
              <div className="p-4 rounded shadow bg-white">
                <h1 style={{ color: "#4a90e2" }}>{project.name}</h1>
                <p>{project.description}</p>
                <p>
                  <strong>Créé par :</strong> {project.name_admin}
                </p>
              </div>
            </Col>
          </Row>

          <Row className="mb-5">
            <Col>
              <div className="p-4 rounded shadow bg-white">
                {project.id_admin === user._id && (
                  <AddTask
                    showModal={showModal}
                    setShowModal={setShowModal}
                    newTask={newTask}
                    setNewTask={setNewTask}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filteredUsers={filteredUsers}
                    selectedMembers={selectedMembers}
                    toggleSelectMember={toggleSelectMember}
                    handleAddTask={handleAddTask}
                  />
                )}

                <Table striped bordered hover responsive className="mt-4">
                  <thead>
                    <tr>
                      <th>Titre</th>
                      <th>Responsable(s)</th>
                      <th>Statut</th>
                      <th>Progression</th>
                      <th>Priorité</th>
                      <th>Date limite</th>
                      {project.id_admin === user._id && (
                        <th>Modifier Responsable</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {mytasks.map((task, index) => {
                      let progressValue, variant, statusColor;
                      switch (task.status) {
                        case "En attente":
                          progressValue = 0;
                          variant = "danger";
                          statusColor = "text-danger";
                          break;
                        case "En cours":
                          progressValue = 50;
                          variant = "info";
                          statusColor = "text-info";
                          break;
                        case "Complétée":
                          progressValue = 100;
                          variant = "success";
                          statusColor = "text-success";
                          break;
                        default:
                          break;
                      }

                      return (
                        <tr key={index}>
                          <td>{task.name}</td>
                          <td>
                            {users
                              ?.filter((u) =>
                                task.responsables?.includes(u._id)
                              )
                              .map((u) => u.name)
                              .join(", ") || "-"}
                          </td>
                          <td
                            className={statusColor}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            {task.status}
                            <ArrowRepeat
                              size={20}
                              className="ms-2"
                              onClick={() =>
                                changeStatus(task._id, task.status)
                              }
                              style={{ cursor: "pointer" }}
                            />
                          </td>
                          <td>
                            <ProgressBar
                              now={progressValue}
                              variant={variant}
                              label={`${progressValue}%`}
                            />
                          </td>
                          <td>{task.priority}</td>
                          <td>
                            {task.end_at
                              ? new Date(task.end_at)
                                  .toISOString()
                                  .split("T")[0]
                              : "-"}
                          </td>

                          {project.id_admin === user._id && (
                            <td>
                              <Button
                                variant="primary"
                                onClick={() =>
                                  openEditModal(task._id, task.responsables)
                                }
                              >
                                Changer
                              </Button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <div className="p-4 rounded shadow bg-white">
                <h4 style={{ color: "#4a90e2" }}>Progression générale</h4>
                <Doughnut data={data} />
              </div>
            </Col>
            <Col md={6}>
              <div className="p-4 rounded shadow bg-white">
                <h4 style={{ color: "#4a90e2" }}>Liste des membres</h4>
                <Table striped bordered hover responsive className="mt-4">
                  <thead>
                    <tr>
                      <th>Responsable(s)</th>
                      <th>Nombre des taches</th>
                      <th>Progression</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => {
                      const userTasks = mytasks.filter((task) =>
                        task.responsables?.includes(user._id)
                      );

                      const completedTasks = userTasks.filter(
                        (task) => task.status === "Complétée"
                      ).length;
                      const totalTasks = userTasks.length;

                      const userProgress = totalTasks
                        ? (completedTasks / totalTasks) * 100
                        : 0;

                      return (
                        <tr key={index}>
                          <td>{user.name}</td>
                          <td>{totalTasks}</td>
                          <td>
                            <ProgressBar
                              now={userProgress}
                              variant="success"
                              label={`${Math.round(userProgress)}%`}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Changer les responsables</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Rechercher un membre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-3"
          />
          {filteredUsers.map((user) => (
            <Form.Check
              key={user._id}
              type="checkbox"
              label={user.name}
              checked={selectedMembers.includes(user._id)}
              onChange={() => toggleSelectMember(user)}
            />
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleUpdateResponsables}>
            Sauvegarder
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Project;
