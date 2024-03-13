import { Head, useForm, Link } from "@inertiajs/react"
import { Navbar, NavbarAdmin } from "@/Components/Navbar"
import React, { useRef, useState, useEffect } from 'react'
import { IconUserCircle, IconArrowLeft, IconChevronsRight, IconChevronsLeft } from '@tabler/icons-react';
import SearchLink from "@/Components/SearchLink";

export default function ShowDetail({ auth, kategori, mahasiswa, angkatan }) {
    const { post } = useForm();
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedStatusChange, setselectedStatusChange] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [mahasiswaPerPage, setMahasiswaPerPage] = useState(10);
    const [filteredMahasiswa, setfilteredMahasiswa] = useState(mahasiswa);
    const MAX_PAGE_LINKS = 3;
    const startPage = Math.max(1, currentPage - Math.floor(MAX_PAGE_LINKS / 2));
    const endPage = Math.min(Math.ceil(filteredMahasiswa.length / mahasiswaPerPage), startPage + MAX_PAGE_LINKS - 1);
    const pageNumbersToShow = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    const indextOfLastMahasiswa = currentPage * mahasiswaPerPage;
    const indexOfFirstMahasiswa = indextOfLastMahasiswa - mahasiswaPerPage;
    const currentMahasiswa = filteredMahasiswa.slice(indexOfFirstMahasiswa, indextOfLastMahasiswa);
    const pageNumbers = [];

    useEffect(() => {
        let filtered = mahasiswa;

        if (searchQuery.trim() !== '') {
            filtered = filtered.filter((mahasiswa) =>
                ['nama', 'nim'].some((field) =>
                    String(mahasiswa[field]).toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }

        if (selectedStatus !== '') {
            filtered = filtered.filter((mahasiswa) => mahasiswa.status && mahasiswa.status === selectedStatus);
            console.log(selectedStatus)
            console.log(mahasiswa.status)
        }

        setfilteredMahasiswa(filtered);
        setCurrentPage(1);
    }, [searchQuery, selectedStatus, mahasiswa]);


    useEffect(() => {
        if (mahasiswa) {
            const initialStatusValues = {};
            mahasiswa.forEach((m) => {
                initialStatusValues[m.nim] = m.status || '';
            });
            setselectedStatusChange(initialStatusValues);
        }
    }, [mahasiswa]);

    const handleStatusChange = async (nim, updatedStatus) => {
        try {
            return post(route('update-status', { nim: nim, status: updatedStatus }));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    for (let i = 1; i <= Math.ceil(filteredMahasiswa.length / mahasiswaPerPage); i++) {
        pageNumbers.push(i);
    }

    const handlePaging = (e) => {
        setMahasiswaPerPage(e.target.value);
        setCurrentPage(1);
    };

    const renderPageNumbers = pageNumbersToShow.map((number, index, array) => {
        const isEllipsisStart = index === 0 && number > 1;
        const isEllipsisEnd = index === array.length - 1 && number < Math.ceil(filteredMahasiswa.length / mahasiswaPerPage);

        return (
            <React.Fragment key={number}>
                {isEllipsisStart && <li className="px-3 py-2 mx-1 text-sm border rounded-md border-i-amber-500 text-i-amber-500">...</li>}
                <li
                    className={`px-3 py-2 mx-1 text-sm rounded-md cursor-pointer border border-i-amber-500 hover:bg-i-amber-600 focus:bg-i-amber-600 text-i-amber-500 ${number === currentPage ? ' bg-i-amber-500 text-white' : ''}`}
                    onClick={() => paginate(number)}
                >
                    {number}
                </li>
                {isEllipsisEnd && <li className="px-3 py-2 mx-1 text-sm border rounded-md border-i-amber-500 text-i-amber-500">...</li>}
            </React.Fragment>
        );
    });



    return (
        <>
            <Head title={`Detail Mahasiswa ${angkatan}`}></Head>
            <div className="flex w-full">
                {auth && auth.user && auth.user.role === 'admin' ? (
                    <NavbarAdmin auth={auth} kategori={kategori} />
                ) : (
                    <Navbar auth={auth} kategori={kategori} />
                )}

                <div className='flex flex-col justify-between w-4/5 px-5 py-10'>
                    <div>
                        <div className='flex items-center justify-between pb-4 mb-4 text-sm border-b border-i-yellow-500 h-fit '>
                            <div className="flex gap-2">
                                <Link href={route('home')} ><IconArrowLeft /> </Link>
                                <div className="">
                                    <p className='text-lg font-semibold'>Detail Mahasiswa Angkatan {angkatan}</p>
                                    <p className='text-[12px]'>Informasi detail terkait mahasiswa berdasarkan statusnya.</p>
                                </div>
                            </div>
                            <div className='flex gap-2'>
                                <Link href={route('profile.edit')} className='flex items-center gap-2 px-4 py-2 border rounded-md border-i-yellow-500 bg-i-amber-50 hover:text-i-amber-500'>
                                    <IconUserCircle size={20} strokeWidth={1.5} className='' />
                                    <p className='text-sm'>{auth.user.username}</p>
                                </Link>
                                <Link method='post' href={
                                    route('logout')
                                }
                                    className="w-full px-4 py-2 text-center text-white text-gray-600 rounded-md hover:text-gray-900 bg-i-amber-500" >
                                    Log Out
                                </Link>
                            </div>
                        </div>
                        <div className='flex items-center justify-between gap-4'>
                            <div className='flex gap-4'>
                                <SearchLink
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    value={searchQuery}
                                />
                                <select
                                    name="kategori"
                                    id="kategori"
                                    className='block text-sm w-[250px] mt-1 rounded-md border-i-amber-500 h-fit focus:border-i-amber-500 focus:ring-i-amber-500'
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    <option value="">Pilih Status</option>
                                    <option value="Aktif">Aktif</option>
                                    <option value="Tidak Aktif">Tidak Aktif</option>
                                    <option value="Lulus">Lulus</option>
                                    <option value="Cuti">Cuti</option>
                                </select>
                            </div>
                            <Link href={route('tambah-file')} className='px-4 py-2 text-sm text-white text-gray-600 rounded-md h-fit hover:text-gray-900 focus:bg-i-amber-500/60 bg-i-amber-500'>
                                +Tambah File
                            </Link>
                        </div>
                        <table className="w-full my-3 text-sm table-fixed">
                            <thead>
                                <tr className="bg-i-amber-100 ">
                                    <th className="p-2 font-semibold">NIM</th>
                                    <th className="font-semibold">Nama</th>
                                    <th className="font-semibold">Jenis Kelamin</th>
                                    <th className="font-semibold">Agama</th>
                                    <th className="font-semibold">Jalur Masuk</th>
                                    <th className="p-2 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentMahasiswa && currentMahasiswa.map((m, index) => (
                                    <tr key={index} className={`text-left ${index % 2 === 0 ? 'bg-i-amber-50' : 'bg-white'}`}>
                                        <td className="py-1 pl-2 border-b border-i-amber-500">{m.nim}</td>
                                        <td className="border-b border-i-amber-500">{m.nama}</td>
                                        <td className="border-b border-i-amber-500">{m.jenis_kelamin}</td>
                                        <td className="border-b border-i-amber-500">{m.agama}</td>
                                        <td className="border-b border-i-amber-500">{m.jalur_masuk}</td>
                                        {auth && auth.user && auth.user.role === 'admin' ? (

                                            <td className="py-1 pr-2 text-center border-b border-i-amber-500">
                                                <select
                                                    value={selectedStatusChange[m.nim] || ''}
                                                    onChange={(event) => {
                                                        handleStatusChange(m.nim, event.target.value);
                                                    }}
                                                    onBlur={(event) => handleStatusChange(m.nim, event.target.value)}
                                                    className={` focus:border-i-amber-500 focus:ring-i-amber-500 rounded-md text-sm border-i-amber-500 ${index % 2 === 0 ? 'bg-i-amber-50' : 'bg-white'}`}
                                                >
                                                    <option value="" disabled>Pilih Status</option>
                                                    <option value="Aktif">Aktif</option>
                                                    <option value="Tidak Aktif">Tidak Aktif</option>
                                                    <option value="Lulus">Lulus</option>
                                                    <option value="Cuti">Cuti</option>
                                                </select>

                                            </td>
                                        ) : (
                                            <td className="py-3 border-b border-i-amber-500">{m.status}</td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <div class="flex justify-center gap-2">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1 || mahasiswaPerPage == Infinity}
                                className={`px-4 py-2 ml-3 text-sm text-white text-gray-600 rounded-md hover:text-gray-900  ${currentPage === 1 || mahasiswaPerPage == Infinity ? 'cursor-default bg-i-amber-300 text-white' : 'bg-i-amber-500'}`}
                            >
                                <IconChevronsLeft size={18} strokeWidth={1.5} />
                            </button>
                            <ul className='flex'>
                                {renderPageNumbers}
                            </ul>
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === Math.ceil(filteredMahasiswa.length / mahasiswaPerPage) || mahasiswaPerPage == Infinity}
                                className={`px-4 py-2 text-sm text-white text-gray-600 rounded-md hover:text-gray-900  ${currentPage === Math.ceil(filteredMahasiswa.length / mahasiswaPerPage) || mahasiswaPerPage == Infinity ? 'cursor-default bg-i-amber-300 text-white' : 'bg-i-amber-500'}`}
                            >
                                <IconChevronsRight size={18} strokeWidth={1.5} />
                            </button>
                        </div>
                        <div className='flex items-end gap-2 h-fit'>
                            <p className='text-[12px] text-gray-600'>Data per halaman</p>
                            <select
                                name="page"
                                id="page"
                                className='block mt-1 text-sm rounded-md w-fit border-i-amber-500 h-fit focus:border-i-amber-500 focus:ring-i-amber-500'
                                onChange={handlePaging}
                            >
                                <option value="10">10</option>
                                <option value="20">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                                <option value="Infinity">All</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
