import FileIcon from "@/components/FileIcon";
import { FaDownload } from "react-icons/fa6";
import { BiSolidRename } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function File({index, file, id, path}:{index:number, file:string, id:string, 
    path:string[]}){
    const router = useRouter();
    return (
        <div key={index} className="w-full flex items-center 
                content-center justify-between cursor-pointer hover:bg-gray-700
                p-2"
                onClick={()=>{
                    router.push("/user/"+id+"/"+(path.length>0?(path as string[]).join("/")+"/":"")+
                    file);
                }}>
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
    )
}