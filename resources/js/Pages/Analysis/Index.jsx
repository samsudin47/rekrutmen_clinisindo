import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DecisionCalculator from "./DecisionCalculator";
import DecisionTree from "./DecisionTree";
import Data from "./Data";

export default function Index({
    auth,
    dataTraining,
    totalData,
    initialTree,
    activeTab: initialTab = "calculator",
}) {
    const [activeTab, setActiveTab] = useState(initialTab);

    const tabs = [
        {
            id: "decisionCalculator",
            name: "Kalkulator Keputusan",
            href: route("decisionCalculator.calculateDecision"),
            current: activeTab === "decisionCalculator",
        },
        {
            id: "dataTraining",
            name: "Data Training",
            href: route("dataTraining.data"),
            current: activeTab === "dataTraining",
        },
        {
            id: "visualization",
            name: "Visualisasi Pohon",
            href: route("decision-tree.index"),
            current: activeTab === "decision-tree",
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
                <div className="mx-auto max-w-[1600px] sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <header className="text-center mb-6 pb-4 border-b">
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Sistem Pohon Keputusan Recrutmen Karyawan
                                    Clinisindo
                                </h1>
                                <p className="text-gray-600">
                                    Model penerimaan karyawan berdasarkan
                                    algoritma Decision Tree
                                </p>
                            </header>

                            <nav className="flex mb-px border-b border-gray-200">
                                {tabs.map((tab) =>
                                    tab.href !== "#" ? (
                                        <Link
                                            key={tab.id}
                                            href={tab.href}
                                            className={`py-4 px-6 font-medium text-sm border-b-2 ${
                                                tab.current
                                                    ? "text-indigo-600 border-indigo-500"
                                                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-transparent"
                                            }`}
                                        >
                                            {tab.name}
                                        </Link>
                                    ) : (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`py-4 px-6 font-medium text-sm border-b-2 ${
                                                tab.current
                                                    ? "text-indigo-600 border-indigo-500"
                                                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-transparent"
                                            }`}
                                        >
                                            {tab.name}
                                        </button>
                                    )
                                )}
                            </nav>

                            <div className="mt-6">
                                {activeTab === "decisionCalculator" && (
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-700 mb-4">
                                            Kalkulator Keputusan
                                        </h2>
                                        <DecisionCalculator
                                            dataTraining={dataTraining}
                                        />
                                    </div>
                                )}

                                {activeTab === "dataTraining" && (
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-700 mb-4">
                                            Kumpulan Data Training
                                        </h2>
                                        <p className="mb-4">
                                            Berikut adalah data training yang
                                            digunakan untuk melatih model pohon
                                            keputusan.
                                        </p>
                                        <Data dataTraining={dataTraining} />
                                    </div>
                                )}

                                {activeTab === "decision-tree" && (
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-700 mb-4">
                                            Visualisasi Pohon Keputusan
                                        </h2>
                                        <DecisionTree
                                            totalData={totalData}
                                            initialTree={initialTree}
                                        />
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
