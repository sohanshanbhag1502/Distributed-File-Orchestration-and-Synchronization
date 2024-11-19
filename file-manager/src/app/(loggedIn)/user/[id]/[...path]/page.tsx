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
    const [content, setContent] = useState<string>("");
    const name = (path as string[])[path.length-1];

    const retriveFileList = () => {
        if (name.includes(".")){
            ws.send(JSON.stringify({
                Operation: "previewFile",
                Filepath:`${id}/${path.length>0 ? (path as string[]).join("/") : ""}`,
                Dirname: "",
                Newpath:"",
                Data:""
            }));
        }
        else{
            ws.send(JSON.stringify({
                Operation: "listFolderContents",
                Filepath:"",
                Dirname: `${id}/${path.length>0 ? (path as string[]).join("/") : ""}`,
                Newpath:"",
                Data:""
            }));
        }
    }

    useEffect(() => {
        try{
            ws.onmessage = (msg) => {
                let data=[];
                const ms: string = msg.data;
                try{
                    if (ms.startsWith("preview:")){
                        const decodedContent = atob(msg.data.slice(8));
                        setContent(decodedContent);
                        return;
                    }
                    else if (ms.startsWith("download:")) {
                        const datas:string[] = ms.slice(9).split("|");
                        const filename = datas[0];
                        const base64Data = datas[1];
                        const binaryData = atob(base64Data);
                        const byteArray = new Uint8Array(binaryData.length);
                
                        for (let i = 0; i < binaryData.length; i++) {
                          byteArray[i] = binaryData.charCodeAt(i);
                        }
                
                        const blob = new Blob([byteArray], { type: "octet/stream" });
                        const url = URL.createObjectURL(blob);
                
                        const a = document.createElement("a");
                        a.style.display = "none";
                        a.href = url;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        URL.revokeObjectURL(url);
                
                        enqueueSnackbar("File downloaded successfully", { variant:"success" });
                        return;
                    }
                    else{
                        data = JSON.parse(ms);
                    }
                }
                catch{
                    enqueueSnackbar(ms, { variant: ms.includes("Error")?"error":"success" });
                    retriveFileList();
                    return
                }
                setFileList(data);
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
                !name.includes(".") ?
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
                :
                <div className="w-full pt-8 flex custom-container-2 flex-col items-center
                    content-center justify-center">
                    <div className="w-full flex flex-col items-center content-center gap-5">
                        <p className="text-2xl font-semibold">{name}</p>
                        <textarea className="w-full h-[60vh] border border-gray-300 rounded-md p-4
                        bg-black"
                        value={content} readOnly/>
                    </div>
                </div>
            }
        </>
    );
}