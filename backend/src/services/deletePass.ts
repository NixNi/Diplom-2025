import user from "src/types/user";

export default function deletePass(user: user) {
  const userWithoutPass: Omit<user, "password"> = {
    id: user.id,
    login: user.login,
    info: user.info,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
  return userWithoutPass;
}