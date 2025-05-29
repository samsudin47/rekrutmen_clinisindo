import { useState, useEffect } from "react";

export default function DecisionTree({ onDataRequest = null }) {
    const [tree, setTree] = useState(null);
    const [loading, setLoading] = useState(false);
    const [statistics, setStatistics] = useState(null);

    useEffect(() => {
        if (onDataRequest) {
            loadTreeData();
        }
    }, [onDataRequest]); // Tambahkan dependensi

    const loadTreeData = async () => {
        setLoading(true);
        try {
            const data = await onDataRequest();
            setTree(data.tree); // Pastikan untuk mengambil data.tree
            calculateStatistics(data.tree); // Hitung statistik dari tree
        } catch (error) {
            console.error("Error loading tree data:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStatistics = (node) => {
        const stats = {
            totalData: 0,
            accuracy: 0,
            predictions: {
                Diterima: 0,
                "Tidak Diterima": 0,
                Dipertimbangkan: 0,
            },
        };

        const traverse = (n) => {
            if (n.isTerminal && n.result && n.count) {
                stats.totalData += n.count;
                if (stats.predictions[n.result] !== undefined) {
                    stats.predictions[n.result] += n.count;
                }
            }
            if (n.children) {
                n.children.forEach(traverse);
            }
        };

        traverse(node);

        if (stats.totalData > 0) {
            stats.accuracy =
                ((stats.predictions["Diterima"] +
                    stats.predictions["Tidak Diterima"]) /
                    stats.totalData) *
                100;
        }

        setStatistics(stats);
    };

    const TreeNode = ({ node, level = 0 }) => {
        if (!node) return null;
        const isTerminal = node.isTerminal || node.result;
        const marginLeft = level * 40;

        return (
            <div
                className="tree-node"
                style={{ marginLeft: `${marginLeft}px` }}
            >
                <div className="flex flex-col items-center mb-4">
                    <div
                        className={`px-4 py-3 rounded-lg text-white text-sm font-medium text-center min-w-32 shadow-lg ${
                            isTerminal
                                ? node.color || "bg-gray-500"
                                : "bg-blue-500 hover:bg-blue-600 transition-colors"
                        }`}
                    >
                        {isTerminal ? (
                            <>
                                <div className="font-bold">{node.result}</div>
                                {node.count !== undefined && (
                                    <div className="text-xs mt-1 opacity-80">
                                        ({node.count} data)
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div>{node.condition}</div>
                                {node.threshold && (
                                    <div className="text-xs mt-1 opacity-80">
                                        {node.operator} {node.threshold}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {!isTerminal && node.children && (
                        <div className="mt-4 w-full">
                            <div className="flex justify-center mb-2">
                                <div className="w-px h-8 bg-gray-400"></div>
                            </div>

                            <div
                                className={`grid gap-8 grid-cols-${node.children.length}`}
                            >
                                {node.children.map((child, index) => (
                                    <div
                                        key={child.id || index}
                                        className="flex flex-col items-center"
                                    >
                                        <div className="w-px h-4 bg-gray-400 mb-2"></div>
                                        <TreeNode
                                            node={child}
                                            level={level + 1}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="decision-tree-container p-6">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Decision Tree - CART Algorithm
                    </h2>
                    {onDataRequest && (
                        <button
                            onClick={loadTreeData}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Loading...
                                </>
                            ) : (
                                "Refresh Data"
                            )}
                        </button>
                    )}
                </div>

                {statistics && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-blue-800">
                                Total Data
                            </h3>
                            <p className="text-2xl font-bold text-blue-600">
                                {statistics.totalData}
                            </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-green-800">
                                Akurasi
                            </h3>
                            <p className="text-2xl font-bold text-green-600">
                                {statistics.accuracy.toFixed(2)}%
                            </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-purple-800">
                                Prediksi
                            </h3>
                            <div className="text-sm space-y-1">
                                <div>
                                    Diterima:{" "}
                                    {statistics.predictions["Diterima"]}
                                </div>
                                <div>
                                    Tidak Diterima:{" "}
                                    {statistics.predictions["Tidak Diterima"]}
                                </div>
                                <div>
                                    Dipertimbangkan:{" "}
                                    {statistics.predictions["Dipertimbangkan"]}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="tree-visualization bg-white rounded-lg shadow-lg p-8 overflow-x-auto">
                {tree ? (
                    <TreeNode node={tree} />
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        Tidak ada data pohon keputusan
                    </div>
                )}
            </div>
        </div>
    );
}
