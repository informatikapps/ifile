import {
    Head,
    useForm
} from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Navbar, NavbarAdmin } from '@/Components/Navbar'
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { IconPencil, IconArrowLeft } from '@tabler/icons-react';
import Swal from 'sweetalert2';
import { IconArrowUpRight } from '@tabler/icons-react';

export default function EditFile({ auth, file, kategori }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nama_file: file.nama_file,
        deskripsi: file.deskripsi,
        kategori: file.kategori,
        file: '',
        jenisFile: file.jenis_file,
        link: file.url,
    });

    const [preview, setPreview] = useState(file.url); // For old file preview
    const [newFilePreview, setNewFilePreview] = useState(null); // For new file preview

    useEffect(() => {
        if (data.file) {
            const objectUrl = URL.createObjectURL(data.file);
            setNewFilePreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setNewFilePreview(null);
        }
    }, [data.file]);


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

        post(route('edit-file.update', { id: file.id }), {
            onSuccess: () => {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "File berhasil diperbarui!",
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
                    text: "Ada masalah saat memperbarui file.",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        })
    };

    const getFileExtension = (fileName) => {
        if (!fileName) return '';
        const parts = fileName.split('.');
        return parts.length > 1 ? parts.pop().toLowerCase() : 'unknown';
    };

    const renderPreview = () => {
        const newFileExt = newFilePreview ? getFileExtension(data.file.name) : '';
        const oldFileExt = preview ? getFileExtension(preview) : '';

        return (
            <>
                {data.jenisFile === 'upload' && newFilePreview && (
                    <div className="mb-4">
                        <p className='mb-2 text-sm'>Preview File Baru:</p>
                        {['jpg', 'jpeg', 'png', 'gif'].includes(newFileExt) ? (
                            <img src={newFilePreview} alt="Preview Baru" className='w-full h-auto' />
                        ) : ['pdf'].includes(newFileExt) ? (
                            <iframe src={newFilePreview} className='w-full h-[500px]' />
                        ) : (
                            <p className='text-sm font-semibold'>Preview Tidak Tersedia</p>
                        )}
                    </div>
                )}

                {data.jenisFile === 'upload' && preview && (
                    <div>
                        <p className='mb-2 text-sm'>Preview File Lama:</p>
                        {['jpg', 'jpeg', 'png', 'gif'].includes(oldFileExt) ? (
                            <img src={preview} alt="Preview Lama" className='w-full h-auto' />
                        ) : ['pdf'].includes(oldFileExt) ? (
                            <iframe src={preview} className='w-full h-[500px]' />
                        ) : (
                            <p className='text-sm font-semibold'>Preview Tidak Tersedia</p>
                        )}
                    </div>
                )}

                {data.jenisFile === 'link' && (
                    <div className='flex flex-col items-center justify-center gap-2 text-center'>
                        <div>
                            <p className='text-sm font-semibold'>Preview Tidak Tersedia</p>
                            <p className='text-[#666666] text-[12px]'>Preview tidak tersedia untuk file jenis link.</p>
                        </div>
                        <a href={data.link} target='_blank' className='text-[12px] cursor-pointer rounded-md flex hover:text-i-amber-500 items-center' title={data.link}>
                            Atau buka tautannya disini <IconArrowUpRight size={18} strokeWidth={1.2} />
                        </a>
                    </div>
                )}
            </>
        );
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
                <div className="flex w-4/5 min-h-[80vh] gap-4 p-4 m-auto rounded-md shadow-md shadow-i-amber-500/20">
                    <div className='w-1/2'>
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
                                    <InputLabel className='text-i-amber-500' htmlFor="link" value="Link" />
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
                            <div className="flex self-center justify-center w-full gap-4 mt-4 text-sm">
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
                    <div className='flex flex-col items-center justify-center w-1/2 gap-2 p-4 rounded-md bg-i-amber-50'>
                        {renderPreview()}
                    </div>
                </div>
            </div>
        </div>
    </>
}
