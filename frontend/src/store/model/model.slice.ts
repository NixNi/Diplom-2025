import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CommandResponse,
  HardwareState,
  ModelControls,
  ModelPositions,
  ValuesArray,
} from "../../types/models";
// import { sendCommand } from "../../hooks/socket";
import { sendCommand, sendState } from "../../socket";

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

export const modelSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    //################_______OFFLINE MODE_______####################
    setModelName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
      state.modelControls = { models: {}, controlElements: [] };
      state.positions = {};
      state.isControlsEnabled = true;
      state.isEnabled = true;
      state.isEmergencyStoped = false;
      state.isLoadingControls = false;
      state.isErrorControls = false;
      state.isLoadingData = false;
      state.isErrorData = false;
      state.errorMessage = null;
    },
    setMode: (state, action: PayloadAction<"online" | "offline">) => {
      state.mode = action.payload;
    },
    resetModelState: (state) => {
      state.modelControls = { models: {}, controlElements: [] };
      state.positions = {};
      state.isControlsEnabled = true;
      state.isEnabled = true;
      state.isEmergencyStoped = false;
      state.isLoadingControls = false;
      state.isErrorControls = false;
      state.isLoadingData = false;
      state.isErrorData = false;
      state.errorMessage = null;
      state.mode = "offline";
      state.name = "default";
    },
    updatePositionsLocal: (state, action: PayloadAction<ModelPositions>) => {
      state.positions = action.payload;
    },
    updateState: (state, actions: PayloadAction<HardwareState>) => {
      state.isControlsEnabled =
        actions.payload.isControlsEnabled === undefined
          ? state.isControlsEnabled
          : actions.payload.isControlsEnabled;
      state.isEmergencyStoped =
        actions.payload.isEmergencyStoped === undefined
          ? state.isEmergencyStoped
          : actions.payload.isEmergencyStoped;
      state.isEnabled =
        actions.payload.isEnabled === undefined
          ? state.isEnabled
          : actions.payload.isEnabled;
    },
    //##############################################################
    //#################_______ONLINE MODE_______####################
    updateParametersFromHardware: (
      state,
      action: PayloadAction<{ Parameter: string; Value: number }[]>
    ) => {
      const StatesArray = action.payload;
      for (let item of StatesArray) {
        if (item.Parameter === "isEnabled") {
          state.isEnabled = Boolean(item.Value);
          // console.log(item.Value);
          continue;
        }
        if (item.Parameter === "isEmergencyStoped") {
          state.isEmergencyStoped = Boolean(item.Value);
          continue;
        }
        if (item.Parameter === "isControlsEnabled") {
          state.isControlsEnabled = Boolean(item.Value);
          continue;
        }
        const path_spl = item.Parameter.split("/");
        if (path_spl.length === 0) return;
        let current: any = state.positions;
        for (let i = 0; i < path_spl.length - 1; i++) {
          const key = path_spl[i];
          if (!current[key]) {
            current[key] = {};
          }
          current = current[key];
        }

        const lastKey = path_spl[path_spl.length - 1];
        current[lastKey] = item.Value;
      }
    },
    updateSetModelPositionOnline: (
      state,
      action: PayloadAction<ValuesArray>
    ) => {
      if (state.mode === "online") {
        for (let valPath of action.payload) {
          const command: CommandResponse = {
            command: "set",
            path: valPath.path,
            value: valPath.value,
          };
          sendCommand(command);
        }
        return;
      }
    },
    switchEanbled: (state) => {
      const TemporaryState: HardwareState = {};
      TemporaryState.isEnabled = !state.isEnabled;
      if (TemporaryState.isEnabled) {
        TemporaryState.isControlsEnabled = true;
        TemporaryState.isEmergencyStoped = false;
      }
      if (state.mode === "online") {
        sendState(TemporaryState);
        return;
      }
      state.isEnabled = TemporaryState.isEnabled;
      state.isControlsEnabled =
        TemporaryState.isControlsEnabled === undefined
          ? state.isControlsEnabled
          : TemporaryState.isControlsEnabled;
      state.isEmergencyStoped =
        TemporaryState.isEmergencyStoped === undefined
          ? state.isEmergencyStoped
          : TemporaryState.isEmergencyStoped;
    },

    setControlsEnabled: (state, action: PayloadAction<boolean>) => {
      if (state.mode === "online") {
        sendState({ isControlsEnabled: action.payload });
        return;
      }
      state.isControlsEnabled = action.payload;
    },
    setEmergency: (state) => {
      if (state.mode === "online") {
        sendState({ isEmergencyStoped: true });
        return;
      }
      state.isEmergencyStoped = true;
    },
    updateModelPositionLocal: (
      state,
      action: PayloadAction<CommandResponse>
    ) => {
      const { command, path, value, isNeedOnlineCheck = true } = action.payload;
      if (state.mode === "online" && isNeedOnlineCheck) {
        sendCommand(action.payload);
        return;
      }
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
    //##############################################################
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
