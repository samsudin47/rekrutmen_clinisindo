import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";

export default function CriteriasIndex({ criterias }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Data Kriteria
                </h2>
            }
        >
            <Head title="Criterias" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-4">
                        <label>Data Kriteria : {criterias.total}</label>

                        <Link
                            href={route("criterias.create")}
                            className="bg-indigo-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                        >
                            Create Criteria
                        </Link>
                    </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Kode
                                        </th>
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
                                            Skala Pengukuran
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Deskripsi
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Kategori
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {criterias.data.map((criteria) => (
                                        <tr key={criteria.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {criteria.kode}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {criteria.nama}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {criteria.skala_pengukuran}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {criteria.deskripsi}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {criteria.category
                                                    ?.description ?? "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link
                                                    href={route(
                                                        "criterias.edit",
                                                        criteria.id
                                                    )}
                                                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900"
                                                    type="button"
                                                >
                                                    Edit
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Pagination links={criterias.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
