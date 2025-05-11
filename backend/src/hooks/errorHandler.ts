import { Response } from "express";

export default async function errorHandler(res: Response, fun: Function) {
  try {
    await fun();
  } catch (err: any) {
    console.log(err.message);
    res.status(400).json({ status: "error", message: err.message });
  }
}
