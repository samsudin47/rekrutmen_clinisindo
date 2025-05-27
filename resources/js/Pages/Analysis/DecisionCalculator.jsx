import { useState } from "react";
import axios from "axios";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import Pagination from "@/Components/Pagination";

export default function DecisionCalculator() {
    const [formData, setFormData] = useState({
        psikotest: "",
        experience: "",
        education: "",
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                route("employee-decision.calculate"),
                formData
            );
            setResult(response.data);
        } catch (err) {
            setError(
                err.response?.data?.errors || {
                    general: "Terjadi kesalahan. Silakan coba lagi.",
                }
            );
        } finally {
            setLoading(false);
        }
    };

    const getResultClassName = () => {
        if (!result) return "";

        switch (result.decision) {
            case "Diterima":
                return "bg-green-50 border border-green-500 text-green-700";
            case "Dipertimbangkan":
                return "bg-yellow-50 border border-yellow-500 text-yellow-700";
            case "Tidak Diterima":
                return "bg-red-50 border border-red-500 text-red-700";
            default:
                return "";
        }
    };

    return (
        <div className="max-w-full mx-auto">
            <form onSubmit={handleSubmit} className="mx-auto">
                <div className="mb-4">
                    <InputLabel htmlFor="nama" value="Nama" />

                    <TextInput
                        id="nama"
                        className="mt-1 block w-1/2"
                        required
                        isFocused
                        autoComplete="nama"
                    />

                    <InputError className="mt-2" message="" />
                </div>

                <div className="mb-4">
                    <InputLabel htmlFor="posisi" value="Posisi" />

                    <TextInput
                        id="posisi"
                        className="mt-1 block w-1/2"
                        required
                        isFocused
                        autoComplete="posisi"
                    />

                    <InputError className="mt-2" message="" />
                </div>

                <div className="mb-4">
                    <InputLabel htmlFor="gaji" value="Gaji" />

                    <TextInput
                        id="gaji"
                        className="mt-1 block w-1/2"
                        required
                        isFocused
                        autoComplete="gaji"
                    />

                    <InputError className="mt-2" message="" />
                </div>

                <div className="mb-4">
                    <InputLabel htmlFor="psikotest" value="Nilai Psikotest" />

                    <TextInput
                        id="psikotest"
                        className="mt-1 block w-1/2"
                        required
                        isFocused
                        autoComplete="psikotest"
                    />

                    <InputError className="mt-2" message="" />
                </div>

                <div className="mb-4">
                    <InputLabel
                        htmlFor="pengalaman"
                        value="Pengalaman (Tahun)"
                    />

                    <TextInput
                        id="pengalaman"
                        className="mt-1 block w-1/2"
                        required
                        isFocused
                        autoComplete="pengalaman"
                    />

                    <InputError className="mt-2" message="" />
                </div>

                <div className="mb-4">
                    <InputLabel
                        htmlFor="pendidikan"
                        value="Pendidikan Terakhir"
                    />

                    <select
                        id="pendidikan"
                        name="pendidikan"
                        className="w-1/2 rounded-md"
                    >
                        <option value="">Pilih Pendidikan</option>
                        <option value="S1">S1</option>
                        <option value="D3">D3</option>
                        <option value="SMA">SMA</option>
                        <option value="Lainnya">Lainnya</option>
                    </select>

                    <InputError className="mt-2" message="" />
                </div>

                <button
                    type="submit"
                    className="w-1/2 mt-10 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
                    disabled={loading}
                >
                    {loading ? "Memproses..." : "Hitung Keputusan"}
                </button>
            </form>

            {result && (
                <div className={`mt-6 p-4 rounded-md ${getResultClassName()}`}>
                    <h3 className="text-lg font-bold">
                        Hasil: {result.decision} {result.note}
                    </h3>
                    <p className="mt-2">
                        {result.decision === "Diterima" &&
                            "Calon karyawan memenuhi kriteria untuk diterima berdasarkan model pohon keputusan."}
                        {result.decision === "Dipertimbangkan" &&
                            "Calon karyawan masuk dalam kategori yang perlu dipertimbangkan lebih lanjut."}
                        {result.decision === "Tidak Diterima" &&
                            "Calon karyawan tidak memenuhi kriteria minimum berdasarkan model pohon keputusan."}
                    </p>
                </div>
            )}

            {error?.general && (
                <div className="mt-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded">
                    {error.general}
                </div>
            )}
        </div>
    );
}
