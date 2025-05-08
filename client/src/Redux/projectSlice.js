import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getproject = createAsyncThunk("project/get", (async) => {
  try {
    let result = axios.get("http://localhost:5000/project/");
    return result;
  } catch (error) {
    console.log(error);
  }
});

export const addproject = createAsyncThunk(
  "project/add",
  async (newProject) => {
    try {
      let result = await axios.post(
        "http://localhost:5000/project/add",
        newProject
      );
      return result;
    } catch (error) {
      console.log(error);
    }
  }
);

export const deleteproject = createAsyncThunk("project/delete", async (id) => {
  try {
    let result = axios.delete(`http://localhost:5000/project/${id}`);
    return result;
  } catch (error) {
    console.log(error);
  }
});

export const editproject = createAsyncThunk(
  "project/edit",
  async ({ id, editedproject }) => {
    try {
      let result = axios.put(
        `http://localhost:5000/project/${id}`,
        editedproject
      );
      return result;
    } catch (error) {
      console.log(error);
    }
  }
);

const initialState = {
  projectList: [],
  status: null,
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getproject.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getproject.fulfilled, (state, action) => {
        state.status = "success";
        state.projectList = action.payload.data.projects;
      })
      .addCase(getproject.rejected, (state) => {
        state.status = "fail";
      })

      .addCase(addproject.pending, (state) => {
        state.status = "pending";
      })
      .addCase(addproject.fulfilled, (state, action) => {
        state.status = "success";
      })
      .addCase(addproject.rejected, (state) => {
        state.status = "fail";
      })

      .addCase(deleteproject.pending, (state) => {
        state.status = "pending";
      })
      .addCase(deleteproject.fulfilled, (state, action) => {
        state.status = "success";
      })
      .addCase(deleteproject.rejected, (state) => {
        state.status = "fail";
      })

      .addCase(editproject.pending, (state) => {
        state.status = "pending";
      })
      .addCase(editproject.fulfilled, (state, action) => {
        state.status = "success";
      })
      .addCase(editproject.rejected, (state) => {
        state.status = "fail";
      });
  },
});

// export const { } = projectSlice.actions;

export default projectSlice.reducer;
