import WebSocket from "ws";
import { PostRooms, SocketUser } from "../types";
import { v4 as uuid } from "uuid";
import { url } from "../utils/utils";

const postRooms: PostRooms = {};

export const createSocket = () => {
  const socket = new WebSocket.Server({ port: 3333 }, () => {
    console.log("WS works on 3333");
  });

  socket.on("connection", (socket: WebSocket) => {
    socket.on("message", async (message: string) => {
      const { type, postId, text, accessToken, commentReplyId } = JSON.parse(message);

      switch (type) {
        case "connect":
          if (!postRooms[postId]) {
            postRooms[postId] = [];
          }
          postRooms[postId].push({ userSocket: socket, id: uuid() });
          break;
        case "message":
          if (postRooms[postId]) {
            const data = {
              text: text,
              accessToken: accessToken,
              postId: postId,
              commentReplyId: commentReplyId,
            };

            const response = await fetch(`${url}/post/createComment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json;charset=utf-8",
              },
              body: JSON.stringify(data),
            });

            if (response.ok) {
              const dataForSender = await response.json();
              dataForSender.postResponse = dataForSender.post;
              dataForSender.isSender = true;
              delete dataForSender.post;

              const dataForReceivers = { ...dataForSender };
              dataForReceivers.isSender = false;
              delete dataForReceivers.accessToken;
              delete dataForReceivers.auth;

              postRooms[postId].forEach((user) =>
                user.userSocket === socket
                  ? user.userSocket.send(JSON.stringify({ type: "message", ...dataForSender }))
                  : user.userSocket.send(JSON.stringify({ type: "message", ...dataForReceivers }))
              );
            } else {
              postRooms[postId]
                .find((user) => user.userSocket === socket)
                ?.userSocket.send(JSON.stringify({ type: "error", text: "Something happend, try to send again" }));
            }
          }
          break;
        case "disconnect":
          const userId = postRooms[postId].findIndex((user) => user.userSocket === socket);

          postRooms[postId].splice(userId, 1);
          if (!postRooms[postId].length) {
            delete postRooms[postId];
          }
      }
    });
  });

  return socket;
};
