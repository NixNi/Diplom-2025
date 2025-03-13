import { Response } from "express";

export default async function errorHandler(res: Response, fun: Function) {
  try {
    await fun();
  } catch (err) {
    console.log(err);
    res.status(400).json({ status: "error", message: err });
  }
}
