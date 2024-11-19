import { IoMdClose } from "react-icons/io";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useContext, useRef } from "react";
import { WebSocketContext } from "@/app/(loggedIn)/user/layout";
import { useParams } from "next/navigation";
import { FaUpload } from "react-icons/fa";

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
});

export default function FileUploader({
    setShowUploader
}: {
    setShowUploader: React.Dispatch<React.SetStateAction<boolean>>;
}) {

    const { id, path }:{id:string, path:string[]} = useParams();
    const refUploadFile = useRef<any>(null);

    const ws = useContext(WebSocketContext);

    const handleFileUpload =async () => {
        const file = refUploadFile.current.files[0];
        
        const reader = new FileReader();
        reader.addEventListener("load", (e: any) => {
            const base64 = arrayBufferToBase64(e.target.result);
            ws.send(JSON.stringify({
                "Operation": "updateFile",
                "Filepath": `${id}/${(path && path.length>0)?path.join("/")+"/":""}${file.name}`,
                "Dirname": `${id}/${(path && path.length>0)?path.join("/")+"/":""}`,
                "Newpath": "",
                "Data": base64
            }))
        })
    
        reader.readAsArrayBuffer(file)
    }

    function arrayBufferToBase64(arrayBuffer: any) {
        let binaryString = '';
        const bytes = new Uint8Array(arrayBuffer);
        for (let i = 0; i < bytes.byteLength; i++) {
          binaryString += String.fromCharCode(bytes[i]);
        }
        return btoa(binaryString);
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <div className="w-full absolute top-0 left-0 h-screen bg-black z-10 bg-opacity-60
            flex items-center content-center justify-center">
                <div className="flex flex-col content-center items-center justify-center bg-black w-1/3 
                shadow-md shadow-white rounded-2xl p-10 gap-4">
                    <div className="w-full flex justify-between">
                        <p className="text-xl font-semibold">Upload File</p>
                        <button className="text-2xl font-bold hover:text-gray-500" onClick={()=>{
                            setShowUploader(false);
                        }}>
                            <IoMdClose />
                        </button>
                    </div>
                    <input type="file" ref={refUploadFile}
                    className="w-full font-bold text-xl border-2 border-white 
                        rounded-full px-4 p-1 transition-all
                        duration-150 flex items-center gap-2 cursor-pointer" />
                    <button className="font-bold text-xl border-2 border-white rounded-full 
                    px-4 p-1 transition-all duration-150 flex items-center gap-2 disabled:opacity-50 
                    cursor-pointer hover:bg-white hover:text-black"
                    onClick={(e)=>{
                        e.preventDefault()
                        handleFileUpload();
                        setShowUploader(false);
                        e.stopPropagation();
                    }}>
                        <FaUpload />
                        Upload File
                    </button>
                </div>
            </div>
        </ThemeProvider>
    )
}