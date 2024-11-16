import NavBar from "@/components/NavBar";

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <>
        <NavBar />
        <div className="w-full h-full flex flex-col items-center content-center justify-center p-10 
        gap-10">
            <form className="mt-[2%] w-[45%] flex flex-col p-[40px] gap-10 border-[1px] 
            border-white shadow-lg shadow-white items-center content-center justify-center 
            rounded-2xl">
                <div className="w-full flex flex-col items-center content-center justify-center 
                gap-7">
                    {children}
                </div>
            </form>
        </div>
      </>
  );
}