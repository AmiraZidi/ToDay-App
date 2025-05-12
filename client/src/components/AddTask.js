import React from "react";
import Swal from "sweetalert2";
import { Button, Modal, Form } from "react-bootstrap";

function AddTask({
  showModal,
  setShowModal,
  newTask,
  setNewTask,
  searchTerm,
  setSearchTerm,
  filteredUsers,
  selectedMembers,
  toggleSelectMember,
  handleAddTask,
}) {
  return (
    <>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        + Ajouter une tâche
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une tâche</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="taskName">
              <Form.Label>Titre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Titre de la tâche"
                name="name"
                value={newTask.name}
                onChange={(e) =>
                  setNewTask({ ...newTask, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="taskDesc" className="mt-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Description de la tâche"
                name="description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="taskPriority" className="mt-2">
              <Form.Label>Priorité</Form.Label>
              <Form.Control
                as="select"
                name="priority"
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
              >
                <option value="">-- Sélectionner --</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="taskEndAt" className="mt-2">
              <Form.Label>Date limite</Form.Label>
              <Form.Control
                type="date"
                name="end_at"
                value={newTask.end_at}
                onChange={(e) =>
                  setNewTask({ ...newTask, end_at: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="memberSearch" className="mt-3">
              <Form.Label>Ajouter des membres</Form.Label>
              <Form.Control
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div
                className="mt-2"
                style={{ maxHeight: "150px", overflowY: "auto" }}
              >
                {filteredUsers.map((user) => (
                  <Form.Check
                    key={user._id}
                    type="checkbox"
                    label={`${user.name} (${user.email})`}
                    checked={selectedMembers.includes(user._id)}
                    onChange={() => toggleSelectMember(user)}
                  />
                ))}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="success" onClick={handleAddTask}>
            Ajouter
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddTask;
