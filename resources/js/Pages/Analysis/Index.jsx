import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DecisionCalculator from "./DecisionCalculator";
import DecisionTree from "./DecisionTree";
import TrainingData from "./TrainingData";
import GiniCalculation from "./GiniCalculation";
import MetricsPanel from "./GiniCalculation";

export default function Index({ auth, metrics }) {
    const [activeTab, setActiveTab] = useState("calculator");

    const tabs = [
        {
            id: "data",
            name: "Data Training",
            href: route("dataTraining"),
            current: route().current("dataTraining"),
        },
        {
            id: "calculator",
            name: "Kalkulator Keputusan",
            // href: route("analysis.calculator"),
            // current: route().current("analysis.calculator"),
        },
        {
            id: "visualization",
            name: "Visualisasi Pohon",
            // href: route("analysis.visualization"),
            // current: route().current("analysis.visualization"),
        },
        {
            id: "calculation",
            name: "Perhitungan Gini",
            // href: route("analysis.calculation"),
            // current: route().current("analysis.calculation"),
        },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Sistem Pohon Keputusan Penerimaan Karyawan
                </h2>
            }
        >
            <Head title="Sistem Pohon Keputusan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <header className="text-center mb-6 pb-4 border-b">
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Sistem Pohon Keputusan Recrutmen Karyawan
                                    Clinisindo
                                </h1>
                                <p className="text-gray-600">
                                    Model penerimaan karyawan berdasarkan
                                    algoritma Decision Tree dengan akurasi
                                    86.67%
                                </p>
                            </header>

                            <div className="border-b border-gray-200">
                                <nav className="flex -mb-px">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`py-4 px-6 font-medium text-sm ${
                                                activeTab === tab.id
                                                    ? "border-b-2 border-indigo-500 text-indigo-600"
                                                    : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                            }`}
                                        >
                                            {tab.name}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            <div className="mt-6">
                                {activeTab === "calculator" && (
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-700 mb-4">
                                            Kalkulator Keputusan
                                        </h2>
                                        <p className="mb-4">
                                            Masukkan data calon karyawan untuk
                                            melihat hasil keputusan berdasarkan
                                            model pohon keputusan.
                                        </p>

                                        <DecisionCalculator />

                                        <MetricsPanel metrics={metrics} />
                                    </div>
                                )}

                                {activeTab === "visualization" && (
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-700 mb-4">
                                            Visualisasi Pohon Keputusan
                                        </h2>
                                        <DecisionTree />
                                    </div>
                                )}

                                {activeTab === "data" && (
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-700 mb-4">
                                            Data Training
                                        </h2>
                                        <p className="mb-4">
                                            Berikut adalah data yang digunakan
                                            untuk membentuk pohon keputusan:
                                        </p>
                                        <TrainingData />
                                    </div>
                                )}

                                {activeTab === "calculation" && (
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-700 mb-4">
                                            Perhitungan Gini Impurity
                                        </h2>
                                        <GiniCalculation />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
