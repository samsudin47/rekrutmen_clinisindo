import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { Head, useForm } from "@inertiajs/react";

export default function CriteriaEdit({ criteria, categoryList }) {
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            kode: criteria.kode,
            nama: criteria.nama,
            skala_pengukuran: criteria.skala_pengukuran,
            deskripsi: criteria.deskripsi,
            kategori_id: criteria.kategori_id || "",
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route("criterias.update", criteria), {
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
                    Criteria
                </h2>
            }
        >
            <Head title="Criteria" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-4"></div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <section className="max-w-xl">
                                <header>
                                    <h2 className="text-lg font-medium text-gray-900">
                                        Update Criteria
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-600">
                                        Update a criteria's information.
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
                                            htmlFor="skala_pengukuran"
                                            value="Skala Pengukuran"
                                        />

                                        <TextInput
                                            id="posisi"
                                            className="mt-1 block w-full"
                                            value={data.skala_pengukuran}
                                            onChange={(e) =>
                                                setData(
                                                    "skala_pengukuran",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            isFocused
                                            autoComplete="skala_pengukuran"
                                        />

                                        <InputError
                                            className="mt-2"
                                            message={errors.skala_pengukuran}
                                        />
                                    </div>
                                    <div>
                                        <InputLabel
                                            htmlFor="deskripsi"
                                            value="Deskripsi"
                                        />

                                        <TextInput
                                            id="deskripsi"
                                            className="mt-1 block w-full"
                                            value={data.deskripsi}
                                            onChange={(e) =>
                                                setData(
                                                    "deskripsi",
                                                    e.target.value
                                                )
                                            }
                                            autoComplete="deskripsi"
                                        />

                                        <InputError
                                            message={errors.deskripsi}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="kayegori_id"
                                            value="Kategori"
                                        />

                                        <select
                                            id="kategori_id"
                                            name="kategori_id"
                                            value={data.kategori_id}
                                            onChange={(e) =>
                                                setData(
                                                    "kategori_id",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="">
                                                Pilih Kategori
                                            </option>
                                            {categoryList.map((category) => (
                                                <option
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.description}
                                                </option>
                                            ))}
                                        </select>

                                        <InputError
                                            message={errors.kategori_id}
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
