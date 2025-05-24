import React from "react";

export default function DecisionTree() {
    return (
        <div>
            <div className="tree-container flex justify-center my-8">
                <div className="tree w-full md:w-auto">
                    {/* Root Node */}
                    <div className="flex justify-center">
                        <div className="bg-blue-500 text-white px-4 py-2 rounded-md">
                            Psikotest &gt; 80?
                        </div>
                    </div>

                    <div className="h-8 relative">
                        <div className="absolute left-1/2 h-full border-l-2 border-gray-400"></div>
                    </div>

                    <div className="flex justify-between">
                        {/* Left Branch (Yes) */}
                        <div className="w-1/2 relative">
                            <div className="absolute top-0 right-1/2 text-gray-500 text-sm">
                                Ya
                            </div>
                            <div className="flex justify-center">
                                <div className="bg-green-500 text-white px-4 py-2 rounded-md">
                                    Pengalaman &gt; 4?
                                </div>
                            </div>

                            <div className="h-8 relative">
                                <div className="absolute left-1/2 h-full border-l-2 border-gray-400"></div>
                            </div>

                            <div className="flex justify-between">
                                <div className="w-1/2 relative">
                                    <div className="absolute top-0 right-1/2 text-gray-500 text-sm">
                                        Ya
                                    </div>
                                    <div className="flex justify-center">
                                        <div className="bg-green-600 text-white px-4 py-2 rounded-md">
                                            DITERIMA
                                        </div>
                                    </div>
                                </div>

                                <div className="w-1/2 relative">
                                    <div className="absolute top-0 left-1/2 text-gray-500 text-sm">
                                        Tidak
                                    </div>
                                    <div className="flex justify-center">
                                        <div className="bg-green-600 text-white px-4 py-2 rounded-md text-center">
                                            DITERIMA
                                            <br />
                                            (dengan catatan)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Branch (No) */}
                        <div className="w-1/2 relative">
                            <div className="absolute top-0 left-1/2 text-gray-500 text-sm">
                                Tidak
                            </div>
                            <div className="flex justify-center">
                                <div className="bg-green-500 text-white px-4 py-2 rounded-md">
                                    Pendidikan = S1?
                                </div>
                            </div>

                            <div className="h-8 relative">
                                <div className="absolute left-1/2 h-full border-l-2 border-gray-400"></div>
                            </div>

                            <div className="flex justify-between">
                                <div className="w-1/2 relative">
                                    <div className="absolute top-0 right-1/2 text-gray-500 text-sm">
                                        Ya
                                    </div>
                                    <div className="flex justify-center">
                                        <div className="bg-yellow-500 text-white px-4 py-2 rounded-md">
                                            DIPERTIMBANGKAN
                                        </div>
                                    </div>
                                </div>

                                <div className="w-1/2 relative">
                                    <div className="absolute top-0 left-1/2 text-gray-500 text-sm">
                                        Tidak
                                    </div>
                                    <div className="flex justify-center">
                                        <div className="bg-green-500 text-white px-4 py-2 rounded-md">
                                            Pengalaman &gt; 2?
                                        </div>
                                    </div>

                                    <div className="h-8 relative">
                                        <div className="absolute left-1/2 h-full border-l-2 border-gray-400"></div>
                                    </div>

                                    <div className="flex justify-between">
                                        <div className="w-1/2 relative">
                                            <div className="absolute top-0 right-1/2 text-gray-500 text-sm">
                                                Ya
                                            </div>
                                            <div className="flex justify-center">
                                                <div className="bg-yellow-500 text-white px-4 py-2 rounded-md">
                                                    DIPERTIMBANGKAN
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-1/2 relative">
                                            <div className="absolute top-0 left-1/2 text-gray-500 text-sm">
                                                Tidak
                                            </div>
                                            <div className="flex justify-center">
                                                <div className="bg-red-500 text-white px-4 py-2 rounded-md">
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
                <h3 className="text-lg font-bold text-gray-700 mb-2">
                    Aturan Keputusan:
                </h3>
                <ol className="list-decimal pl-6 space-y-2">
                    <li>
                        Jika Psikotest &gt; 80 dan pengalaman &gt; 4 →{" "}
                        <strong>Diterima</strong>
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
                        Jika Psikotest ≤ 80, bukan S1, tapi pengalaman &gt; 2 →{" "}
                        <strong>Dipertimbangkan</strong>
                    </li>
                    <li>
                        Jika Psikotest ≤ 80, bukan S1, dan pengalaman ≤ 2 →{" "}
                        <strong>Tidak Diterima</strong>
                    </li>
                </ol>
            </div>
        </div>
    );
}
