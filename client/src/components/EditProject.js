import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./profil.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { editproject } from "../Redux/projectSlice";
import Swal from "sweetalert2";
import { FaEdit } from "react-icons/fa";

function EditProject({ ping, setping, project }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const users = useSelector((state) => state.user.userList);

  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [editedProject, setEditedProject] = useState({
    name: "",
    description: "",
    members: [],
  });

  useEffect(() => {
    if (project) {
      setEditedProject({
        name: project.name || "",
        description: project.description || "",
        members: project.members || [],
      });
      setSelectedMembers([]);
    }
  }, [project]);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const toggleSelectMember = (selectedUser) => {
    const userId = selectedUser._id;
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.trim().toLowerCase();
    return (
      u._id !== user._id &&
      !editedProject.members.includes(u._id) &&
      ((u.name && u.name.toLowerCase().includes(term)) ||
        (u.email && u.email.toLowerCase().includes(term)))
    );
  });

  const handleSubmit = () => {
    const updatedProject = {
      ...editedProject,
      members: [...editedProject.members, ...selectedMembers],
    };

    dispatch(editproject({ id: project._id, editedProject: updatedProject }))
      .unwrap()
      .then(() => {
        setping(!ping);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your Project Has Been Edited!",
          showConfirmButton: false,
          timer: 1500,
        });
        handleClose();
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: error.message || "An error occurred.",
        });
      });
  };

  if (!project) return null;

  return (
    <div>
      <button className="suggdeletebtn" onClick={handleShow}>
        <FaEdit size={25} color="#5ac583" />
      </button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Your Project</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                value={editedProject.name}
                onChange={(e) =>
                  setEditedProject({ ...editedProject, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Project Description</Form.Label>
              <Form.Control
                type="text"
                value={editedProject.description}
                onChange={(e) =>
                  setEditedProject({
                    ...editedProject,
                    description: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Current Members</Form.Label>
              <div className="current-members">
                {editedProject.members.map((id) => {
                  const member = users.find((u) => u._id === id);
                  return (
                    <div key={id} className="member-option">
                      <span>
                        {member?.name || "Unnamed"} (
                        {member?.email || "No Email"})
                      </span>
                    </div>
                  );
                })}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Add New Members</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {searchTerm && (
                <div className="members-list">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => {
                      const isSelected = selectedMembers.includes(u._id);
                      return (
                        <div key={u._id} className="member-option">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectMember(u)}
                          />
                          <span>
                            {u.name || "Unnamed"} ({u.email || "No Email"})
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="no-results">No users found.</p>
                  )}
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default EditProject;
