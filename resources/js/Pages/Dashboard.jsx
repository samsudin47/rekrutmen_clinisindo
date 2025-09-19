import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Cart from "../Pages/DashboardCart/Cart";

export default function Dashboard({ treeData, totalData, premiumStatus }) {
    const getPremiumBadgeColor = () => {
        if (!premiumStatus?.is_premium) {
            return { text: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-300' };
        }
        
        if (premiumStatus.is_active) {
            return { text: 'text-green-600', bg: 'bg-green-100', border: 'border-green-300' };
        }
        
        return { text: 'text-red-600', bg: 'bg-red-100', border: 'border-red-300' };
    };

    const badgeColors = getPremiumBadgeColor();

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard Cart
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Premium Status Section */}
                    <div className="mb-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Status Akun Anda
                            </h3>
                            <div className="flex items-center space-x-4">
                                <div className={`inline-flex items-center px-4 py-2 rounded-lg border ${badgeColors.bg} ${badgeColors.text} ${badgeColors.border}`}>
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M9.664 1.319a.75.75 0 01.672 0 41.059 41.059 0 018.198 5.424.75.75 0 01-.254 1.285 31.372 31.372 0 00-7.86 3.83.75.75 0 01-.84 0 31.508 31.508 0 00-2.08-1.287V9.394c0-.244.116-.463.302-.592a35.504 35.504 0 013.305-2.033.75.75 0 00-.714-1.319 37 37 0 00-3.446 2.12A2.216 2.216 0 006 9.393v.38a31.293 31.293 0 00-4.28-1.746.75.75 0 01-.254-1.285 41.059 41.059 0 018.198-5.424zM6 11.459a29.848 29.848 0 00-2.455-1.158 41.029 41.029 0 00-.39 3.114.75.75 0 00.419.74c.528.256 1.046.53 1.554.82-.21-.899-.322-1.85-.322-2.816zm-3.982 5.772a.75.75 0 00-.309-.588 41.054 41.054 0 01-4.198-5.424.75.75 0 00-.254-1.285 31.372 31.372 0 017.86-3.83.75.75 0 01.84 0 31.508 31.508 0 012.08 1.287V15.394c0 .244-.116.463-.302.592a35.504 35.504 0 01-3.305 2.033.75.75 0 01-.714-1.319 37 37 0 003.446-2.12A2.216 2.216 0 0014 15.393v-.38a31.293 31.293 0 014.28 1.746.75.75 0 01.254 1.285 41.059 41.059 0 01-8.198 5.424.75.75 0 01-.672 0 29.848 29.848 0 01-2.455-1.158 41.029 41.029 0 01-.39-3.114.75.75 0 01.419-.74c.528-.256 1.046-.53 1.554-.82.21.899.322 1.85.322 2.816z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-medium">
                                            {premiumStatus?.premium_status_text || 'Free Account'}
                                        </span>
                                    </div>
                                </div>
                                {premiumStatus?.premium_expires_at && (
                                    <div className="text-sm text-gray-600">
                                        Berakhir: {new Date(premiumStatus.premium_expires_at).toLocaleDateString('id-ID')}
                                    </div>
                                )}
                            </div>
                            
                            {/* Premium Benefits or Upgrade Message */}
                            <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <h4 className="font-medium text-blue-900">
                                            {premiumStatus?.is_active ? 'Fitur Premium Aktif' : 'Upgrade ke Premium'}
                                        </h4>
                                        <p className="text-sm text-blue-700 mt-1">
                                            {premiumStatus?.is_active 
                                                ? 'Anda memiliki akses penuh ke semua fitur analisis CART dan manajemen data kandidat.'
                                                : 'Dapatkan akses ke fitur analisis lanjutan, penyimpanan data unlimited, dan dukungan prioritas.'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <Cart
                                initialTreeData={treeData}
                                initialTotalData={totalData}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
