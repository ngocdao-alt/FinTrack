// src/socket/sessionTracker.ts
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { SessionModel } from "../models/Session";

const JWT_SECRET = process.env.JWT_SECRET!;

const activeSessions = new Map<string, string>(); // userId -> sessionId

export const setupSessionTracking = (io: Server) => {
  console.log("📡 [SessionTracker] Socket.IO session tracking is active");

  io.on("connection", (socket) => {
    const token = socket.handshake.auth.token;

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as unknown as { id: string };
      const userId = decoded.id;
      socket.data.userId = userId;

      console.log("✅ [Socket] Connected user:", userId);

      socket.conn.on("packet", (packet) => {
        if (packet.type === "ping") console.log("📶 [Server] Ping received");
        if (packet.type === "pong") console.log("📡 [Server] Pong received");
      });

      // Tạo session login mới
      const loginTime = new Date();
      SessionModel.create({ userId, loginAt: loginTime })
        .then((session) => {
          activeSessions.set(userId, session._id.toString());
          console.log(`📥 [Session] Created for user ${userId}: ${session._id}`);
        })
        .catch((err) => {
          console.error("❌ [Session] Failed to create session:", err);
        });

      // Xử lý disconnect
      socket.on("disconnect", async () => {
        console.log(`❌ [Socket] Disconnected user ${userId}`);

        const sessionId = activeSessions.get(userId);
        if (!sessionId) return console.warn(`⚠️ No session found for ${userId}`);

        try {
          const logoutTime = new Date();
          const session = await SessionModel.findById(sessionId);
          if (session && !session.logoutAt) {
            session.logoutAt = logoutTime;
            session.duration = Math.floor((logoutTime.getTime() - session.loginAt.getTime()) / 1000);
            await session.save();
            console.log(`📤 [Session] Closed for ${userId}, Duration: ${session.duration}s`);
          }
        } catch (err) {
          console.error("❌ [Session] Error updating session:", err);
        }

        activeSessions.delete(userId);
      });

    } catch (err: any) {
      console.error("❌ [Socket] Invalid token:", err.message);
      socket.disconnect(true); // Đá văng client luôn
    }
  });
};
