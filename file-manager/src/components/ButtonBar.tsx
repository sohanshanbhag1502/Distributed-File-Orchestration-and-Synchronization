"use client"

import { IoMdArrowRoundBack } from "react-icons/io";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaUpload } from "react-icons/fa6";
import { TbFolderPlus } from "react-icons/tb";
import NewFolder from "@/components/NewFolder";
import FileUploader from "@/components/FileUploader";



export default function ButtonBar() {
    const [disabled, setDisabled] = useState(true);
    const router = useRouter();
    const params = useParams();
    const path = params.path as string[];
  
    const [showNewFolder, setShowNewFolder] = useState(false);
    const [showUploader, setShowUploader] = useState(false);

    useEffect(()=>{
        if (params.path === undefined) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }, [params])


    return (
        <>
            {showNewFolder && <NewFolder setShowNewFolder={setShowNewFolder}/>}
            {showUploader && <FileUploader setShowUploader={setShowUploader}/>}
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
            <button className={"font-bold text-xl border-2 border-white rounded-full px-4 p-1 \
            transition-all duration-150 flex items-center gap-2 disabled:opacity-50 "+
            ((path?(path[path.length-1].includes(".")):false)?"cursor-not-allowed":"cursor-pointer hover:bg-white hover:text-black")}
            onClick={(e)=>{
                e.preventDefault();
                setShowNewFolder(!showNewFolder);
            }}
            disabled={path?(path[path.length-1].includes(".")):false}>
                <TbFolderPlus />
                Create new folder
            </button>
            <button onClick={()=>setShowUploader(true)} className="font-bold text-xl border-2 border-white 
                rounded-full px-4 p-1 hover:bg-white hover:text-black transition-all
                duration-150 flex items-center gap-2 cursor-pointer">
                <FaUpload />
                Upload File
            </button>

        </>
    )
}