"use client"

import ButtonBar from "@/components/ButtonBar";
import { FaFolderOpen } from "react-icons/fa";
import { createContext } from "react";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const websocketClient = () => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_URL+"?auth-token="+
    Cookies.get("auth-token"));
    ws.onopen = () => {
        console.log("Connected to server");
        ws.send("Hello from client");
    };
    ws.onmessage = (msg) => {
        console.log(msg.data);
    }
    ws.onclose = () => {
        console.log("Disconnected from server");
    };
    return ws;
}

export const WebSocketContext = createContext<WebSocket>(null!);

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
    
    const [socket, setSocket] = useState<WebSocket>(null!);

    useEffect(()=>{
        setSocket(websocketClient());
    }, [])

    return (
        <div className="w-full flex flex-col content-center items-start p-10">
            <WebSocketContext.Provider value={socket}>
                <div className="w-full flex content-center items-center justify-between">
                    <p className="text-3xl flex items-center content-center gap-3">
                        <FaFolderOpen />
                        Root Directory
                    </p>
                    <div className="flex gap-4">
                        <ButtonBar />
                    </div>
                </div>
                {children}
            </WebSocketContext.Provider>
        </div>
    );
}