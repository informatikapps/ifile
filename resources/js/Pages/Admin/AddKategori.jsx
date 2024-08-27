import {
    Head,
    useForm
} from '@inertiajs/react';
import { NavbarAdmin } from '@/Components/Navbar';
import { IconArrowLeft } from "@tabler/icons-react";
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Swal from 'sweetalert2';

export default function AddKategori({ auth, kategori }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        kategori: '',
        keterangan: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if ((!data.kategori || !data.keterangan)) {
            Swal.fire({
                title: "Ada field kosong!",
                text: "Jangan lupa pilih isi kelengkapan datanya dulu ya!",
                icon: "question"
            });
            return;
        }

        const formData = new FormData();
        formData.append('namaFile', data.kategori);
        formData.append('deskripsi', data.keterangan);

        post(route('tambah-kategori.store'), {
            onSuccess: () => {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Kategori berhasil ditambahkan!",
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    reset();
                });
            },
            onError: () => {
                Swal.fire({
                    position: "top-end",
                    title: "Gagal!",
                    text: "Ada masalah saat menambahkan kategori.",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    };

    return (
        <>
            <Head title="Kategori" />
            <div className='flex w-full'>
                <NavbarAdmin auth={auth} kategori={kategori} />
                <div className="w-4/5 p-10">
                    <div className="w-1/2 p-4 m-auto rounded-md shadow-md shadow-i-amber-500/20">
                        <p className='text-lg font-bold text-center text-i-amber-500'>Tambah Kategori</p>
                        <form action="" method='post' className='flex flex-col justify-center mt-4'>
                            <div>
                                <InputLabel className='text-i-amber-500' htmlFor="kategori" value="Nama Kategori" />

                                <TextInput
                                    id="kategori"
                                    type="text"
                                    name="kategori"
                                    value={data.kategori}
                                    className="block w-full mt-1"
                                    autoComplete="current-kategori"
                                    isFocused={true}
                                    placeholder='Nama kategori'
                                    onChange={(e) => setData('kategori', e.target.value)}
                                />

                                <InputError message={errors.kategori} className="mt-2 text-[#ff0000]" />
                            </div>

                            <div className="mt-4">
                                <InputLabel className='text-i-amber-500' htmlFor="keterangan" value="Keterangan" />

                                <TextInput
                                    id="keterangan"
                                    type="text"
                                    name="keterangan"
                                    value={data.keterangan}
                                    className="block w-full mt-1"
                                    autoComplete="current-keterangan"
                                    placeholder='Keterangan'
                                    onChange={(e) => setData('keterangan', e.target.value)}
                                />

                                <InputError message={errors.keterangan} className="mt-2 text-[#ff0000]" />
                            </div>
                            <div className="flex self-center justify-center w-11/12 gap-4 mt-4 text-sm ">
                                <button type="button" className="flex items-center justify-center w-full gap-2 py-2 text-white text-gray-600 rounded-md px-7 h-fit hover:text-gray-900 focus:bg-i-orange-500/60 bg-i-orange-500"
                                    onClick={() => window.history.back()}>
                                    <IconArrowLeft size={20} />
                                    Batal
                                </button>
                                <button type="submit" className="w-full py-2 text-white text-gray-600 rounded-md px-7 h-fit hover:text-gray-900 focus:bg-i-amber-500/60 bg-i-amber-500"
                                    onClick={handleSubmit}>
                                    + Tambah Kategori
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
