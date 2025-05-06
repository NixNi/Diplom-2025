// import { userActions } from "./../store/user/user.slice";
import { modelActions } from "../store/model/model.slice";
import { bindActionCreators } from "@reduxjs/toolkit";
import { useAppDispatch } from "../store";
import { connectActions } from "../store/connect/connect.slice";

const actions = {
  // ...userActions,
  ...modelActions,
  ...connectActions
};
export const useActions = () => {
  const dispatch = useAppDispatch();
  return bindActionCreators(actions, dispatch);
};
