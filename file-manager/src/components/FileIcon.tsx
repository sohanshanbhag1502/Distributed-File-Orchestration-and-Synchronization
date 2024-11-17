import { FaFilePdf, FaFileImage, FaFileExcel, FaFilePowerpoint, FaFileCode, FaFileArchive, 
    FaFileAudio, FaFileVideo, FaFile, FaFileAlt, FaFileWord, FaFolder } from 'react-icons/fa';

export default function FileIcon({ extension }: Readonly<{
    extension: string;
}>) {
    return (
        <>
            {
                extension === "pdf" ?
                <FaFilePdf fontSize={40} className="text-red-500" /> :
                extension === "png" || extension === "jpg" || extension === "jpeg" ?
                <FaFileImage fontSize={40} className="text-blue-300" /> :
                extension === "docx" || extension === "doc" ?
                <FaFileWord fontSize={40} className="text-blue-500" /> :
                extension === "xlsx" || extension === "xls" ?
                <FaFileExcel fontSize={40} className="text-green-500" /> :
                extension === "pptx" || extension === "ppt" ?
                <FaFilePowerpoint fontSize={40} className="text-yellow-500" /> :
                extension === "c" || extension === "cpp" || extension === "js" || extension === "ts" || extension === "py" ?
                <FaFileCode fontSize={40} className="text-yellow-500" /> :
                extension === "zip" || extension === "rar" || extension === "tar" || extension === "gz" ?
                <FaFileArchive fontSize={40} className="text-gray-500" /> :
                extension === "mp3" || extension === "wav" || extension === "flac" || extension === "m4a" ?
                <FaFileAudio fontSize={40} className="text-blue-300" /> :
                extension === "mp4" || extension === "mkv" || extension === "avi" || extension === "mov" ?
                <FaFileVideo fontSize={40} className="text-blue-300" /> :
                extension === "txt" ?
                <FaFileAlt fontSize={40} className="text-blue-500" /> :
                extension === "Folder" ?
                <FaFolder fontSize={40} className="text-blue-500" /> :
                <FaFile fontSize={40} className="text-white" />
            }
        </>
    );
}