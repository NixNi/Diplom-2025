// import { userActions } from "./../store/user/user.slice";
import { modelActions } from "../store/model/model.slice";
import { bindActionCreators } from "@reduxjs/toolkit";
import { useAppDispatch } from "../store";

const actions = {
  // ...userActions,
  ...modelActions,
};
export const useActions = () => {
  const dispatch = useAppDispatch();
  return bindActionCreators(actions, dispatch);
};
