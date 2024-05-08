import React, { useRef } from 'react'
import { Head, useForm } from "@inertiajs/react"
import { NavbarAdmin } from "@/Components/Navbar"
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { IconPencil, IconArrowLeft } from '@tabler/icons-react';

export default function AddUser({ auth, user, kategori }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: user.username,
        password: '',
        role: user.role,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if ((!data.username || !data.password || !data.role)) {
            Swal.fire({
                title: "Ada field kosong!",
                text: "Jangan lupa pilih isi kelengkapan datanya dulu ya!",
                icon: "question"
            });
            return;
        }

        const formData = new FormData();
        formData.append('username', data.username);
        formData.append('password', data.password);
        formData.append('role', data.role);
        console.log(data);

        post(route('edit-user.update', user.id), formData);
    };

    return (
        <>
            <Head title="Tambah Pengguna"></Head>
            <div class="flex w-full">
                <NavbarAdmin auth={auth} kategori={kategori} />
                <div className="w-4/5 p-10">
                    <div className="w-1/2 p-4 m-auto rounded-md shadow-md shadow-i-amber-500/20">
                        <p className='text-lg font-bold text-center text-i-amber-500'>Edit Pengguna</p>
                        <form action="" method='post' className='flex flex-col justify-center'>
                            <div>
                                <InputLabel className='text-i-amber-500' htmlFor="username" value="Username" />

                                <TextInput
                                    id="username"
                                    type="text"
                                    name="username"
                                    value={data.username}
                                    className="block w-full mt-1"
                                    autoComplete="current-username"
                                    isFocused={true}
                                    placeholder='Username'
                                    onChange={(e) => setData('username', e.target.value)}
                                />

                                <InputError message={errors.username} className="mt-2 text-[#ff0000]" />
                            </div>

                            <div className="mt-4">
                                <InputLabel className='text-i-amber-500' htmlFor="password" value="password" />

                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="block w-full mt-1"
                                    autoComplete="current-password"
                                    placeholder='password'
                                    onChange={(e) => setData('password', e.target.value)}
                                />

                                <InputError message={errors.password} className="mt-2 text-[#ff0000]" />
                            </div>
                            <div className="mt-4">
                                <InputLabel className='text-i-amber-500' htmlFor="role" value="role" />
                                <select
                                    name="role"
                                    id="role"
                                    className='block w-full mt-1 rounded-md border-i-amber-500 focus:border-i-amber-500 focus:ring-i-amber-500'
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                >
                                    <option value="pegawai">Pegawai</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex self-center justify-center w-11/12 gap-4 mt-4 text-sm ">
                                <button type="button" className="flex items-center justify-center w-full gap-2 py-2 text-white text-gray-600 rounded-md px-7 h-fit hover:text-gray-900 focus:bg-i-orange-500/60 bg-i-orange-500"
                                    onClick={() => window.history.back()}>
                                    <IconArrowLeft size={20} />
                                    Batal
                                </button>
                                <button type="submit" className="flex items-center w-full gap-2 py-2 text-white text-gray-600 rounded-md px-7 h-fit hover:text-gray-900 focus:bg-i-amber-500/60 bg-i-amber-500"
                                    onClick={handleSubmit}>
                                    <IconPencil size={20} />
                                    Edit Pengguna
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
