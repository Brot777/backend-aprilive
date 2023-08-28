import { hash, compare } from "bcryptjs";

export const encryptPassword = async (password: string) => {
  return await hash(password, 10);
};

export const comparePassword = async (
  password: string,
  receivedPassword: string
) => {
  return await compare(password, receivedPassword);
};
