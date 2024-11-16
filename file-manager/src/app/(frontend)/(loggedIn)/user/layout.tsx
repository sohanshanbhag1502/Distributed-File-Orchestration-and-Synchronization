import ButtonBar from "@/components/ButtonBar";
import { FaFolderOpen } from "react-icons/fa";

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <div className="w-full flex flex-col content-center items-start p-10">
            <div className="w-full flex content-center items-center justify-between">
                <p className="text-3xl flex items-center content-center gap-3">
                    <FaFolderOpen />
                    Root Directory
                </p>
                <div className="flex gap-4">
                    <ButtonBar />
                </div>
            </div>
            <div className="w-full pt-4 flex custom-container-2 flex-col items-center
            content-center justify-center h-[60vh]">
                {children}
            </div>
        </div>
  );
}