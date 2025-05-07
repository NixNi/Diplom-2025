import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModelControls, ModelPositions } from "../../types/models";

interface ModelState {
  id: number;
  name: string;
  modelControls: ModelControls;
  positions: ModelPositions;
  isEnabled: boolean;
  isControlsEnabled: boolean;
  isEmergencyStoped: boolean;
  isLoadingControls: boolean;
  isErrorControls: boolean;
  isLoadingData: boolean;
  isErrorData: boolean;
  errorMessage: string | null;
  mode: "online" | "offline";
}

const initialState: ModelState = {
  id: 0,
  name: "default",
  modelControls: { models: {}, controlElements: [] },
  positions: {},
  isEnabled: true,
  isControlsEnabled: true,
  isEmergencyStoped: false,
  isLoadingControls: false,
  isErrorControls: false,
  isLoadingData: false,
  isErrorData: false,
  errorMessage: null,
  mode: "offline",
};

export const updateModelDataAsync = createAsyncThunk<ArrayBuffer, void>(
  "model/updateModelDataAsync",
  async (_, { getState, signal }) => {
    const state = getState() as { model: ModelState };
    const modelName = state.model.name;

    if (!modelName || modelName === "default") {
      throw new Error("Choose a model");
    }

    try {
      const response = await fetch(
        `http://localhost:8046/api/models/${modelName}`,
        { signal }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch model data: ${response.statusText}`);
      }
      return await response.arrayBuffer();
    } catch (error) {
      throw new Error(`Error fetching model data: ${(error as Error).message}`);
    }
  }
);

export const updateModelControlsAsync = createAsyncThunk(
  "model/updateModelControlsAsync",
  async (_, { getState, signal }) => {
    const state = getState() as { model: ModelState };
    const modelName = state.model.name;

    if (!modelName || modelName === "default") {
      throw new Error("Choose a model");
    }

    try {
      const response = await fetch(
        `http://localhost:8046/api/json/${modelName}`,
        { signal }
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch model controls: ${response.statusText}`
        );
      }
      const updatedModelData = await response.json(); // Используем response.json() вместо arrayBuffer
      return updatedModelData;
    } catch (error) {
      throw new Error(
        `Error fetching model controls: ${(error as Error).message}`
      );
    }
  }
);

export const sendModelCommandAsync = createAsyncThunk(
  "model/sendModelCommandAsync",
  async (
    command: { command: "set" | "add"; path: string; value: number },
    { getState }
  ) => {
    const state = getState() as {
      model: ModelState;
      connect: { ip: string | null; port: number | null };
    };
    const { ip, port } = state.connect;
    console.log(command)
    if (!ip || !port) {
      throw new Error("Connection details are missing");
    }

    try {
      const response = await fetch(
        `http://localhost:8046/api/connect/command`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ command, connect: state.connect }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to send command: ${response.statusText}`);
      }

      return command;
    } catch (error) {
      throw new Error(`Error sending command: ${(error as Error).message}`);
    }
  }
);

export const modelSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    setModelName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
      state.modelControls = { models: {}, controlElements: [] };
      state.positions = {};
      state.isControlsEnabled = true;
      state.isEnabled = true;
      state.isEmergencyStoped = false;
      state.isLoadingControls = false;
      state.isErrorControls = false;
      state.errorMessage = null;
    },
    switchEanbled: (state) => {
      state.isEnabled = !state.isEnabled;
      if (state.isEnabled) {
        state.isControlsEnabled = true;
        state.isEmergencyStoped = false;
      }
    },
    setMode: (state, action: PayloadAction<"online" | "offline">) => {
      state.mode = action.payload;
    },
    setControlsEnabled: (state, action: PayloadAction<boolean>) => {
      state.isControlsEnabled = action.payload;
    },
    setEmergency: (state) => {
      state.isEmergencyStoped = true;
    },
    resetModelState: (state) => {
      state.modelControls = { models: {}, controlElements: [] };
      state.positions = {};
      state.isControlsEnabled = true;
      state.isEnabled = true;
      state.isEmergencyStoped = false;
      state.isLoadingControls = false;
      state.isErrorControls = false;
      state.errorMessage = null;
      state.name = "default";
    },
    updatePositionsLocal: (state, action: PayloadAction<ModelPositions>) => {
      state.positions = action.payload;
    },
    updateModelPositionLocal: (
      state,
      action: PayloadAction<{
        command: "set" | "add";
        path: string;
        value: number;
      }>
    ) => {
      const { command, path, value } = action.payload;
      const path_spl = path.split("/");
      if (path_spl.length === 0) return;

      let current: any = state.positions;
      let currentControls: any = state.modelControls.models;
      for (let i = 0; i < path_spl.length - 1; i++) {
        const key = path_spl[i];
        if (!current[key]) {
          current[key] = {};
        }
        if (!currentControls[key]) {
          currentControls[key] = {};
        }
        current = current[key];
        currentControls = currentControls[key];
      }

      // Имя конечного свойства
      const lastKey = path_spl[path_spl.length - 1];
      if (!currentControls[lastKey] || currentControls[lastKey].length !== 2)
        currentControls[lastKey] = [-10, 10];
      const [min, max] = currentControls[lastKey] as [number, number];

      // Обновляем значение в зависимости от команды
      if (command === "set") {
        current[lastKey] = Math.max(Math.min(value, max), min);
      } else if (command === "add") {
        current[lastKey] = Math.max(
          Math.min((current[lastKey] || 0) + value, max),
          min
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Обработка updateModelDataAsync (modelData)
      .addCase(updateModelDataAsync.pending, (state) => {
        state.isLoadingData = true;
        state.isErrorData = false;
        state.errorMessage = null;
      })
      .addCase(updateModelDataAsync.fulfilled, (state) => {
        state.isLoadingData = false;
        // Не сохраняем modelData в состоянии
      })
      .addCase(updateModelDataAsync.rejected, (state, action) => {
        state.isLoadingData = false;
        state.isErrorData = true;
        state.errorMessage =
          action.error.message || "Failed to fetch model data";
      })
      .addCase(updateModelControlsAsync.pending, (state) => {
        state.isLoadingControls = true;
        state.isErrorControls = false;
        state.errorMessage = null;
      })
      .addCase(updateModelControlsAsync.fulfilled, (state, action) => {
        state.isLoadingControls = false;
        state.modelControls = action.payload;
      })
      .addCase(updateModelControlsAsync.rejected, (state, action) => {
        state.isLoadingControls = false;
        state.isErrorControls = true;
        state.errorMessage =
          action.error.message || "Failed to fetch model controls";
      });
  },
});

export const modelActions = {
  ...modelSlice.actions,
  updateModelControlsAsync,
  updateModelDataAsync,
  sendModelCommandAsync
};
export const modelReducer = modelSlice.reducer;
