import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { Head, useForm } from "@inertiajs/react";

export default function UserEdit({ candidate, statusList }) {
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            kode: candidate.kode,
            nama: candidate.nama,
            posisi: candidate.posisi,
            pendidikan: candidate.pendidikan,
            pengalaman: candidate.pengalaman,
            gaji: candidate.gaji,
            psikotest: candidate.psikotest,
            status_id: candidate.status_id || "",
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route("candidates.update", candidate), {
            preserveScroll: true,
            onSuccess: () => {
                alert("Candidate updated successfully");
            },
            onError: (errors) => {
                console.log(errors);
            },
        });
    };
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Candidates
                </h2>
            }
        >
            <Head title="Candidates" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-4"></div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <section className="max-w-xl">
                                <header>
                                    <h2 className="text-lg font-medium text-gray-900">
                                        Update Candidate
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-600">
                                        Update a candidates's information.
                                    </p>
                                </header>

                                <form
                                    onSubmit={submit}
                                    className="mt-6 space-y-6"
                                >
                                    <div>
                                        <InputLabel
                                            htmlFor="kode"
                                            value="Kode"
                                        />

                                        <TextInput
                                            id="kode"
                                            className="mt-1 block w-full"
                                            value={data.kode}
                                            onChange={(e) =>
                                                setData("kode", e.target.value)
                                            }
                                            required
                                            isFocused
                                            autoComplete="kode"
                                        />

                                        <InputError
                                            className="mt-2"
                                            message={errors.kode}
                                        />
                                    </div>
                                    <div>
                                        <InputLabel
                                            htmlFor="nama"
                                            value="Nama"
                                        />

                                        <TextInput
                                            id="nama"
                                            className="mt-1 block w-full"
                                            value={data.nama}
                                            onChange={(e) =>
                                                setData("nama", e.target.value)
                                            }
                                            required
                                            isFocused
                                            autoComplete="nama"
                                        />

                                        <InputError
                                            className="mt-2"
                                            message={errors.nama}
                                        />
                                    </div>
                                    <div>
                                        <InputLabel
                                            htmlFor="posisi"
                                            value="Posisi"
                                        />

                                        <TextInput
                                            id="posisi"
                                            className="mt-1 block w-full"
                                            value={data.posisi}
                                            onChange={(e) =>
                                                setData(
                                                    "posisi",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            isFocused
                                            autoComplete="posisi"
                                        />

                                        <InputError
                                            className="mt-2"
                                            message={errors.posisi}
                                        />
                                    </div>
                                    <div>
                                        <InputLabel
                                            htmlFor="pendidiksn"
                                            value="Pendidikan"
                                        />

                                        <TextInput
                                            id="pendidikan"
                                            value={data.pendidikan}
                                            onChange={(e) =>
                                                setData(
                                                    "pendidikan",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full"
                                            autoComplete="pendidikan"
                                        />

                                        <InputError
                                            message={errors.pendidikan}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel
                                            htmlFor="pengalaman"
                                            value="Pengalaman"
                                        />

                                        <TextInput
                                            id="pengalaman"
                                            value={data.pengalaman}
                                            onChange={(e) =>
                                                setData(
                                                    "pengalaman",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full"
                                            autoComplete="pengalaman"
                                        />

                                        <InputError
                                            message={errors.pengalaman}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel
                                            htmlFor="gaji"
                                            value="Gaji"
                                        />

                                        <TextInput
                                            id="gaji"
                                            value={data.gaji}
                                            onChange={(e) =>
                                                setData("gaji", e.target.value)
                                            }
                                            className="mt-1 block w-full"
                                            autoComplete="gaji"
                                        />

                                        <InputError
                                            message={errors.gaji}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel
                                            htmlFor="pskiotest"
                                            value="Psikotest"
                                        />

                                        <TextInput
                                            id="psikotest"
                                            value={data.psikotest}
                                            onChange={(e) =>
                                                setData(
                                                    "psikotest",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full"
                                            autoComplete="psikotest"
                                        />

                                        <InputError
                                            message={errors.psikotest}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="status_id"
                                            value="Status"
                                        />

                                        <select
                                            id="status_id"
                                            name="status_id"
                                            value={data.status_id}
                                            onChange={(e) =>
                                                setData(
                                                    "status_id",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="">
                                                -- Pilih Status --
                                            </option>
                                            {statusList.map((status) => (
                                                <option
                                                    key={status.id}
                                                    value={status.id}
                                                >
                                                    {status.description}
                                                </option>
                                            ))}
                                        </select>

                                        <InputError
                                            message={errors.status_id}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <PrimaryButton disabled={processing}>
                                            Save
                                        </PrimaryButton>

                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-gray-600">
                                                Saved.
                                            </p>
                                        </Transition>
                                    </div>
                                </form>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
