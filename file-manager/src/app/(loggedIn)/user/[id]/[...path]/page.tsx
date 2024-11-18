"use client"

import { useContext, useEffect } from "react";
import { WebSocketContext } from "@/app/(loggedIn)/user/layout";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useSnackbar } from "notistack";
import File from "@/components/File";

export default function Page() {
    const ws = useContext(WebSocketContext);
    const { id, path } = useParams();
    const { enqueueSnackbar } = useSnackbar();

    const [fileList, setFileList] = useState<string[]>([]);

    const retriveFileList = () => {
        ws.send(JSON.stringify({
            Operation: "listFolderContents",
            Filepath:"",
            Dirname: `${id}/${path.length>0 ? (path as string[]).join("/") : ""}`,
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
            ws.onopen = retriveFileList;
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
                    <div className="w-full flex flex-col items-center content-center gap-5">
                        {fileList.map((file, index) => <File key={index} index={index} file={file} 
                        id={id as string} path={path as string[]} ws={ws}/>)}
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