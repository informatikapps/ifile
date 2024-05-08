import {
    Head,
    useForm
} from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Navbar, NavbarAdmin } from '@/Components/Navbar'
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Dropdown from '@/Components/Dropdown';
import { IconEdit, IconPencil, IconArrowLeft } from '@tabler/icons-react';
import Swal from 'sweetalert2';

export default function EditFile({ auth, file, kategori }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nama_file: file.nama_file,
        deskripsi: file.deskripsi,
        kategori: file.kategori,
        file: '',
        jenisFile: file.jenis_file,
        link: file.url,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!data.nama_file || !data.deskripsi || !data.kategori) {
            Swal.fire({
                title: "Ada field kosong!",
                text: "Jangan lupa pilih isi kelengkapan datanya dulu ya!",
                icon: "question",
                confirmButtonColor: "#fe8e00"
            });
            return;
        }

        if (data.jenisFile === 'upload' && !data.file) {
            Swal.fire({
                title: "Ada field kosong!",
                text: "Jangan lupa pilih file dulu ya!",
                icon: "question",
                confirmButtonColor: "#fe8e00"
            });
            return;
        }
        if (data.jenisFile === 'link' && !data.link) {
            Swal.fire({
                title: "Ada field kosong!",
                text: "Jangan lupa pilih isi URL dulu ya!",
                icon: "question",
                confirmButtonColor: "#fe8e00"
            });
            return;
        }

        const formData = new FormData();
        formData.append('nama_file', data.nama_file);
        formData.append('deskripsi', data.deskripsi);
        formData.append('kategori', data.kategori);
        formData.append('file', data.file);
        formData.append('link', data.link)

        post(route('edit-file.update', { id: file.id }), formData);
    };

    return <>
        <Head title="Edit File"></Head>
        <div className='flex w-full'>
            {auth && auth.user && auth.user.role === 'admin' ? (
                <NavbarAdmin auth={auth} kategori={kategori} />
            ) : (
                <Navbar auth={auth} kategori={kategori} />
            )}
            <div className='w-4/5 p-10'>
                <div className="w-1/2 p-4 m-auto rounded-md shadow-md shadow-i-amber-500/20">
                    <p className='text-lg font-bold text-center text-i-amber-500'>Edit File</p>
                    <form action="" method='post' className='flex flex-col justify-center'>
                        <div>
                            <InputLabel className='text-i-amber-500' htmlFor="nama_file" value="Nama File" />

                            <TextInput
                                id="nama_file"
                                type="text"
                                name="nama_file"
                                value={data.nama_file}
                                className="block w-full mt-1"
                                autoComplete="current-nama_file"
                                isFocused={true}
                                placeholder='Nama File'
                                onChange={(e) => setData('nama_file', e.target.value)}
                            />

                            <InputError message={errors.nama_file} className="mt-2 text-[#ff0000]" />
                        </div>

                        <div className="mt-4">
                            <InputLabel className='text-i-amber-500' htmlFor="deskripsi" value="Deskripsi" />

                            <TextInput
                                id="deskripsi"
                                type="text"
                                name="deskripsi"
                                value={data.deskripsi}
                                className="block w-full mt-1"
                                autoComplete="current-deskripsi"
                                placeholder="Deskripsi file"
                                onChange={(e) => setData('deskripsi', e.target.value)}
                            />

                            <InputError message={errors.deskripsi} className="mt-2 text-[#ff0000]" />

                        </div>
                        <div className="mt-4">
                            <InputLabel className='text-i-amber-500' htmlFor="kategori" value="Kategori" />
                            <select
                                name="kategori"
                                id="kategori"
                                className='block w-full mt-1 text-sm rounded-md border-i-amber-500 focus:border-i-amber-500 focus:ring-i-amber-500'
                                value={data.kategori}
                                onChange={(e) => setData('kategori', e.target.value)}
                            >
                                <option value="">Pilih Kategori</option>
                                {kategori && kategori.map((k) => (
                                    <option key={k.id} value={k.id}>{k.kategori}</option>
                                ))}
                            </select>
                        </div>
                        {data.jenisFile === 'link' && (
                            <div className="mt-4">
                                <InputLabel className='text-i-amber-500' htmlFor="link" value="link" />
                                <TextInput
                                    type="text"
                                    name="link"
                                    id="link"
                                    placeholder='Masukkan link di sini'
                                    value={data.link}
                                    onChange={(e) => setData('link', e.target.value)}
                                    className="block w-full mt-1"
                                    required
                                />
                            </div>
                        )}
                        {data.jenisFile === 'upload' && (
                            <div className="mt-4">
                                <InputLabel className='text-i-amber-500' htmlFor="file" value="Pilih File" />
                                <input
                                    type="file"
                                    name="file"
                                    id="file"
                                    onChange={(e) => setData('file', e.target.files[0])}
                                    className='w-full mt-1 text-sm border-i-amber-500'
                                    required
                                />
                                <InputError message={errors.file} className="mt-2 text-[#ff0000]" />
                            </div>
                        )}
                        <div className="flex self-center justify-center w-4/5 gap-4 mt-4 text-sm">
                            <button type="button" className="flex items-center justify-center w-full gap-2 py-2 text-white text-gray-600 rounded-md px-7 h-fit hover:text-gray-900 focus:bg-i-orange-500/60 bg-i-orange-500"
                                onClick={() => window.history.back()}>
                                <IconArrowLeft size={20} />
                                Batal
                            </button>
                            <button type="submit" className="flex items-center w-full gap-2 py-2 text-white text-gray-600 rounded-md px-7 h-fit hover:text-gray-900 focus:bg-i-amber-500/60 bg-i-amber-500"
                                onClick={handleSubmit}>
                                <IconPencil size={20} />
                                Ubah File
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
}
