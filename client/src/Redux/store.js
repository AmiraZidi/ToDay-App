import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import projectSlice from "./projectSlice";
import taskSlice from "./taskSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    project: projectSlice,
    task: taskSlice,
  },
});
