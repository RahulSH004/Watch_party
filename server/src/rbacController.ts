import { Server, Socket } from "socket.io";
import { getRoom } from "./rooms";
import type { Role } from "./models/types";
import { canManageRoom } from "./permission";

export function rbacController(io: Server, socket: Socket) {
  socket.on(
    "assign_role",
    ({
      roomId,
      userId,
      role,
    }: {
      roomId: string;
      userId: string;
      role: Role;
    }) => {
      const room = getRoom(roomId);
      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }
      const requestingParticipant = room.participants.get(socket.id);
      if (
        !requestingParticipant ||
        !canManageRoom(requestingParticipant.role)
      ) {
        socket.emit("error", {
          message: "You do not have permission to assign roles",
        });
        return;
      }
      const targetParticipant = room.participants.get(userId);
      if (!targetParticipant) {
        socket.emit("error", { message: "Target participant not found" });
        return;
      }
      targetParticipant.role = role;

      io.to(roomId).emit("role_assigned", {
        userId: targetParticipant.userId,
        username: targetParticipant.username,
        role: targetParticipant.role,
        participants: [...room.participants.values()],
      });
    },
  );

  socket.on(
    "remove_participant",
    ({ roomId, userId }: { roomId: string; userId: string }) => {
      const room = getRoom(roomId);
      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }
      const requestingParticipant = room.participants.get(socket.id);
      if (
        !requestingParticipant ||
        !canManageRoom(requestingParticipant.role)
      ) {
        socket.emit("error", {
          message: "You do not have permission to remove participants",
        });
        return;
      }
      const targetParticipant = room.participants.get(userId);
      if (!targetParticipant) {
        socket.emit("error", { message: "Target participant not found" });
        return;
      }
      room.participants.delete(userId);
      io.to(roomId).emit("participant_removed", {
        userId: targetParticipant.userId,
        username: targetParticipant.username,
        role: targetParticipant.role,
        participants: [...room.participants.values()],
      });
    },
  );
  socket.on(
    "transfer_host",
    ({ roomId, newHostUserId }: { roomId: string; newHostUserId: string }) => {
      const room = getRoom(roomId);
      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }

      const requestingParticipant = room.participants.get(socket.id);
      if (
        !requestingParticipant ||
        !canManageRoom(requestingParticipant.role)
      ) {
        socket.emit("error", { message: "Only host can transfer host role" });
        return;
      }

      const newHost = room.participants.get(newHostUserId);
      if (!newHost) {
        socket.emit("error", { message: "Target participant not found" });
        return;
      }
      newHost.role = "HOST";
      room.hostId = newHostUserId;

      // purana host ab Moderator
      requestingParticipant.role = "MODERATOR";

      io.to(roomId).emit("role_assigned", {
        userId: newHost.userId,
        username: newHost.username,
        role: newHost.role,
        participants: [...room.participants.values()],
      });
    },
  );
}
