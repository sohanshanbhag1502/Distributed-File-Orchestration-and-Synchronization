import FileIcon from "@/components/FileIcon";
import { FaDownload } from "react-icons/fa6";
import { BiSolidRename } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Rename from "@/components/Rename";

export default function File({index, file, id, path, ws}:{index:number, file:string, id:string, 
    path:string[], ws:WebSocket}){
    const router = useRouter();

    const [showRename, setShowRename] = useState(false);

    return (
        <div key={index} className="w-full flex items-center 
            content-center justify-between cursor-pointer hover:bg-gray-700
            p-2"
            onClick={()=>{
                router.push("/user/"+id+"/"+(path.length>0?(path as string[]).join("/")+"/":"")+
                file);
            }}>
                {showRename && <Rename setShowRename={setShowRename} oldName={file}/>}
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
                    className="hover:text-gray-400"
                    onClick={(e)=>{
                        setShowRename(!showRename);
                        e.stopPropagation();
                    }}/>
                    <MdDelete fontSize={30}
                    className="hover:text-gray-400"
                    onClick={(e)=>{
                        ws.send(JSON.stringify({
                            Operation: file.includes(".")?"deleteFile":"deleteFolder",
                            Filepath: file.includes(".")?`${id}/${path.length>0?(path as string[]).join("/")+"/":""}`+file:"",
                            Dirname: file.includes(".")?"":`${id}/${path.length>0?(path as string[]).join("/")+"/":""}`+file,
                            Newpath: "",
                            Data: ""
                        }));
                        e.stopPropagation();
                    }}/>
                </div>
            </div>
    )
}