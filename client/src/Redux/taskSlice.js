import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const gettask = createAsyncThunk("task/get", (async) => {
  try {
    let result = axios.get("http://localhost:5000/task/");
    return result;
  } catch (error) {
    console.log(error);
  }
});

export const addtask = createAsyncThunk("task/add", async (newtask) => {
  try {
    let result = await axios.post("http://localhost:5000/task/add", newtask);
    return result;
  } catch (error) {
    console.log(error);
  }
});

export const deletetask = createAsyncThunk("task/delete", async (id) => {
  try {
    let result = axios.delete(`http://localhost:5000/task/${id}`);
    return result;
  } catch (error) {
    console.log(error);
  }
});

export const edittask = createAsyncThunk(
  "task/edit",
  async ({ id, editedtask }) => {
    try {
      let result = axios.put(`http://localhost:5000/task/${id}`, editedtask);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
);

const initialState = {
  taskList: [],
  status: null,
};

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(gettask.pending, (state) => {
        state.status = "pending";
      })
      .addCase(gettask.fulfilled, (state, action) => {
        state.status = "success";
        state.taskList = action.payload.data.tasks;
      })
      .addCase(gettask.rejected, (state) => {
        state.status = "fail";
      })

      .addCase(addtask.pending, (state) => {
        state.status = "pending";
      })
      .addCase(addtask.fulfilled, (state, action) => {
        state.status = "success";
      })
      .addCase(addtask.rejected, (state) => {
        state.status = "fail";
      })

      .addCase(deletetask.pending, (state) => {
        state.status = "pending";
      })
      .addCase(deletetask.fulfilled, (state, action) => {
        state.status = "success";
      })
      .addCase(deletetask.rejected, (state) => {
        state.status = "fail";
      })

      .addCase(edittask.pending, (state) => {
        state.status = "pending";
      })
      .addCase(edittask.fulfilled, (state, action) => {
        state.status = "success";
      })
      .addCase(edittask.rejected, (state) => {
        state.status = "fail";
      });
  },
});

// export const { } = taskSlice.actions;

export default taskSlice.reducer;
