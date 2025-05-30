import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { Head, useForm, router } from "@inertiajs/react";
import { useEffect, useState } from "react";

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

    const [result, setResult] = useState(null);

    const handleSelectChange = (e) => {
        const selectedId = e.target.value;
        setData("nama", selectedId);
        setResult(null); // Reset hasil ketika ganti kandidat
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

        if (!data.nama) {
            alert("Silakan pilih kandidat terlebih dahulu");
            return;
        }

        post(
            route("run-decision-tree.runDecisionTree"),
            {
                nama: data.nama,
            },
            {
                onSuccess: (page) => {
                    // Ambil hasil dari response dan simpan ke state
                    setResult(page.props.result || page.props); // Sesuaikan dengan struktur response dari backend
                    console.log("Prediksi berhasil dijalankan");
                },
                onError: (errors) => {
                    console.error("Error:", errors);
                },
            }
        );
    };

    const renderReadOnlyField = (label, name, value) => (
        <div className="mb-4">
            <InputLabel htmlFor={name} value={label} />
            <input
                type="text"
                id={name}
                value={value}
                readOnly
                className="mt-1 block w-1/2 rounded-md border-gray-300 bg-gray-100 shadow-sm focus:ring-0"
            />
        </div>
    );

    const renderCARTInfo = () => (
        <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
                Tentang CART (Classification and Regression Trees)
            </h3>
            <div className="text-blue-700 space-y-2">
                <p>
                    <strong>Algoritma Decision Tree</strong> yang digunakan
                    untuk klasifikasi kandidat:
                </p>
                <ul className="list-disc ml-6 space-y-1">
                    <li>
                        <strong>Root Node:</strong> Psikotest (threshold: Diatas
                        70)
                    </li>
                    <li>
                        <strong>Split 1:</strong> Pengalaman kerja (threshold:
                        Diatas 1 tahun)
                    </li>
                    <li>
                        <strong>Split 2:</strong> Tingkat pendidikan (S1-S3)
                    </li>
                    <li>
                        <strong>Terminal Nodes:</strong> Diterima,
                        Dipertimbangkan, Tidak Diterima
                    </li>
                </ul>
            </div>
        </div>
    );

    const renderResult = () => {
        if (!result) return null;

        return (
            <div className="mt-8 bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Hasil Prediksi CART
                </h2>

                {/* Tampilkan hasil sesuai dengan struktur data dari backend */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-700 text-sm">
                        <strong>Catatan:</strong> Hasil prediksi dari server
                        menggunakan algoritma CART.
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-full mx-auto p-6">
            <Head title="Kalkulator Keputusan CART" />

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Kalkulator Keputusan CART
                </h1>
                <p className="text-gray-600">
                    Sistem prediksi penerimaan kandidat menggunakan algoritma
                    Classification and Regression Trees (CART)
                </p>
            </div>

            {renderCARTInfo()}

            <div className="bg-white shadow-sm rounded-lg p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
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
                    <div className="pt-6">
                        <button
                            type="submit"
                            className="w-full md:w-1/2 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={processing || !data.nama}
                        >
                            {processing ? (
                                <span className="flex items-center justify-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Memproses...
                                </span>
                            ) : (
                                "Hitung Keputusan dengan CART"
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Hasil Prediksi */}
            {renderResult()}
        </div>
    );
}
