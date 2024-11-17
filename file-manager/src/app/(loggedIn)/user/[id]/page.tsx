"use client"

import { useContext, useEffect } from "react";
import { WebSocketContext } from "@/app/(loggedIn)/user/layout";
import { useState } from "react";
import { FaDownload } from "react-icons/fa6";
import { BiSolidRename } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import FileIcon from "@/components/FileIcon";

export default function Page() {

    const ws = useContext(WebSocketContext);

    const [fileList, setFileList] = useState<string[]>([]);

    useEffect(() => {
        if (ws && ws.readyState === 1)
            ws.onmessage = (msg) => {
                const data = JSON.parse(msg.data);
                console.log(data);
                setFileList(data.sort());
            }
    }, [ws])

    useEffect(() => {
        if (ws && ws.readyState === 1) {
            ws.send(JSON.stringify({
                Operation: "listFolderContents",
                Dirname: "/"
            }));
        }
    }, [ws])

    return (
        <>
            {
                fileList.length > 0 ?
                <div className="w-full pt-8 flex custom-container-2 flex-col items-center
                content-center justify-center">
                    <div className="w-full flex flex-col items-center content-center gap-5 ">
                        {fileList.map((file, index) => (
                            <div key={index} className="w-full flex items-center 
                            content-center justify-between cursor-pointer hover:bg-gray-700
                            p-2">
                                <div className="flex items-center content-center
                                gap-4">
                                    <FileIcon extension={
                                        file.includes(".") ?
                                        file.split(".")[1]
                                        : "Folder"
                                    } />
                                    <p className="text-xl font-medium">{file}</p>
                                </div>
                                <div className={"flex items-center content-center \
                                justify-between "+(file.includes(".")?"w-[15%]":"w-[8.5%]")}>
                                    {file.includes(".") && <FaDownload fontSize={30}
                                    className="hover:text-gray-400"/>}
                                    <BiSolidRename fontSize={30}
                                    className="hover:text-gray-400"/>
                                    <MdDelete fontSize={30}
                                    className="hover:text-gray-400"/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                :
                <div className="w-full pt-8 flex custom-container-2 flex-col items-center
                content-center justify-center h-[60vh]">
                    <img src="/empty.png" alt="Empty Folder" className="w-[10rem] opacity-40" />
                    <p className="text-lg font-semibold opacity-60">This folder is empty</p>
                </div>
            }
        </>
    );
}