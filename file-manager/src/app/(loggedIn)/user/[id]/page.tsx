"use client"

import { useContext, useEffect } from "react";
import { WebSocketContext } from "@/app/(loggedIn)/user/layout";
import { useState } from "react";
import { FaDownload } from "react-icons/fa6";
import { BiSolidRename } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useParams } from "next/navigation";
import FileIcon from "@/components/FileIcon";
import { useSnackbar } from "notistack";

export default function Page() {

    const ws = useContext(WebSocketContext);
    const { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();

    const [fileList, setFileList] = useState<string[]>([]);

    const retriveFileList = () => {
        ws.send(JSON.stringify({
            Operation: "listFolderContents",
            Filepath:"",
            Dirname: `${id}`,
            Newpath:"",
            Data:""
        }));
    }

    useEffect(() => {
        try{
            ws.onmessage = (msg) => {
                let data=[];
                try{
                    data = JSON.parse(msg.data);
                }
                catch{
                    enqueueSnackbar(msg.data, { variant: "success" });
                    retriveFileList();
                    return
                }
                setFileList(data.sort());
            }
            retriveFileList();
        }
        catch(e){
            console.log(e);
            return
        }
    }, [ws, id]);

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
                                    <p className="text-xl font-medium">{file.includes(".") ?
                                        file
                                        : file.slice(0, -1)}</p>
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