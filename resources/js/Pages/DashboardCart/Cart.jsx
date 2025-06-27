import { useState, useEffect } from "react";

export default function DecisionTreeCartDashboard({ initialTree }) {
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (initialTree) {
            calculateStatistics(initialTree);
            setLoading(false);
        } else {
            setStatistics(null);
            setLoading(false);
        }
    }, [initialTree]);

    // Statistik sama persis dengan DecisionTree.jsx
    const calculateStatistics = (node) => {
        const stats = {
            totalData: 0,
            totalNodes: 0,
            terminalNodes: 0,
            predictions: {
                Diterima: 0,
                "Tidak Diterima": 0,
                Dipertimbangkan: 0,
            },
            correctPredictions: 0,
            totalPredicted: 0,
            accuracy: 0,
            accuracyRate: 0,
            predictionCounts: {
                Diterima: 0,
                "Tidak Diterima": 0,
                Dipertimbangkan: 0,
            },
        };

        const traverse = (n) => {
            if (!n) return;
            stats.totalNodes++;
            if (n.isTerminal && n.result) {
                stats.terminalNodes++;
                const count = n.count || 0;
                stats.totalData += count;
                stats.totalPredicted += count;
                if (n.details) {
                    Object.entries(n.details).forEach(([key, value]) => {
                        let label = key;
                        if (
                            label === "Diterima" ||
                            label === "Tidak Diterima" ||
                            label === "Dipertimbangkan"
                        ) {
                            stats.predictions[label] += value;
                            stats.predictionCounts[label] += value;
                        } else {
                            stats.predictions["Tidak Diterima"] += value;
                            stats.predictionCounts["Tidak Diterima"] += value;
                        }
                    });
                } else {
                    stats.predictions[n.result] += count;
                    stats.predictionCounts[n.result] += count;
                }
                let correctCount = count;
                if (n.accuracy !== undefined) {
                    correctCount = Math.round(count * n.accuracy);
                }
                stats.correctPredictions += correctCount;
            }
            if (n.children && n.children.length > 0) {
                n.children.forEach(traverse);
            }
        };
        traverse(node);
        if (stats.totalPredicted > 0) {
            stats.accuracy =
                (stats.correctPredictions / stats.totalPredicted) * 100;
            stats.accuracyRate = stats.accuracy.toFixed(1);
        }
        setStatistics(stats);
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">
                            Memuat data dashboard...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!initialTree) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 bg-white rounded-xl shadow">
                <h1 className="text-2xl md:text-3xl font-bold text-blue-700 mb-4 text-center">
                    PENERAPAN METODE CLASSIFICATION AND REGRESSION TREE (CART){" "}
                    <br className="hidden md:block" />
                    PADA SISTEM PENDUKUNG KEPUTUSAN REKRUTMEN KARYAWAN{" "}
                    <br className="hidden md:block" />
                    PT CLINISINDO LABORATORIES
                </h1>
                <div className="max-w-7xl w-full mt-6">
                    <div className="mb-6 p-6 bg-blue-50 rounded-lg shadow-sm border-l-4 border-blue-400">
                        <h2 className="text-xl font-semibold text-blue-700 mb-2">
                            Sistem Pendukung Keputusan Rekrutmen CART
                        </h2>
                        <p className="text-gray-700 mb-2">
                            <span className="font-semibold">
                                Deskripsi Sistem:
                            </span>
                            <br />
                            Sistem ini merupakan aplikasi web-based yang
                            mengimplementasikan algoritma{" "}
                            <span className="font-semibold">
                                Classification and Regression Tree (CART)
                            </span>{" "}
                            untuk membantu proses seleksi karyawan di PT
                            Clinisindo Laboratories. Sistem dapat menganalisis
                            profil pelamar berdasarkan berbagai kriteria dan
                            memberikan rekomendasi keputusan rekrutmen secara
                            otomatis.
                        </p>
                        <div className="mb-2">
                            <span className="font-semibold">Fitur Utama:</span>
                            <ul className="list-disc list-inside text-gray-700 mt-1 space-y-1">
                                <li>
                                    <span className="font-bold text-blue-600">
                                        Dashboard
                                    </span>
                                    : Halaman utama yang menampilkan overview
                                    sistem dan panduan penggunaan
                                </li>
                                <li>
                                    <span className="font-bold text-blue-600">
                                        Data Pelamar
                                    </span>
                                    : Modul untuk mengelola data kandidat yang
                                    melamar pekerjaan
                                </li>
                                <li>
                                    <span className="font-bold text-blue-600">
                                        Data Kriteria
                                    </span>
                                    : Pengaturan parameter dan bobot penilaian
                                    untuk proses seleksi
                                </li>
                                <li>
                                    <span className="font-bold text-blue-600">
                                        Analysis CART
                                    </span>
                                    : Fitur analisis menggunakan algoritma CART
                                    yang menghasilkan pohon keputusan dan
                                    prediksi kelayakan pelamar
                                </li>
                                <li>
                                    <span className="font-bold text-blue-600">
                                        Manage Users
                                    </span>
                                    : Pengelolaan hak akses pengguna sistem
                                </li>
                            </ul>
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">
                                Output Sistem:
                            </span>
                            <br />
                            Sistem mengklasifikasikan pelamar ke dalam tiga
                            kategori:{" "}
                            <span className="font-bold text-green-600">
                                Diterima
                            </span>
                            ,{" "}
                            <span className="font-bold text-yellow-600">
                                Dipertimbangkan
                            </span>
                            , dan{" "}
                            <span className="font-bold text-red-600">
                                Tidak Diterima
                            </span>{" "}
                            berdasarkan analisis data historis dan kriteria yang
                            telah ditetapkan.
                        </div>
                        <div>
                            <span className="font-semibold">Keunggulan:</span>
                            <br />
                            Memberikan keputusan rekrutmen yang{" "}
                            <span className="font-bold">objektif</span>,{" "}
                            <span className="font-bold">transparan</span>, dan{" "}
                            <span className="font-bold">berbasis data</span>{" "}
                            dengan visualisasi pohon keputusan yang mudah
                            dipahami oleh tim HRD.
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!statistics) {
        return null;
    }

    return (
        <div className="p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border-b-4 border-blue-400">
                    <div className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                        Total Data
                    </div>
                    <div className="text-3xl font-bold text-blue-600">
                        {statistics.totalData}
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border-b-4 border-green-400">
                    <div className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                        Akurasi
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                        {statistics.accuracyRate}%
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border-b-4 border-purple-400">
                    <div className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                        Jumlah Node
                    </div>
                    <div className="text-3xl font-bold text-purple-600">
                        {statistics.totalNodes}
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border-b-4 border-yellow-400">
                    <div className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                        Terminal Nodes
                    </div>
                    <div className="text-3xl font-bold text-yellow-600">
                        {statistics.terminalNodes}
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="text-lg font-semibold text-gray-700 mb-4">
                    Distribusi Prediksi
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                        className="rounded-lg p-6 text-center"
                        style={{ background: "#ECFDF5" }}
                    >
                        <div className="text-3xl font-bold text-green-600 mb-1">
                            {statistics.predictions["Diterima"]}
                        </div>
                        <div className="text-base font-medium text-green-700">
                            Diterima
                        </div>
                    </div>
                    <div
                        className="rounded-lg p-6 text-center"
                        style={{ background: "#FFFBEB" }}
                    >
                        <div className="text-3xl font-bold text-yellow-600 mb-1">
                            {statistics.predictions["Dipertimbangkan"] ?? 0}
                        </div>
                        <div className="text-base font-medium text-yellow-700">
                            Dipertimbangkan
                        </div>
                    </div>
                    <div
                        className="rounded-lg p-6 text-center"
                        style={{ background: "#FEF2F2" }}
                    >
                        <div className="text-3xl font-bold text-red-600 mb-1">
                            {statistics.predictions["Tidak Diterima"]}
                        </div>
                        <div className="text-base font-medium text-red-700">
                            Tidak Diterima
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
