import React, { useState } from "react";
import axios from "axios";

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
        <div className="bg-gray-100 p-6 rounded-lg mb-6">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="nama" className="block font-semibold mb-1">
                        Nama :
                    </label>
                    <input
                        type="number"
                        id="nama"
                        name="nama"
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder=""
                        value={formData.nama}
                        onChange={handleChange}
                    />
                    {error?.nama && (
                        <p className="text-red-500 text-sm mt-1">
                            {error.nama}
                        </p>
                    )}
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="posisi"
                        className="block font-semibold mb-1"
                    >
                        Posisi :
                    </label>
                    <input
                        type="text"
                        id="posisi"
                        name="posisi"
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder=""
                        value={formData.posisi}
                        onChange={handleChange}
                    />
                    {error?.posisi && (
                        <p className="text-red-500 text-sm mt-1">
                            {error.posisi}
                        </p>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="gaji" className="block font-semibold mb-1">
                        Gaji :
                    </label>
                    <input
                        type="number"
                        id="gaji"
                        name="gaji"
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder=""
                        value={formData.gaji}
                        onChange={handleChange}
                    />
                    {error?.gaji && (
                        <p className="text-red-500 text-sm mt-1">
                            {error.gaji}
                        </p>
                    )}
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="psikotest"
                        className="block font-semibold mb-1"
                    >
                        Nilai Psikotest:
                    </label>
                    <input
                        type="number"
                        id="psikotest"
                        name="psikotest"
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder=""
                        value={formData.psikotest}
                        onChange={handleChange}
                    />
                    {error?.psikotest && (
                        <p className="text-red-500 text-sm mt-1">
                            {error.psikotest}
                        </p>
                    )}
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="experience"
                        className="block font-semibold mb-1"
                    >
                        Pengalaman (tahun):
                    </label>
                    <input
                        type="number"
                        id="experience"
                        name="experience"
                        min="0"
                        step="1"
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder=""
                        value={formData.experience}
                        onChange={handleChange}
                    />
                    {error?.experience && (
                        <p className="text-red-500 text-sm mt-1">
                            {error.experience}
                        </p>
                    )}
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="education"
                        className="block font-semibold mb-1"
                    >
                        Pendidikan Terakhir:
                    </label>
                    <select
                        id="education"
                        name="education"
                        className="w-full px-3 py-2 border rounded-md"
                        value={formData.education}
                        onChange={handleChange}
                    >
                        <option value="">Pilih Pendidikan</option>
                        <option value="S1">S1</option>
                        <option value="D3">D3</option>
                        <option value="SMA">SMA</option>
                        <option value="Lainnya">Lainnya</option>
                    </select>
                    {error?.education && (
                        <p className="text-red-500 text-sm mt-1">
                            {error.education}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
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
