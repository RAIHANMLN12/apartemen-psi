'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChoiceScreen() {
    const [selectedValue, setSelectedValue] = useState(null);
    const router = useRouter();

    const priceRanges = {
        1: { min: 100000000, max: 350000000 },
        2: { min: 400000000, max: 650000000 },
        3: { min: 650000000, max: 800000000 },
        4: { min: 800000000, max: 1000000000 },
        5: { min: 1000000000, max: Infinity }
    };

    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);

    useEffect(() => {
        if (selectedValue !== null) {
            const priceRange = priceRanges[selectedValue];
            setMinPrice(priceRange.min);
            setMaxPrice(priceRange.max);
        }
    }, [selectedValue]);

    const handleSearch = () => {
        if (selectedValue === null) {
            alert("Silakan pilih rentang harga terlebih dahulu.");
        } else {
            router.push(`/ApartmentScreen?minPriceApartment=${minPrice}&maxPriceApartment=${maxPrice}`);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen space-y-5">
            <h1 className="font-bold text-[24px] text-black">Pilih Rentang Harga Apartemen</h1>
            <div className="flex flex-row space-x-5">
                <button 
                    className={"border rounded-md p-2 " + (selectedValue === 1 ? "bg-blue-500 text-white" : "bg-white text-black")}
                    style={{ borderRadius: '15px' }}
                    onClick={() => setSelectedValue(1)}
                >
                    100-350 Jt
                </button>
                <button 
                    className={"border rounded-md p-2 " + (selectedValue === 2 ? "bg-blue-500 text-white" : "bg-white text-black")}
                    style={{ borderRadius: '15px' }}
                    onClick={() => setSelectedValue(2)}
                >
                    400-650 Jt
                </button>
                <button 
                    className={"border rounded-md p-2 " + (selectedValue === 3 ? "bg-blue-500 text-white" : "bg-white text-black")}
                    style={{ borderRadius: '15px' }}
                    onClick={() => setSelectedValue(3)}
                >
                    650-800 Jt
                </button>
                <button 
                    className={"border rounded-md p-2 " + (selectedValue === 4 ? "bg-blue-500 text-white" : "bg-white text-black")}
                    style={{ borderRadius: '15px' }}
                    onClick={() => setSelectedValue(4)}
                >
                    800-1 M
                </button>
                <button 
                    className={"border rounded-md p-2 " + (selectedValue === 5 ? "bg-blue-500 text-white" : "bg-white text-black")}
                    style={{ borderRadius: '15px' }}
                    onClick={() => setSelectedValue(5)}
                >
                    {">"} 1 M
                </button>
            </div>
            <button className="bg-blue-500 text-white w-[300px] rounded-[15px] p-2" onClick={handleSearch}>
                Cari Apartemen
            </button>
        </div>
    );
}
