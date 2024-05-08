import {
    Head,
    useForm
} from '@inertiajs/react';
import { NavbarAdmin } from "@/Components/Navbar";
import { IconPencil, IconArrowLeft } from "@tabler/icons-react";
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function EditKategori({ auth, kategori, allKategori }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        kategori: kategori.kategori,
        keterangan: kategori.keterangan,
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
        formData.append('kategori', data.kategori);
        formData.append('keterangan', data.keterangan);

        post(route('edit-kategori.update', { id: kategori.id }), formData);
    }

    return (
        <>
            <Head title="Edit Kategori"></Head>
            <div className='flex w-full'>
                <NavbarAdmin auth={auth} kategori={allKategori} />
                <div className="w-4/5 p-10">
                    <div className="w-1/2 p-4 m-auto rounded-md shadow-md shadow-i-amber-500/20">
                        <p className='text-lg font-bold text-center text-i-amber-500'>Tambah Kategori</p>
                        <form action="" method='post' className='flex flex-col justify-center'>
                            <div>
                                <InputLabel className='text-i-amber-500' htmlFor="kategori" value="Nama Kategori" />

                                <TextInput
                                    id="kategori"
                                    type="text"
                                    name="kategori"
                                    value={data.kategori}
                                    className="block w-full mt-1"
                                    autoComplete="current-kategori"
                                    isfocused={true}
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
                                <button type="button" className="flex justify-center w-full gap-2 py-2 text-white text-gray-600 rounded-md px-7 h-fit hover:text-gray-900 focus:bg-i-orange-500/60 bg-i-orange-500"
                                    onClick={() => window.history.back()}>
                                    <IconArrowLeft size={20} />
                                    Batal
                                </button>
                                <button type="submit" className="flex w-full gap-2 py-2 text-white text-gray-600 rounded-md px-7 h-fit hover:text-gray-900 focus:bg-i-amber-500/60 bg-i-amber-500"
                                    onClick={handleSubmit}>
                                    <IconPencil size={20} />
                                    Ubah Kategori
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}