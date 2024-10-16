import { hash, compare } from "bcryptjs";

export const encryptPassword = async (password: string) => {
  return await hash(password, 10);
};

export const comparePassword = async (
  passwordPlain: string,
  hashPassword: string
) => {
  return await compare(passwordPlain, hashPassword);
};
