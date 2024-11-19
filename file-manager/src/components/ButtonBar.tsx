"use client"

import { IoMdArrowRoundBack } from "react-icons/io";
import { useState, useEffect, useContext, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaUpload } from "react-icons/fa6";
import { TbFolderPlus } from "react-icons/tb";
import NewFolder from "@/components/NewFolder";
import { WebSocketContext } from "@/app/(loggedIn)/user/layout";

function arrayBufferToBase64(arrayBuffer: any) {
    let binaryString = '';
    const bytes = new Uint8Array(arrayBuffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binaryString += String.fromCharCode(bytes[i]);
    }
    return btoa(binaryString);
  }

export default function ButtonBar() {
    const [disabled, setDisabled] = useState(true);
    const router = useRouter();
    const params = useParams();
    const context = useContext(WebSocketContext)
    const refUploadFile = useRef<any>(null);
  
    const [showNewFolder, setShowNewFolder] = useState(false);

    const handleFileUpload = (e: any) => {
        const file = refUploadFile.current.files[0];
        let path = params.id;
        if (params.path) {
            path += "/" + params.path.join("/")
        }
        console.log(file)
        
        const reader = new FileReader();
        reader.addEventListener("load", (e: any) => {
            const base64 = arrayBufferToBase64(e.target.result);
            context.send(JSON.stringify({
                "Operation": "updateFile",
                "Filepath": `${path}/${file.name}`,
                "Dirname": `${path}`,
                "Newpath": "",
                "Data": base64
            }))
        })

        reader.readAsArrayBuffer(file)
    }

    return (
        <>
            {showNewFolder && <NewFolder setShowNewFolder={setShowNewFolder}/>}
            <button className={"font-bold text-xl border-2 border-white rounded-full px-4 p-1 \
            transition-all duration-150 flex items-center gap-2 disabled:opacity-50 "+
            (disabled?"cursor-not-allowed":"cursor-pointer hover:bg-white hover:text-black")}
                disabled={disabled}
                onClick={(e)=>{
                    e.preventDefault();
                    router.push(`/user/${params.id}/${
                        (params.path as string[]).slice(0, -1).join('/')}`);
                }}>
                <IoMdArrowRoundBack />
                Back
            </button>
            <button className="font-bold text-xl border-2 border-white rounded-full px-4 p-1
            transition-all duration-150 flex items-center gap-2 disabled:opacity-50 cursor-pointer 
            hover:bg-white hover:text-black"
            onClick={(e)=>{
                e.preventDefault();
                setShowNewFolder(!showNewFolder);
            }}>
                <TbFolderPlus />
                Create new folder
            </button>
            <input type="file" ref={refUploadFile}
             className="font-bold text-xl border-2 border-white 
                rounded-full px-4 p-1 hover:bg-white hover:text-black transition-all
                duration-150 flex items-center gap-2 cursor-pointer" />
            <button onClick={handleFileUpload} className="font-bold text-xl border-2 border-white 
                rounded-full px-4 p-1 hover:bg-white hover:text-black transition-all
                duration-150 flex items-center gap-2 cursor-pointer">
                Uploade File
            </button>

        </>
    )
}