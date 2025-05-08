import { Routes, Route } from "react-router-dom";
import "./App.css";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import PrivateRoute from "./Routes/PrivateRouter";
import "bootstrap/dist/css/bootstrap.min.css";
import { getproject } from "./Redux/projectSlice";
import { getuser, userCurrent } from "./Redux/userSlice";
import Profil from "./components/Profil";
import Auth from "./components/Auth";
import AddProject from "./components/AddProject";
import Project from "./components/Project";
import { gettask } from "./Redux/taskSlice";
import AddTask from "./components/AddTask";

function App() {
  const isAuth = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [ping, setping] = useState(false);
  useEffect(() => {
    dispatch(userCurrent());
    dispatch(getproject());
    dispatch(getuser());
    dispatch(gettask());
  }, [ping]);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route element={<PrivateRoute />}>
          <Route
            path="/profil"
            element={<Profil ping={ping} setping={setping} />}
          />
          <Route
            path="/new-project"
            element={<AddProject ping={ping} setping={setping} />}
          />
          <Route
            path="/new-task"
            element={<AddTask ping={ping} setping={setping} />}
          />
          <Route
            path="/project/:id"
            element={<Project ping={ping} setping={setping} />}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
