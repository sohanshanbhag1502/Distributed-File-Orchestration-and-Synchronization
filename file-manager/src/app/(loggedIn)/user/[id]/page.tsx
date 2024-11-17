"use client"

import { useContext, useEffect } from "react";
import { WebSocketContext } from "@/app/(loggedIn)/user/layout";
import { useState } from "react";

export default function Page() {

    const ws = useContext(WebSocketContext);

    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (ws && ws.readyState === 1)
            ws.onmessage = (msg) => {
                const data = JSON.parse(msg.data);
                console.log(data);
                setFileList(data);
            }
    }, [ws])

    useEffect(() => {
        if (ws && ws.readyState === 1) {
            // ws.send(JSON.stringify({
            //     Operation: "listFolderContents",
            //     Dirname: "/"
            // }));
        }
    }, [ws])

    return (
        <>
            {
                fileList.length > 0 ?
                <>
                    <div className="grid grid-cols-4 gap-4">
                        
                    </div>
                </> :
                <>
                    <img src="/empty.png" alt="Empty Folder" className="w-[10rem] opacity-40" />
                    <p className="text-lg font-semibold opacity-60">This folder is empty</p>
                </>
            }
        </>
    );
}