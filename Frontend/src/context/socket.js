import { createContext } from "react";
import { io } from "socket.io-client"

const socket = io("http://localhost:7000");

export const SocketContext = createContext(socket, { autoConnect: false });

export default socket;