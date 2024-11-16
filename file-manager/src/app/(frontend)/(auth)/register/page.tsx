"use client"

import Link from "next/link";
import { useSnackbar } from "notistack";
import { MouseEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const postRegister =async (e : MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const response = await fetch("/api/fetch", {
            method: "POST",
            body: JSON.stringify({ 
                link:"/auth/signup", 
                body: { username, password }
            })
        });
        const res = await response.json();
        if (response.status === 201) {
            enqueueSnackbar("User Created Successfully", { variant: "success" });
            router.push("/login");
        }
        else if (res){
            enqueueSnackbar(res.message, { variant: "error" });
        }
        else{
            enqueueSnackbar("Something went wrong", { variant: "error" });
        }
    }

    return (
        <>
            <p className="text-4xl font-bold">Register as a New User</p>
            <input 
            type="text" 
            placeholder="Username" 
            className="p-2 border-[1px] active:border-[1px] rounded-full text-white 
            bg-black w-full text-center text-xl"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            />
            <input 
            type="password" 
            placeholder="Password" 
            className="p-2 border-[1px] active:border-[1px] rounded-full text-white 
            bg-black w-full text-center text-xl" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <button
            type="submit"
            className="p-2 bg-blue-700 text-white rounded-full text-xl w-[50%]
            hover:bg-blue-600 font-semibold"
            onClick={postRegister}>
                Signup
            </button>
            <p className="font-medium text-lg">
                Have a account already?&nbsp;&nbsp;
                <Link href="/login" className="text-blue-700 underline"> 
                    Login
                </Link>
            </p>
        </>
    );
}