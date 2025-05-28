import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { Head, useForm } from "@inertiajs/react";
import { useEffect } from "react";

export default function DecisionCalculator({ dataTraining }) {
    const { data, setData, post, errors, processing } = useForm({
        nama: "",
        posisi: "",
        pendidikan: "",
        pengalaman: "",
        gaji: "",
        psikotest: "",
        status_id: "",
    });

    const handleSelectChange = (e) => {
        const selectedId = e.target.value;
        setData("nama", selectedId);
    };

    useEffect(() => {
        if (data.nama) {
            const selected = dataTraining.find((item) => item.id == data.nama);
            if (selected?.candidate) {
                const c = selected.candidate;
                setData((prev) => ({
                    ...prev,
                    posisi: c.posisi || "",
                    pendidikan: c.pendidikan || "",
                    pengalaman: c.pengalaman || "",
                    gaji: c.gaji || "",
                    psikotest: c.psikotest || "",
                    status_id: c.status_id || "",
                }));
            }
        } else {
            // reset semua jika nama dikosongkan
            setData((prev) => ({
                ...prev,
                posisi: "",
                pendidikan: "",
                pengalaman: "",
                gaji: "",
                psikotest: "",
                status_id: "",
            }));
        }
    }, [data.nama]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // ganti URL sesuai route yang kamu pakai
        post("/decision-calculate");
    };

    const renderReadOnlyField = (label, name, value) => (
        <div className="mb-4">
            <InputLabel htmlFor={name} value={label} />
            <input
                type="text"
                id={name}
                value={value}
                readOnly
                className="mt-1 block w-1/2 rounded-md border-gray-300 bg-gray-100 shadow-sm"
            />
        </div>
    );

    return (
        <div className="max-w-full mx-auto p-10">
            <Head title="Kalkulator Keputusan" />

            <form onSubmit={handleSubmit} className="mx-auto">
                {/* Select Nama Kandidat */}
                <div className="mb-4">
                    <InputLabel htmlFor="nama" value="Nama" />
                    <select
                        id="nama"
                        name="nama"
                        value={data.nama}
                        onChange={handleSelectChange}
                        className="mt-1 block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">Pilih Nama Kandidat</option>
                        {dataTraining.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.candidate?.nama ??
                                    `Kandidat ${item.candidate_id}`}
                            </option>
                        ))}
                    </select>
                    <InputError className="mt-2" message={errors.nama} />
                </div>

                {/* Field lain otomatis terisi */}
                {renderReadOnlyField("Posisi", "posisi", data.posisi)}
                {renderReadOnlyField(
                    "Pendidikan",
                    "pendidikan",
                    data.pendidikan
                )}
                {renderReadOnlyField(
                    "Pengalaman (Tahun)",
                    "pengalaman",
                    data.pengalaman
                )}
                {renderReadOnlyField("Gaji", "gaji", data.gaji)}
                {renderReadOnlyField(
                    "Nilai Psikotest",
                    "psikotest",
                    data.psikotest
                )}

                {/* Tombol Submit */}
                <button
                    type="submit"
                    className="w-1/2 mt-10 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
                    disabled={processing}
                >
                    {processing ? "Memproses..." : "Hitung Keputusan"}
                </button>
            </form>
        </div>
    );
}
