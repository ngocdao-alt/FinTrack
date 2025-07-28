import Log from "../../models/Log";
import { Request, Response } from "express";

export const getLogs = async (req: Request, res: Response) => {
  const logs = await Log.find().sort({ timestamp: -1 }).limit(200);
  res.json(logs);
};