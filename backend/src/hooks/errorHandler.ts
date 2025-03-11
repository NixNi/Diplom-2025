import { Response } from "express";

export default async function errorHandler(res: Response, fun: Function) {
  try {
    await fun();
  } catch (err) {
    console.log(err);
    res.json({ status: "error", error: err });
  }
}
