import Log from "../models/Log";
import { Request } from "express";

export const logAction = async (
  req: Request & { skipLogActivity?: boolean },
  params: {
    action: string;
    statusCode: number;
    description?: string;
    level?: "info" | "warning" | "error" | "critical";
  }
) => {
  try {
    // Đánh dấu để middleware không log trùng
    req.skipLogActivity = true;

    const userId = (req as any).user?._id?.toString();

    await Log.create({
      userId: userId || undefined,
      action: params.action,
      method: req.method,
      endpoint: req.originalUrl,
      statusCode: params.statusCode,
      description: params.description || "",
      level: params.level || "info",
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("❌ Error logging action:", error);
  }
};
