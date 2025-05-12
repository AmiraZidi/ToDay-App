import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./profil.css";
import Navbarr from "./Navbarr";
import { Eye, Trash } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { deleteproject } from "../Redux/projectSlice";
import Swal from "sweetalert2";
import EditProfil from "./EditProfil";
import Editproject from "./EditProject";

function Profil({ ping, setping }) {
  const user = useSelector((state) => state.user?.user);
  const projects = useSelector((state) => state.project?.projectList || []);
  const assignedProject = projects.filter(
    (el) => Array.isArray(el.members) && el.members.includes(user?._id)
  );
  const dispatch = useDispatch();

  const deletemodal = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteproject(id));
        Swal.fire({
          title: "Deleted!",
          text: "Your project has been deleted.",
          icon: "success",
        });
        setping((prevping) => !prevping);
      }
    });
  };
  const exitmodal = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Exit!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteproject(id)).then(() => {
          Swal.fire({
            title: "Deleted!",
            text: "Your project has been deleted.",
            icon: "success",
          });
          setping((prevping) => !prevping);
        });
      }
    });
  };
  return (
    <>
      <Navbarr />
      <div className="profil">
        <div className="profile-container">
          <div className="profile-infos">
            <img
              src={user?.profile_photo}
              alt="Profile Picture"
              className="profile-pic"
            />
            <div className="profile-info">
              <h2>
                {user?.name} {user?.last_name}
              </h2>
              <p>Task Breaker</p>
              <p>{user?.email}</p>
              <EditProfil ping={ping} setping={setping} />
            </div>
          </div>
        </div>

        {/* Projects project List */}
        <div className="profile-lists">
          <div className="list-header">
            <h3>Project List</h3>
            <Link to="/new-project" className="add-sugg">
              Add project
            </Link>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Progress</th>
                <th colSpan={3}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects
                ?.filter((el) => el?.id_admin === user?._id)
                .map((el) => (
                  <tr key={el._id}>
                    <td>{el?.name}</td>
                    <td>{el?.description}</td>
                    <td>progress</td>
                    <td>
                      <Link to={`/project/${el?._id}`} className="link">
                        <button className="suggdeletebtn">
                          <Eye size={25} color="#6a5ac5" />
                        </button>
                      </Link>
                    </td>
                    <td>
                      <button
                        className="suggdeletebtn"
                        onClick={() => {
                          deletemodal(el?._id);
                          setping(!ping);
                        }}
                      >
                        <Trash size={25} color="red" />
                      </button>
                    </td>
                    <td>
                      <button className="suggdeletebtn">
                        <Editproject
                          ping={ping}
                          setping={setping}
                          project={el}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Projects You Are Member In */}
        <div className="profile-lists">
          <div className="list-header">
            <h3>Projects You Are Member In</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Progress</th>
                <th colSpan={2}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignedProject.map((el) => (
                <tr key={el._id}>
                  <td>{el?.name}</td>
                  <td>{el?.description}</td>
                  <td>progress</td>
                  <td>
                    <Link to={`/project/${el?._id}`} className="link">
                      <button className="suggdeletebtn">
                        <Eye size={25} color="#6a5ac5" />
                      </button>
                    </Link>
                  </td>
                  <td>
                    <button
                      className="suggdeletebtn"
                      onClick={() => {
                        exitmodal(el?._id);
                        setping(!ping);
                      }}
                    >
                      <Trash size={25} color="red" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Profil;
