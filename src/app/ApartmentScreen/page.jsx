'use client'
import { useState, useEffect } from "react";
import { Suspense } from 'react';
import { useSearchParams, useRouter } from "next/navigation";

export default function ApartmentScreen() {
    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams(); // Pemindahan pemanggilan useSearchParams di luar useEffect
    const router = useRouter();

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('https://script.google.com/macros/s/AKfycbxShyjKPTRycMv9-Kkv_CjvRMphrUshSnIOZQbrTr7i7Vk7V3Dd3SaSrBvKTxofTM_2mw/exec');
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          const data = await response.json();
  
          // Filter apartemen berdasarkan rentang harga
          const filteredApartments = data.filter(apartment => {
            const price = apartment.harga;
            return price >= searchParams.get("minPriceApartment") && price <= searchParams.get("maxPriceApartment");
          });
          setApartments(filteredApartments);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setLoading(false);
        }
      };
  
      fetchData();
    }, [searchParams]); // Ubah kembali dependensi useEffect ke [searchParams]
  
    if (loading) {
      return <div className="flex flex-col justify-center items-center h-screen">Loading...</div>;
    }
  
    return (
      <div className="flex flex-col justify-center items-center space-y-5 my-5">
        <h1 className="font-bold text-[24px] text-black">Rekomendasi Apartemen</h1>
        {MetodePsi(apartments).map((item, index) => {
            return (
                <div key={index} className="border rounded-[15px] p-4 shadow-md w-[600px] space-y-5">
                    <h2 className="text-[16px] font-semibold mb-2">{item.title_apartemen}</h2>
                    <p className="text-gray-700 text-[14px]">Price: Rp {item.harga}</p>
                    <p className="text-gray-700 text-[14px]">Luas: {item.luas}</p>
                    <p className="text-gray-700 text-[14px]">Posisi: {item.posisi}</p>
                    <p className="text-gray-700 text-[14px]">Kelengkapan Unit: {item. kelengkapan_unit}</p>
                    <p className="text-gray-700 text-[14px]">Fasilitas: {item.fasilitas_apartemen}</p>
                    <p className="text-gray-700 text-[14px]">Kelengkapan Furnitur: {item.kelengkapan_furnitur}</p>
                    <p className="text-gray-700 text-[14px]">Kamar Tidur: {item.tempat_tidur}</p>
                    <p className="text-gray-700 text-[14px]">Kamar Mandi: {item.kamar_mandi}</p>
                    <p className="text-gray-700 text-[14px]">PSI Score: {item.psi}</p>
                    <button className="bg-blue-500 text-white rounded-[15px] p-3" onClick={() => window.open(`${item.link_apartemen}`, "_blank")}>
                      Lihat Apartemen
                    </button>
                </div>
            );
        })}

        <button className="bg-blue-500 text-white w-[100px] rounded-[15px] p-2" onClick={() => router.push('/HomeScreen')}>
          Kembali
        </button>
      </div>
    );
}

function MetodePsi(apartements) {
  const posisiMapping = {
    "Lantai Atas": 1,
    "Lantai Tengah": 2,
    "Lantai Rendah": 3
  };
  const furniturMapping = {
    "Non Furnished": 1,
    "Semi Furnished": 2,
    "Fully Furnished": 3
  }

  // penentuan kriteria
  const hargaApartement = apartements.map(apartment => apartment.harga || 0);
  const luasApartement = apartements.map(apartment => parseInt(apartment.luas) || 0);
  const posisiApartement = apartements.map(apartemen => posisiMapping[apartemen.posisi] || 0);
  const kelengkapanUnitApartement = apartements.map(apartemen => apartemen.kelengkapan_unit ? apartemen.kelengkapan_unit.split(', ').length : 0);
  const jumlahFasilitasApartement = apartements.map(apartemen => apartemen.fasilitas_apartemen ? apartemen.fasilitas_apartemen.split(', ').length : 0);
  const statusFurnitur = apartements.map(apartment => furniturMapping[apartment.kelengkapan_furnitur] || 0)
  const jumlahKamarTidur = apartements.map(apartment => {
    if (apartment.tempat_tidur === "Studio") {
        return 1;
    } else {
        // Menghapus "BR" dari string dan mengonversi sisa menjadi angka
        return parseInt(apartment.tempat_tidur.replace("BR", "")) || 0;
    }
  });
  const jumlahKamarMandi = apartements.map(apartment => parseInt(apartment.kamar_mandi) || 0);

  
  // penentuan nilai max
  const maxHarga = Math.max(...hargaApartement);
  const maxLuas = Math.max(...luasApartement);
  const maxPosisi = Math.max(...posisiApartement);
  const maxKelengkapanUnit = Math.max(...kelengkapanUnitApartement);
  const maxJumlahFasilitas = Math.max(...jumlahFasilitasApartement);
  const maxStatusFurnitur = Math.max(...statusFurnitur);
  const maxJumlahKamarTidur = Math.max(...jumlahKamarTidur);
  const maxJumlahKamarMandi = Math.max(...jumlahKamarMandi);

  // Penentuan nilai minimum
  const minHarga = Math.min(...hargaApartement);
  const minLuas = Math.min(...luasApartement);
  const minPosisi = Math.min(...posisiApartement);
  const minKelengkapanUnit = Math.min(...kelengkapanUnitApartement);
  const minJumlahFasilitas = Math.min(...jumlahFasilitasApartement);
  const minStatusFurnitur = Math.min(...statusFurnitur);
  const minJumlahKamarTidur = Math.min(...jumlahKamarTidur);
  const minJumlahKamarMandi = Math.min(...jumlahKamarMandi);

  
  // Melakukan Normalisasi Matriks
  const normalisasiHarga = hargaApartement.map(harga => minHarga / harga);
  const normalisasiLuas = luasApartement.map(luas => luas / maxLuas);
  const normalisasiPosisi = posisiApartement.map(posisi => minPosisi / posisi);
  const normalisasiKelengkapanUnit = kelengkapanUnitApartement.map(unit => unit / maxKelengkapanUnit);
  const normalisasiJumlahFasilitas = jumlahFasilitasApartement.map(fasilitas => fasilitas / maxJumlahFasilitas);
  const normalisasiStatusFurnitur = statusFurnitur.map(furnitur => furnitur / maxStatusFurnitur);
  const normalisasiJumlahKamarTidur = jumlahKamarTidur.map(kamarTidur => kamarTidur / maxJumlahKamarTidur);
  const normalisasiJumlahKamarMandi = jumlahKamarMandi.map(kamarMandi => kamarMandi / maxJumlahKamarMandi);

  // Menentukan jumlah hasil normalisasi masing-masing kriteria
  const jumlahNormalisasiHarga = normalisasiHarga.reduce((total, current) => total + current, 0);
  const jumlahNormalisasiLuas = normalisasiLuas.reduce((total, current) => total + current, 0);
  const jumlahNormalisasiPosisi = normalisasiPosisi.reduce((total, current) => total + current, 0);
  const jumlahNormalisasiKelengkapanUnit = normalisasiKelengkapanUnit.reduce((total, current) => total + current, 0);
  const jumlahNormalisasiJumlahFasilitas = normalisasiJumlahFasilitas.reduce((total, current) => total + current, 0);
  const jumlahNormalisasiStatusFurnitur = normalisasiStatusFurnitur.reduce((total, current) => total + current, 0);
  const jumlahNormalisasiJumlahKamarTidur = normalisasiJumlahKamarTidur.reduce((total, current) => total + current, 0);
  const jumlahNormalisasiJumlahKamarMandi = normalisasiJumlahKamarMandi.reduce((total, current) => total + current, 0);

  // Penentuan Nilai Rata-Rata Kinerja yang dinormalisasi
  const n1 = (1 / 8) * jumlahNormalisasiHarga;
  const n2 = (1 / 8) * jumlahNormalisasiLuas;
  const n3 = (1 / 8) * jumlahNormalisasiPosisi;
  const n4 = (1 / 8) * jumlahNormalisasiKelengkapanUnit;
  const n5 = (1 / 8) * jumlahNormalisasiJumlahFasilitas;
  const n6 = (1 / 8) * jumlahNormalisasiStatusFurnitur;
  const n7 = (1 / 8) * jumlahNormalisasiJumlahKamarTidur;
  const n8 = (1 / 8) * jumlahNormalisasiJumlahKamarMandi;

  // Penentuan nilai variasi preferensi
  const variasiPreferensiHarga = normalisasiHarga.map(normalisasi => Math.pow((normalisasi - n1), 2));
  const variasiPreferensiLuas = normalisasiLuas.map(normalisasi => Math.pow((normalisasi - n2), 2));
  const variasiPreferensiPosisi = normalisasiPosisi.map(normalisasi => Math.pow((normalisasi - n3), 2));
  const variasiPreferensiKelengkapanUnit = normalisasiKelengkapanUnit.map(normalisasi => Math.pow((normalisasi - n4), 2));
  const variasiPreferensiJumlahFasilitas = normalisasiJumlahFasilitas.map(normalisasi => Math.pow((normalisasi - n5), 2));
  const variasiPreferensiStatusFurnitur = normalisasiStatusFurnitur.map(normalisasi => Math.pow((normalisasi - n6), 2));
  const variasiPreferensiJumlahKamarTidur = normalisasiJumlahKamarTidur.map(normalisasi => Math.pow((normalisasi - n7), 2));
  const variasiPreferensiJumlahKamarMandi = normalisasiJumlahKamarMandi.map(normalisasi => Math.pow((normalisasi - n8), 2));

  // Menghitung jumlah dari masing-masing nilai variasi preferensi
  const jumlahVariasiPreferensiHarga = variasiPreferensiHarga.reduce((total, current) => total + current, 0);
  const jumlahVariasiPreferensiLuas = variasiPreferensiLuas.reduce((total, current) => total + current, 0);
  const jumlahVariasiPreferensiPosisi = variasiPreferensiPosisi.reduce((total, current) => total + current, 0);
  const jumlahVariasiPreferensiKelengkapanUnit = variasiPreferensiKelengkapanUnit.reduce((total, current) => total + current, 0);
  const jumlahVariasiPreferensiJumlahFasilitas = variasiPreferensiJumlahFasilitas.reduce((total, current) => total + current, 0);
  const jumlahVariasiPreferensiStatusFurnitur = variasiPreferensiStatusFurnitur.reduce((total, current) => total + current, 0);
  const jumlahVariasiPreferensiJumlahKamarTidur = variasiPreferensiJumlahKamarTidur.reduce((total, current) => total + current, 0);
  const jumlahVariasiPreferensiJumlahKamarMandi = variasiPreferensiJumlahKamarMandi.reduce((total, current) => total + current, 0);

  // Penentuan Deviasi Nilai Preferensi
  const omega1 = 1 - jumlahVariasiPreferensiHarga;
  const omega2 = 1 - jumlahVariasiPreferensiLuas;
  const omega3 = 1 - jumlahVariasiPreferensiPosisi;
  const omega4 = 1 - jumlahVariasiPreferensiKelengkapanUnit;
  const omega5 = 1 - jumlahVariasiPreferensiJumlahFasilitas;
  const omega6 = 1 - jumlahVariasiPreferensiStatusFurnitur;
  const omega7 = 1 - jumlahVariasiPreferensiJumlahKamarTidur;
  const omega8 = 1 - jumlahVariasiPreferensiJumlahKamarMandi;

  const totalSemuaDeviasiPreferensi = omega1 + omega2 + omega3 + omega4 + omega5 + omega6 + omega7 + omega8;

  // penentuan bobot kriteria
  const w1 = omega1 / totalSemuaDeviasiPreferensi;
  const w2 = omega2 / totalSemuaDeviasiPreferensi;
  const w3 = omega3 / totalSemuaDeviasiPreferensi;
  const w4 = omega4 / totalSemuaDeviasiPreferensi;
  const w5 = omega5 / totalSemuaDeviasiPreferensi;
  const w6 = omega6 / totalSemuaDeviasiPreferensi;
  const w7 = omega7 / totalSemuaDeviasiPreferensi;
  const w8 = omega8 / totalSemuaDeviasiPreferensi;

  // perhitungan nilai psi
  const kriteria1 = normalisasiHarga.map(harga => harga * w1);
  const kriteria2 = normalisasiLuas.map(luas => luas * w2);
  const kriteria3 = normalisasiPosisi.map(posisi => posisi * w3);
  const kriteria4 = normalisasiKelengkapanUnit.map(unit => unit * w4);
  const kriteria5 = normalisasiJumlahFasilitas.map(fasilitas => fasilitas * w5);
  const kriteria6 = normalisasiStatusFurnitur.map(furnitur => furnitur * w6);
  const kriteria7 = normalisasiJumlahKamarTidur.map(kamarTidur => kamarTidur * w7);
  const kriteria8 = normalisasiJumlahKamarMandi.map(kamarMandi => kamarMandi * w8);

  // hasil
  // Jumlahkan nilai kriteria untuk setiap baris apartemen
  const totalPerBaris = [];
  for (let i = 0; i < normalisasiHarga.length; i++) {
    const total = kriteria1[i] + kriteria2[i] + kriteria3[i] + kriteria4[i] + kriteria5[i] + kriteria6[i] + kriteria7[i] + kriteria8[i];
    totalPerBaris.push({ index: i, total: total });
  }

  // Tambahkan nilai PSI ke setiap objek apartemen
  const apartemenDenganPsi = totalPerBaris.map(item => {
    const apartment = apartements[item.index];
    return {
      ...apartment,
      psi: item.total
    };
  });

  // Urutkan array berdasarkan hasil penjumlahan
  apartemenDenganPsi.sort((a, b) => b.psi - a.psi);

  // Mengembalikan nilai dalam bentuk array data apartemen yang sudah diurutkan bersama dengan nilai PSI-nya
  return apartemenDenganPsi;
}
  
  
  
