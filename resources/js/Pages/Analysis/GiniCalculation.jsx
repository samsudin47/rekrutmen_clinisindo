import React from "react";
import { Head } from "@inertiajs/react";

const GiniCalculation = () => {
    return (
        <div className="py-4">
            <Head title="Perhitungan Gini" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-blue-600 mb-4">
                            Perhitungan Gini Impurity
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-700 mb-2">
                                    Langkah 1: Hitung Gini Impurity Awal
                                </h3>
                                <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto font-mono whitespace-pre-wrap">
                                    {`Total Data     : 15
Diterima (D)   : 7
Dipertimbangkan (P) : 5
Tidak Diterima (T)  : 3

Gini Awal = 1 - (7/15)² - (5/15)² - (3/15)² = 0,613`}
                                </pre>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-700 mb-2">
                                    Langkah 2: Evaluasi Semua Kemungkinan Split
                                </h3>
                                <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto font-mono whitespace-pre-wrap">
                                    {`Split C5 (Psikotest) > 80:
    Left (> 80)   : 7D, 1P
    Right (≤ 80)  : 0D, 4P, 3T

    Gini Left     : 1 - (7/8)² - (1/8)² = 0,219
    Gini Right    : 1 - (0/7)² - (4/7)² - (3/7)² = 0,490
    Weighted Gini : (8/15)*0,219 + (7/15)*0,490 = 0,341

Split C3 (Pengalaman) > 4:
    Left (> 4)    : 5D, 0P
    Right (≤ 4)   : 2D, 5P, 3T

    Gini Left     : 1 - (5/5)² = 0
    Gini Right    : 1 - (2/10)² - (5/10)² - (3/10)² = 0,620
    Weighted Gini : (5/15)*0 + (10/15)*0,620 = 0,413

Split C2 (Pendidikan) = S1:
    Left (S1)     : 4D, 3P
    Right (lainnya): 3D, 2P, 3T

    Gini Left     : 1 - (4/7)² - (3/7)² = 0,490
    Gini Right    : 1 - (3/8)² - (2/8)² - (3/8)² = 0,656
    Weighted Gini : (7/15)*0,490 + (8/15)*0,656 = 0,578

Split terbaik: C5 > 80 (Gini terkecil = 0,341)`}
                                </pre>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-700 mb-2">
                                    Langkah 3: Split Node Cabang (&gt; 80)
                                </h3>
                                <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto font-mono whitespace-pre-wrap">
                                    {`Evaluasi split terbaik untuk 8 sampel ini:

Split C3 > 4:
    Left    : 5D, 0P → Gini = 0
    Right   : 2D, 1P → Gini = 0,444
    Weighted Gini : (5/8)*0 + (3/8)*0,444 = 0,167

Split C1 = 3:
    Left    : 3D, 0P → Gini = 0
    Right   : 4D, 1P → Gini = 0,320
    Weighted Gini : (3/8)*0 + (5/8)*0,320 = 0,200

Split terbaik: C3 > 4`}
                                </pre>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-700 mb-2">
                                    Langkah 4: Split Node Cabang (≤ 80)
                                </h3>
                                <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto font-mono whitespace-pre-wrap">
                                    {`Evaluasi untuk 7 sampel:

Split C2 = S1:
    Left    : 0D, 3P
    Right   : 0D, 1P, 3T

    Gini Left     : 0
    Gini Right    : 0,375
    Weighted Gini : (3/7)*0 + (4/7)*0,375 = 0,214

Split C3 > 2:
    Left    : 0D, 4P, 1T
    Right   : 0D, 0P, 2T

    Gini Left     : 0,320
    Gini Right    : 0
    Weighted Gini : (5/7)*0,320 + (2/7)*0 = 0,229

Split terbaik: C2 = S1`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GiniCalculation;
