import React from "react";
import { Head } from "@inertiajs/react";

const TreeVisualization = () => {
    return (
        <div className="py-4">
            <Head title="Visualisasi Pohon" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-blue-600 mb-4">
                            Visualisasi Pohon Keputusan
                        </h2>

                        <div className="flex justify-center my-8">
                            <div className="tree-container">
                                {/* Root Node */}
                                <div className="flex flex-col items-center">
                                    <div className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md">
                                        Psikotest &gt; 80?
                                    </div>

                                    <div className="h-8 w-px bg-gray-400"></div>

                                    <div className="flex justify-center w-full">
                                        {/* Left Branch */}
                                        <div className="flex flex-col items-center w-1/2 px-4 relative">
                                            <div className="absolute top-0 -mt-6 text-xs text-gray-500">
                                                Ya
                                            </div>
                                            <div className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md">
                                                Pengalaman &gt; 4?
                                            </div>

                                            <div className="h-8 w-px bg-gray-400"></div>

                                            <div className="flex justify-center w-full">
                                                <div className="flex flex-col items-center w-1/2 px-2 relative">
                                                    <div className="absolute top-0 -mt-6 text-xs text-gray-500">
                                                        Ya
                                                    </div>
                                                    <div className="bg-green-600 text-white px-4 py-2 rounded-md shadow-md">
                                                        DITERIMA
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-center w-1/2 px-2 relative">
                                                    <div className="absolute top-0 -mt-6 text-xs text-gray-500">
                                                        Tidak
                                                    </div>
                                                    <div className="bg-green-600 text-white px-4 py-2 rounded-md shadow-md whitespace-nowrap">
                                                        DITERIMA
                                                        <br />
                                                        (dengan catatan)
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Branch */}
                                        <div className="flex flex-col items-center w-1/2 px-4 relative">
                                            <div className="absolute top-0 -mt-6 text-xs text-gray-500">
                                                Tidak
                                            </div>
                                            <div className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md">
                                                Pendidikan = S1?
                                            </div>

                                            <div className="h-8 w-px bg-gray-400"></div>

                                            <div className="flex justify-center w-full">
                                                <div className="flex flex-col items-center w-1/2 px-2 relative">
                                                    <div className="absolute top-0 -mt-6 text-xs text-gray-500">
                                                        Ya
                                                    </div>
                                                    <div className="bg-yellow-500 text-white px-4 py-2 rounded-md shadow-md">
                                                        DIPERTIMBANGKAN
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-center w-1/2 px-2 relative">
                                                    <div className="absolute top-0 -mt-6 text-xs text-gray-500">
                                                        Tidak
                                                    </div>
                                                    <div className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md">
                                                        Pengalaman &gt; 2?
                                                    </div>

                                                    <div className="h-8 w-px bg-gray-400"></div>

                                                    <div className="flex justify-center w-full">
                                                        <div className="flex flex-col items-center w-1/2 px-1 relative">
                                                            <div className="absolute top-0 -mt-6 text-xs text-gray-500">
                                                                Ya
                                                            </div>
                                                            <div className="bg-yellow-500 text-white px-4 py-2 rounded-md shadow-md text-xs md:text-sm">
                                                                DIPERTIMBANGKAN
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col items-center w-1/2 px-1 relative">
                                                            <div className="absolute top-0 -mt-6 text-xs text-gray-500">
                                                                Tidak
                                                            </div>
                                                            <div className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md text-xs md:text-sm">
                                                                TIDAK DITERIMA
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-xl font-bold text-gray-700 mb-4">
                                Aturan Keputusan:
                            </h3>
                            <ol className="list-decimal pl-5 space-y-2">
                                <li>
                                    Jika Psikotest &gt; 80 dan pengalaman &gt; 4
                                    → <strong>Diterima</strong>
                                </li>
                                <li>
                                    Jika Psikotest &gt; 80 dan pengalaman ≤ 4 →{" "}
                                    <strong>Diterima</strong> (dengan catatan)
                                </li>
                                <li>
                                    Jika Psikotest ≤ 80 dan pendidikan S1 →{" "}
                                    <strong>Dipertimbangkan</strong>
                                </li>
                                <li>
                                    Jika Psikotest ≤ 80, bukan S1, tapi
                                    pengalaman &gt; 2 →{" "}
                                    <strong>Dipertimbangkan</strong>
                                </li>
                                <li>
                                    Jika Psikotest ≤ 80, bukan S1, dan
                                    pengalaman ≤ 2 →{" "}
                                    <strong>Tidak Diterima</strong>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TreeVisualization;
