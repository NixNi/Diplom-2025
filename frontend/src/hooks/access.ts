import { useAppSelector } from "./redux";

export default function useHasAccess(userId: number){
  const currentUser = useAppSelector((state) => state.user);
  return currentUser.id === userId || currentUser.role == "ADMIN";
  
}

export function useHasAccessRestricted(userId: number) {
  const currentUser = useAppSelector((state) => state.user);
  return currentUser.id === userId;
}

export function useHasAdminAccess() {
  const currentUser = useAppSelector((state) => state.user);
  return currentUser.role == "ADMIN";
}