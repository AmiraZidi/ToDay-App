import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navbarr from "./Navbarr";
import "./addproject.css";
import { addproject } from "../Redux/projectSlice";

function AddProject({ ping, setping }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  const users = useSelector((state) => state.user.userList);

  const [projectData, setProjectData] = useState({
    id_admin: user?._id || "",
    name_admin: user?.name || "",
    name: "",
    description: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const handleInputChange = (e) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
  };

  const toggleSelectMember = (selectedUser) => {
    setSelectedMembers((prev) => {
      const exists = prev.includes(selectedUser._id);
      if (exists) {
        return prev.filter((id) => id !== selectedUser._id);
      } else {
        return [...prev, selectedUser._id];
      }
    });
  };

  const handleSubmit = () => {
    if (!projectData.name || !projectData.description) {
      Swal.fire({
        title: "Please complete all required fields.",
        icon: "warning",
      });
      return;
    }

    const newProject = {
      ...projectData,
      members: selectedMembers,
    };

    dispatch(addproject(newProject))
      .unwrap()
      .then(() => {
        setping(!ping);
        Swal.fire({
          title: "Project created successfully!",
          icon: "success",
        });
        navigate("/profil");
      })
      .catch((error) => {
        Swal.fire({
          title: "Project creation failed",
          text: error.message || "An error occurred.",
          icon: "error",
        });
      });
  };
  

  const filteredUsers =
    users?.filter((u) => {
      const term = searchTerm.toLowerCase();
      return (
        u._id !== user._id &&
        (u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term))
      );
    }) || [];

  return (
    <>
      <Navbarr />
      <div className="add-project-container">
        <div className="form-wrapper">
          <h2>Create a New Project</h2>

          <label>Project Name *</label>
          <input
            type="text"
            name="name"
            placeholder="Enter project name"
            value={projectData.name}
            onChange={handleInputChange}
          />

          <label>Description *</label>
          <textarea
            name="description"
            placeholder="Describe your project..."
            value={projectData.description}
            onChange={handleInputChange}
          />

          <label>Select Members</label>
          <input
            type="text"
            placeholder="Search users by name or email"
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
                        {u.name} ({u.email})
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="no-results">No users found.</p>
              )}
            </div>
          )}

          <button className="submit-btn" onClick={handleSubmit}>
            Create Project
          </button>
        </div>
      </div>
    </>
  );
}

export default AddProject;
