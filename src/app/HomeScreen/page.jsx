'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomeScreen() {
    const router = useRouter();
    return (
        <div className="flex flex-col justify-center items-center h-screen space-y-5">
            <h1 className="font-bold text-[24px] text-black">Selamat Datang di Website Sistem Pendukung Keputusan</h1>
            <p className="font-light text-[16px] text-gray">website ini adalah sebuah website sistem pendukung keputusan menggunakan metode PSI untuk menentukan apartemen yang cocok sesuai dengan budget</p>
            <button className="bg-blue-500 text-white w-[100px] rounded-[15px] p-2" onClick={() => router.push('/FindApartment')}>
                Mulai
            </button>
        </div>
    );
}
