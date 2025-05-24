import React from "react";

export default function MetricsPanel({ metrics }) {
    return (
        <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700 text-center">
                        Akurasi Model
                    </h3>
                    <div className="text-2xl font-bold text-center my-3">
                        {metrics.accuracy}
                    </div>
                    <p className="text-center text-gray-600">
                        13 dari 15 data terklasifikasi dengan benar
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700 text-center">
                        Gini Impurity Awal
                    </h3>
                    <div className="text-2xl font-bold text-center my-3">
                        {metrics.giniImpurity}
                    </div>
                    <p className="text-center text-gray-600">
                        Nilai ketidakmurnian data sebelum pemisahan
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700 text-center">
                        Split Terbaik
                    </h3>
                    <div className="text-2xl font-bold text-center my-3">
                        {metrics.bestSplit}
                    </div>
                    <p className="text-center text-gray-600">
                        Weighted Gini: 0.341
                    </p>
                </div>
            </div>
        </div>
    );
}
