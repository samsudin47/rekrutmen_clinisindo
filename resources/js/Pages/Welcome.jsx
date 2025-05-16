import { Head, Link } from "@inertiajs/react";
import bg from "../../../public/assets/img/bg-icon.svg";

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Rekrutmen CL" />
            <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
                <img
                    id="background"
                    className="absolute h-screen overflow-hidden object-cover w-full"
                    src={bg}
                />
                <div className="relative flex h-screen flex-col items-center justify-center overflow-hidden">
                    <div className="w-full max-w-2xl px-6 lg:max-w-7xl">
                        <div className="flex lg:justify-center">
                            <h1 className="text-xl font-semibold text-black dark:text-white mb-5">
                                SISTEM PENDUKUNG KEPUTUSAN
                            </h1>
                        </div>
                        <div className="flex lg:justify-center">
                            <div className="w-full">
                                <h2 className="text-sm font-semibold text-black dark:text-white text-center mt-2">
                                    PENERAPAN METODE CLASSIFICATION AND
                                    REGRESSION TREE (CART) PADA SISTEM PENDUKUNG
                                    KEPUTUSAN REKRUTMEN KARYAWAN <br /> PT
                                    CLINISINDO LABORATORIES
                                </h2>
                            </div>
                        </div>

                        <header className="grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3">
                            <div className="flex lg:col-start-2 lg:justify-center rounded-lg bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20] ">
                                <nav>
                                    {auth.user ? (
                                        <Link
                                            href={route("dashboard")}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route("login")}
                                                className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                            >
                                                Log in
                                            </Link>
                                            <Link
                                                href={route("register")}
                                                className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                            >
                                                Register
                                            </Link>
                                        </>
                                    )}
                                </nav>
                            </div>
                        </header>
                        <footer className="py-16 text-center font-semibold text-sm text-black dark:text-white/70">
                            PT. CLINISINDO LABORATORIES @2025
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
