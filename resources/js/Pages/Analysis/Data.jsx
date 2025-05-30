import { Head, Link } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";

export default function Data({
    dataTraining,
    message,
    prediction,
    accuracy,
    calculationDetails,
}) {
    // Hitung statistik dari data
    const calculateStats = () => {
        if (!dataTraining?.data) return null;

        const data = dataTraining.data;
        const total = data.length;
        const statusCounts = data.reduce((acc, item) => {
            const status = item.candidate?.status?.description || "Unknown";
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        const predictionCounts = data.reduce((acc, item) => {
            const pred = item.prediction_model || "Belum Dihitung";
            acc[pred] = (acc[pred] || 0) + 1;
            return acc;
        }, {});

        // PERBAIKAN: Filter data yang memiliki prediction_model (bukan null/undefined)
        const dataWithPredictions = data.filter(
            (item) =>
                item.prediction_model &&
                item.prediction_model !== "Belum Dihitung"
        );

        // Hitung prediksi yang benar dari data yang sudah memiliki prediksi
        const correctPredictions = dataWithPredictions.filter((item) => {
            // Pastikan accuracy ada dan bernilai 1, "1", true, atau "true"
            const acc = item.accuracy;
            return acc === 1 || acc === "1" || acc === true || acc === "true";
        }).length;

        const totalPredicted = dataWithPredictions.length;

        // Hitung akurasi: jika tidak ada prediksi, akurasi = 0
        const accuracyRate =
            totalPredicted > 0
                ? ((correctPredictions / totalPredicted) * 100).toFixed(1)
                : "0.0";

        return {
            total,
            statusCounts,
            predictionCounts,
            correctPredictions,
            totalPredicted,
            accuracyRate,
        };
    };

    const stats = calculateStats();

    const renderResultAlert = () => {
        if (!message || !prediction) return null;

        const alertColor =
            prediction === "Diterima"
                ? "green"
                : prediction === "Tidak Diterima"
                ? "red"
                : "yellow";

        return (
            <div
                className={`mb-6 p-4 rounded-lg border ${
                    alertColor === "green"
                        ? "bg-green-50 border-green-200"
                        : alertColor === "red"
                        ? "bg-red-50 border-red-200"
                        : "bg-yellow-50 border-yellow-200"
                }`}
            >
                <div className="flex items-center">
                    <div
                        className={`flex-shrink-0 w-5 h-5 ${
                            alertColor === "green"
                                ? "text-green-400"
                                : alertColor === "red"
                                ? "text-red-400"
                                : "text-yellow-400"
                        }`}
                    >
                        {alertColor === "green"
                            ? "✓"
                            : alertColor === "red"
                            ? "✗"
                            : "⚠"}
                    </div>
                    <div className="ml-3">
                        <h3
                            className={`text-sm font-medium ${
                                alertColor === "green"
                                    ? "text-green-800"
                                    : alertColor === "red"
                                    ? "text-red-800"
                                    : "text-yellow-800"
                            }`}
                        >
                            {message}
                        </h3>
                        <div
                            className={`mt-2 text-sm ${
                                alertColor === "green"
                                    ? "text-green-700"
                                    : alertColor === "red"
                                    ? "text-red-700"
                                    : "text-yellow-700"
                            }`}
                        >
                            <p>
                                <strong>Prediksi:</strong> {prediction}
                            </p>
                            <p>
                                <strong>Akurasi:</strong>
                                {accuracy === 1 ? "Benar" : "Salah"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderCalculationDetails = () => {
        if (!calculationDetails) return null;

        return (
            <div className="mb-6 p-4  bg-blue-50 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-blue-800">
                    Detail Perhitungan CART:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white p-3 rounded border">
                        <p className="text-sm font-medium text-gray-600">
                            Psikotest
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                            {calculationDetails.psikotest}
                        </p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                        <p className="text-sm font-medium text-gray-600">
                            Pengalaman
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                            {calculationDetails.pengalaman} tahun
                        </p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                        <p className="text-sm font-medium text-gray-600">
                            Pendidikan
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                            {calculationDetails.pendidikan}
                        </p>
                    </div>
                </div>
                <div className="bg-white p-3 rounded border">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                        Langkah Perhitungan:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                        {calculationDetails.steps?.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
            </div>
        );
    };

    return (
        <div className="py-4">
            <Head title="Data Training - Hasil Analisis CART" />

            <div className="max-w-full mx-2">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-blue-200 border-b border-gray-200">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Data Training - Hasil Analisis CART
                            </h1>
                            <p className="text-gray-900">
                                Hasil prediksi menggunakan algoritma
                                Classification and Regression Trees
                            </p>
                        </div>

                        {renderResultAlert()}
                        {renderCalculationDetails()}

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Nama
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Posisi
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Pendidikan
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Pengalaman
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Gaji
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Psikotest
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Status Aktual
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Prediksi CART
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Akurasi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {dataTraining?.data?.map((item) => (
                                        <tr
                                            key={item.id}
                                            className={
                                                item.accuracy === 1
                                                    ? "bg-green-50"
                                                    : item.accuracy === 0
                                                    ? "bg-red-50"
                                                    : ""
                                            }
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {item.candidate?.nama || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.candidate?.posisi || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.candidate?.pendidikan ||
                                                    "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.candidate?.pengalaman ||
                                                    "-"}{" "}
                                                tahun
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.candidate?.gaji || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        item.candidate
                                                            ?.psikotest >= 80
                                                            ? "bg-green-100 text-green-800"
                                                            : item.candidate
                                                                  ?.psikotest >=
                                                              70
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {item.candidate
                                                        ?.psikotest || "-"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.candidate?.status
                                                    ?.description || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        item.prediction_model ===
                                                        "Diterima"
                                                            ? "bg-green-100 text-green-800"
                                                            : item.prediction_model ===
                                                              "Tidak Diterima"
                                                            ? "bg-red-100 text-red-800"
                                                            : item.prediction_model ===
                                                              "Dipertimbangkan"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                                >
                                                    {item.prediction_model ||
                                                        "Belum Dihitung"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {(() => {
                                                    const acc = item.accuracy;
                                                    // Handle berbagai kemungkinan nilai accuracy
                                                    if (
                                                        acc === 1 ||
                                                        acc === "1" ||
                                                        acc === true ||
                                                        acc === "true"
                                                    ) {
                                                        return (
                                                            <span className="text-green-600 font-medium">
                                                                ✓ Benar
                                                            </span>
                                                        );
                                                    } else if (
                                                        acc === 0 ||
                                                        acc === "0" ||
                                                        acc === false ||
                                                        acc === "false"
                                                    ) {
                                                        return (
                                                            <span className="text-red-600 font-medium">
                                                                ✗ Salah
                                                            </span>
                                                        );
                                                    } else {
                                                        return (
                                                            <span className="text-gray-500">
                                                                -
                                                            </span>
                                                        );
                                                    }
                                                })()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="my-10">
                                {dataTraining?.links && (
                                    <Pagination links={dataTraining.links} />
                                )}
                            </div>
                        </div>

                        {/* Statistik */}
                        {stats && (
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-bold text-lg mb-3">
                                        Ringkasan Data:
                                    </h3>
                                    <div className="space-y-2">
                                        <p>
                                            <strong>Total Data:</strong>{" "}
                                            {stats.total}
                                        </p>
                                        <div>
                                            <p className="font-medium mb-1">
                                                Status Aktual:
                                            </p>
                                            <ul className="list-disc ml-6 space-y-1">
                                                {Object.entries(
                                                    stats.statusCounts
                                                ).map(([status, count]) => (
                                                    <li key={status}>
                                                        {status}: {count}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-bold text-lg mb-3">
                                        Hasil Prediksi CART:
                                    </h3>
                                    <div className="space-y-2">
                                        <p>
                                            <strong>Akurasi:</strong>
                                            <span className="text-blue-600 font-bold text-lg">
                                                {stats.accuracyRate}%
                                            </span>
                                        </p>
                                        <p>
                                            <strong>Prediksi Benar:</strong>{" "}
                                            {stats.correctPredictions}/
                                            {stats.totalPredicted}
                                        </p>
                                        <div>
                                            <p className="font-medium mb-1">
                                                Distribusi Prediksi:
                                            </p>
                                            <ul className="list-disc ml-6 space-y-1">
                                                {Object.entries(
                                                    stats.predictionCounts
                                                ).map(([pred, count]) => (
                                                    <li key={pred}>
                                                        {pred}: {count}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
