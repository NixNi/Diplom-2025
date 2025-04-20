import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModelControls, ModelPositions, xyz } from "../../types/models";

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
}

const initialState: ModelState = {
  id: 0,
  name: "default",
  modelControls: { models: [], controlElements: [] },
  positions: { models: [] },
  isEnabled: true,
  isControlsEnabled: true,
  isEmergencyStoped: false,
  isLoadingControls: false,
  isErrorControls: false,
  isLoadingData: false,
  isErrorData: false,
  errorMessage: null,
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

export const modelSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    setModelName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    switchEanbled: (state) => {
      state.isEnabled = !state.isEnabled;
      if (state.isEnabled) {
        state.isControlsEnabled = true;
        state.isEmergencyStoped = false;
      }
    },
    setControlsEnabled: (state, action: PayloadAction<boolean>) => {
      state.isControlsEnabled = action.payload;
    },
    resetModelState: (state) => {
      state.modelControls = { models: [], controlElements: [] };
      state.positions = { models: [] };
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
        name: string;
        position?: xyz;
        rotation?: xyz;
      }>
    ) => {
      const { name, position, rotation } = action.payload;
      state.positions.models = [
        ...state.positions.models.filter((m) => m.name !== name),
        { name, position, rotation },
      ];
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
};
export const modelReducer = modelSlice.reducer;
