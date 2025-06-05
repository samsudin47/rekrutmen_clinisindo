import { useState, useEffect } from "react";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function DecisionTreeCartDashboard({ initialTree, totalData }) {
    const [treeData, setTreeData] = useState(initialTree || null);
    const [statistics, setStatistics] = useState({
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
        loading: true,
        error: null,
    });

    // Fetch data from your Laravel controller
    useEffect(() => {
        if (initialTree) {
            setTreeData(initialTree);
            calculateStatistics(initialTree);
        } else {
            fetchTreeData();
        }
    }, [initialTree]);

    const fetchTreeData = async () => {
        try {
            // Replace with your actual API endpoint
            const response = await fetch("/decision-tree/data", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    // Add CSRF token if needed
                    // 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            const data = await response.json();

            if (data.success) {
                setTreeData(data.tree);
                calculateStatistics(data.tree);
            } else {
                throw new Error(data.error || "Failed to load data");
            }
        } catch (error) {
            console.error("Error fetching tree data:", error);
            setStatistics((prev) => ({
                ...prev,
                loading: false,
                error: error.message,
            }));

            // Fallback to sample data for demonstration
            loadSampleData();
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
            loading: false,
            error: null,
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

    const loadSampleData = () => {
        // Sample data for demonstration when API fails
        const sampleStats = {
            totalData: 150,
            totalNodes: 15,
            terminalNodes: 8,
            predictions: {
                Diterima: 65,
                "Tidak Diterima": 45,
                Dipertimbangkan: 40,
            },
            correctPredictions: 128,
            totalPredicted: 150,
            accuracy: 85.3,
            accuracyRate: "85.3",
            predictionCounts: {
                Diterima: 65,
                "Tidak Diterima": 45,
                Dipertimbangkan: 40,
            },
            loading: false,
            error: null,
        };
        setStatistics(sampleStats);
    };

    // Prepare data for charts
    const predictionData = [
        {
            name: "Diterima",
            value: statistics.predictions["Diterima"],
            percentage:
                statistics.totalData > 0
                    ? (
                          (statistics.predictions["Diterima"] /
                              statistics.totalData) *
                          100
                      ).toFixed(1)
                    : 0,
            color: "#10B981",
        },
        {
            name: "Dipertimbangkan",
            value: statistics.predictions["Dipertimbangkan"],
            percentage:
                statistics.totalData > 0
                    ? (
                          (statistics.predictions["Dipertimbangkan"] /
                              statistics.totalData) *
                          100
                      ).toFixed(1)
                    : 0,
            color: "#F59E0B",
        },
        {
            name: "Tidak Diterima",
            value: statistics.predictions["Tidak Diterima"],
            percentage:
                statistics.totalData > 0
                    ? (
                          (statistics.predictions["Tidak Diterima"] /
                              statistics.totalData) *
                          100
                      ).toFixed(1)
                    : 0,
            color: "#EF4444",
        },
    ];

    const summaryData = [
        {
            name: "Diterima",
            value: statistics.predictions["Diterima"],
            color: "#10B981",
        },
        {
            name: "Dipertimbangkan",
            value: statistics.predictions["Dipertimbangkan"],
            color: "#F59E0B",
        },
        {
            name: "Tidak Diterima",
            value: statistics.predictions["Tidak Diterima"],
            color: "#EF4444",
        },
    ];

    const COLORS = ["#10B981", "#F59E0B", "#EF4444"];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-800">{data.name}</p>
                    <p style={{ color: data.color }}>
                        Jumlah: {data.value} kandidat ({data.percentage}%)
                    </p>
                </div>
            );
        }
        return null;
    };

    if (statistics.loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                        Memuat data decision tree...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Decision Tree - Dashboard Cart
                    </h1>
                    <p className="text-gray-600">
                        Ringkasan analisis rekrutmen berdasarkan decision tree
                    </p>
                    {statistics.error && (
                        <div className="mt-2 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                            <p className="text-sm">
                                ⚠️ Menggunakan data sample karena:{" "}
                                {statistics.error}
                            </p>
                        </div>
                    )}
                </div>

                {/* Quick Stats Cards - Updated to match the second code */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total Data
                                </p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {statistics.totalData}
                                </p>
                            </div>
                            <div className="bg-blue-100 p-2 rounded-full">
                                <svg
                                    className="w-5 h-5 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Akurasi
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {statistics.accuracyRate}%
                                </p>
                            </div>
                            <div className="bg-green-100 p-2 rounded-full">
                                <svg
                                    className="w-5 h-5 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Jumlah Node
                                </p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {statistics.totalNodes}
                                </p>
                            </div>
                            <div className="bg-purple-100 p-2 rounded-full">
                                <svg
                                    className="w-5 h-5 text-purple-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Terminal Nodes
                                </p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {statistics.terminalNodes}
                                </p>
                            </div>
                            <div className="bg-yellow-100 p-2 rounded-full">
                                <svg
                                    className="w-5 h-5 text-yellow-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Distribution Pie Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Distribusi Hasil Prediksi
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={predictionData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percentage }) =>
                                        `${name}: ${percentage}%`
                                    }
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {predictionData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Summary Bar Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Ringkasan Kandidat
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={summaryData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value, name) => [
                                        value,
                                        "Jumlah Kandidat",
                                    ]}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {summaryData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Progress Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h4 className="font-semibold text-gray-800 mb-3">
                            Tingkat Penerimaan
                        </h4>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600 mb-2">
                                {statistics.totalData > 0
                                    ? (
                                          (statistics.predictions["Diterima"] /
                                              statistics.totalData) *
                                          100
                                      ).toFixed(1)
                                    : 0}
                                %
                            </div>
                            <div className="bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                    style={{
                                        width:
                                            statistics.totalData > 0
                                                ? `${
                                                      (statistics.predictions[
                                                          "Diterima"
                                                      ] /
                                                          statistics.totalData) *
                                                      100
                                                  }%`
                                                : "0%",
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h4 className="font-semibold text-gray-800 mb-3">
                            Perlu Pertimbangan
                        </h4>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600 mb-2">
                                {statistics.totalData > 0
                                    ? (
                                          (statistics.predictions[
                                              "Dipertimbangkan"
                                          ] /
                                              statistics.totalData) *
                                          100
                                      ).toFixed(1)
                                    : 0}
                                %
                            </div>
                            <div className="bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-yellow-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                    style={{
                                        width:
                                            statistics.totalData > 0
                                                ? `${
                                                      (statistics.predictions[
                                                          "Dipertimbangkan"
                                                      ] /
                                                          statistics.totalData) *
                                                      100
                                                  }%`
                                                : "0%",
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h4 className="font-semibold text-gray-800 mb-3">
                            Tingkat Penolakan
                        </h4>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600 mb-2">
                                {statistics.totalData > 0
                                    ? (
                                          (statistics.predictions[
                                              "Tidak Diterima"
                                          ] /
                                              statistics.totalData) *
                                          100
                                      ).toFixed(1)
                                    : 0}
                                %
                            </div>
                            <div className="bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-red-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                    style={{
                                        width:
                                            statistics.totalData > 0
                                                ? `${
                                                      (statistics.predictions[
                                                          "Tidak Diterima"
                                                      ] /
                                                          statistics.totalData) *
                                                      100
                                                  }%`
                                                : "0%",
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Refresh Button */}
                <div className="mt-6 text-center">
                    <button
                        onClick={fetchTreeData}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
                        disabled={statistics.loading}
                    >
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
                    </button>
                </div>
            </div>
        </div>
    );
}
