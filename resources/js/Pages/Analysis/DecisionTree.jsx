import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";

export default function DecisionTree({ initialTree, totalData }) {
    const [tree, setTree] = useState(initialTree);
    const [loading, setLoading] = useState(false);
    const [statistics, setStatistics] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (initialTree) {
            setTree(initialTree);
            calculateStatistics(initialTree);
        } else {
            loadTreeData();
        }
    }, [initialTree]);

    const loadTreeData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Use Inertia's visit method instead of fetch
            router.visit("/decision-tree/data", {
                method: "get",
                onSuccess: (page) => {
                    if (page.props && page.props.tree) {
                        setTree(page.props.tree);
                        calculateStatistics(page.props.tree);
                    }
                },
                onError: (errors) => {
                    console.error("Error loading tree data:", errors);
                    setError("Gagal memuat data pohon keputusan");
                },
                onFinish: () => {
                    setLoading(false);
                },
            });
        } catch (error) {
            console.error("Error loading tree data:", error);
            setError("Gagal memuat data pohon keputusan");
            setLoading(false);
        }
    };

    // Alternative method using axios if available
    const loadTreeDataWithAxios = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("/decision-tree/data", {
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content"),
                },
            });

            if (response.data && response.data.tree) {
                setTree(response.data.tree);
                calculateStatistics(response.data.tree);
            }
        } catch (error) {
            console.error("Error loading tree data:", error);
            setError("Gagal memuat data pohon keputusan");
        } finally {
            setLoading(false);
        }
    };

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

            // Count all data samples that flow through terminal nodes
            if (n.isTerminal && n.result) {
                stats.terminalNodes++;
                const count = n.count || 0;

                // Add to total data
                stats.totalData += count;
                stats.totalPredicted += count;

                // Count predictions by category - Fixed logic for "Dipertimbangkan"
                const result = n.result.trim(); // Remove any whitespace

                // Handle different possible variations of the result names
                if (result === "Diterima") {
                    stats.predictions["Diterima"] += count;
                    stats.predictionCounts["Diterima"] += count;
                } else if (result === "Tidak Diterima") {
                    stats.predictions["Tidak Diterima"] += count;
                    stats.predictionCounts["Tidak Diterima"] += count;
                } else if (
                    result === "Dipertimbangkan" ||
                    result === "Pertimbangkan" ||
                    result.includes("pertimbang")
                ) {
                    // Handle various forms of "Dipertimbangkan"
                    stats.predictions["Dipertimbangkan"] += count;
                    stats.predictionCounts["Dipertimbangkan"] += count;
                } else {
                    // Log unknown results for debugging
                    console.log("Unknown result found:", result);
                    // Try to match partial strings
                    if (result.toLowerCase().includes("terima")) {
                        if (result.toLowerCase().includes("tidak")) {
                            stats.predictions["Tidak Diterima"] += count;
                            stats.predictionCounts["Tidak Diterima"] += count;
                        } else {
                            stats.predictions["Diterima"] += count;
                            stats.predictionCounts["Diterima"] += count;
                        }
                    } else if (result.toLowerCase().includes("pertimbang")) {
                        stats.predictions["Dipertimbangkan"] += count;
                        stats.predictionCounts["Dipertimbangkan"] += count;
                    }
                }

                // Calculate correct predictions based on node accuracy or purity
                let correctCount = count;

                // If node has accuracy/purity information, use it
                if (n.accuracy !== undefined) {
                    correctCount = Math.round(count * (n.accuracy / 100));
                } else if (n.purity !== undefined) {
                    correctCount = Math.round(count * n.purity);
                } else if (n.details) {
                    // Calculate purity from details if available
                    const values = Object.values(n.details);
                    const maxValue = Math.max(...values);
                    const totalInNode = values.reduce(
                        (sum, val) => sum + val,
                        0
                    );
                    if (totalInNode > 0) {
                        correctCount = maxValue; // Only the majority class is considered correct
                    }
                }

                stats.correctPredictions += correctCount;
            }

            if (n.children && n.children.length > 0) {
                n.children.forEach(traverse);
            }
        };

        traverse(node);

        // Calculate accuracy
        if (stats.totalPredicted > 0) {
            stats.accuracy =
                (stats.correctPredictions / stats.totalPredicted) * 100;
            stats.accuracyRate = stats.accuracy.toFixed(1);
        }

        // Debug log to check the final statistics
        console.log("Final statistics:", stats);

        setStatistics(stats);
    };

    const TreeNode = ({ node, level = 0 }) => {
        if (!node) return null;

        const isTerminal = node.isTerminal || node.result;
        const marginLeft = level * 20;
        const hasChildren = node.children && node.children.length > 0;

        return (
            <div
                className="flex flex-col items-center mb-6"
                style={{ paddingLeft: `${marginLeft}px` }}
            >
                {/* Node Card */}
                <div
                    className={`px-4 py-3 rounded-lg text-white text-sm font-medium text-center min-w-48 shadow-lg transition-all duration-200 hover:shadow-xl ${
                        isTerminal
                            ? node.color || "bg-gray-500"
                            : "bg-blue-500 hover:bg-blue-600"
                    }`}
                >
                    {isTerminal ? (
                        <div>
                            <div className="font-bold text-base">
                                {node.result}
                            </div>
                            <div className="text-xs mt-1 opacity-90">
                                {node.condition}
                            </div>
                            {node.count !== undefined && (
                                <div className="text-xs mt-2 opacity-80 bg-black bg-opacity-20 rounded px-2 py-1">
                                    {node.count} kandidat
                                </div>
                            )}
                            {node.details && (
                                <div className="text-xs mt-1 opacity-80">
                                    {Object.entries(node.details).map(
                                        ([key, value]) => (
                                            <div key={key}>
                                                {key}: {value}
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <div className="font-semibold">
                                {node.condition}
                            </div>
                            {node.threshold !== undefined && (
                                <div className="text-xs mt-1 opacity-90">
                                    {node.operator} {node.threshold}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Connection Lines and Children */}
                {hasChildren && (
                    <div className="mt-4 w-full flex flex-col items-center">
                        {/* Vertical line down */}
                        <div className="w-px h-6 bg-gray-400"></div>

                        {/* Horizontal connector */}
                        <div className="flex items-center">
                            <div className="h-px bg-gray-400 flex-1"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full mx-1"></div>
                            <div className="h-px bg-gray-400 flex-1"></div>
                        </div>

                        {/* Children container */}
                        <div className="mt-4 flex justify-center gap-8 flex-wrap">
                            {node.children.map((child, index) => (
                                <div
                                    key={child.id || index}
                                    className="flex flex-col items-center"
                                >
                                    {/* Vertical line up to child */}
                                    <div className="w-px h-6 bg-gray-400"></div>

                                    {/* Branch labels */}
                                    {!child.isTerminal && (
                                        <div className="text-xs text-gray-600 mb-2 px-2 py-1 bg-gray-100 rounded">
                                            {index === 0 ? "Tidak" : "Ya"}
                                        </div>
                                    )}

                                    {/* Child node */}
                                    <TreeNode node={child} level={level + 1} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="decision-tree-container p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">
                            Memuat data pohon keputusan...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="decision-tree-container p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="text-red-500 text-4xl mb-4">⚠️</div>
                        <p className="text-red-600 text-lg font-semibold">
                            {error}
                        </p>
                        <button
                            onClick={() => router.visit("/decision-tree")}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Coba Lagi
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="decision-tree-container p-6 bg-gray-50 min-h-screen">
            <Head title="Pohon Keputusan" />
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Pohon Keputusan Rekrutmen
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Visualisasi algoritma decision tree berdasarkan data
                            training
                        </p>
                    </div>
                    <button
                        onClick={() =>
                            router.visit("/decision-tree", { method: "get" })
                        }
                        disabled={loading}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2 shadow-lg"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Memuat...
                            </>
                        ) : (
                            <>
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                                Refresh Data
                            </>
                        )}
                    </button>
                </div>

                {/* Statistics Cards */}
                {statistics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
                            <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                                Total Data
                            </h3>
                            <p className="text-3xl font-bold text-blue-600 mt-2">
                                {statistics.totalData}
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
                            <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                                Akurasi
                            </h3>
                            <p className="text-3xl font-bold text-green-600 mt-2">
                                {statistics.accuracyRate}%
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
                            <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                                Jumlah Node
                            </h3>
                            <p className="text-3xl font-bold text-purple-600 mt-2">
                                {statistics.totalNodes}
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-yellow-500">
                            <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                                Terminal Nodes
                            </h3>
                            <p className="text-3xl font-bold text-yellow-600 mt-2">
                                {statistics.terminalNodes}
                            </p>
                        </div>
                    </div>
                )}

                {/* Prediction Distribution */}
                {statistics && (
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                        <h3 className="font-semibold text-gray-800 text-lg mb-4">
                            Distribusi Prediksi
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                    {statistics.predictions["Diterima"]}
                                </div>
                                <div className="text-sm text-green-700">
                                    Diterima
                                </div>
                            </div>
                            <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                <div className="text-2xl font-bold text-yellow-600">
                                    {statistics.predictions["Dipertimbangkan"]}
                                </div>
                                <div className="text-sm text-yellow-700">
                                    Dipertimbangkan
                                </div>
                            </div>
                            <div className="text-center p-4 bg-red-50 rounded-lg">
                                <div className="text-2xl font-bold text-red-600">
                                    {statistics.predictions["Tidak Diterima"]}
                                </div>
                                <div className="text-sm text-red-700">
                                    Tidak Diterima
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Tree Visualization */}
            <div className="tree-visualization bg-white rounded-lg shadow-lg p-8 overflow-x-auto min-h-96">
                {tree ? (
                    <div className="flex justify-center">
                        <TreeNode node={tree} />
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <div className="text-6xl mb-4">🌳</div>
                        <p className="text-lg">
                            Tidak ada data pohon keputusan
                        </p>
                        <p className="text-sm mt-2">
                            Klik tombol "Refresh Data" untuk memuat ulang
                        </p>
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
                <h3 className="font-semibold text-gray-800 text-lg mb-4">
                    Keterangan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span className="text-sm text-gray-700">
                            Node Keputusan
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span className="text-sm text-gray-700">Diterima</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                        <span className="text-sm text-gray-700">
                            Dipertimbangkan
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span className="text-sm text-gray-700">
                            Tidak Diterima
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-gray-400 rounded"></div>
                        <span className="text-sm text-gray-700">Koneksi</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
