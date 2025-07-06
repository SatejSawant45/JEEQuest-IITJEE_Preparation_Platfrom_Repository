import { createContext } from "react";
import { io } from "socket.io-client"

const socketUrl = import.meta.env.VITE_SOCKET_URL; 
const socket = io(socketUrl);

export const SocketContext = createContext(socket, { autoConnect: false });

export default socket;