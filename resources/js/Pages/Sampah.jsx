import React, { useRef, useState, useEffect } from 'react'
import { Head, Link } from "@inertiajs/react"
import { Navbar } from "@/Components/Navbar"
import LinkCard from "@/Components/LinkCard"
import { IconRotateClockwise, IconUserCircle, IconChevronsLeft, IconArrowUpRight, IconChevronsRight } from '@tabler/icons-react';
import SearchLink from "@/Components/SearchLink";
import Swal from 'sweetalert2';

export default function Sampah({ auth, files, kategori }) {
    const contentRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filesPerPage, setFilesPerPage] = useState(10);
    const [filteredFiles, setFilteredFiles] = useState(files);

    const MAX_PAGE_LINKS = 3;
    const startPage = Math.max(1, currentPage - Math.floor(MAX_PAGE_LINKS / 2));
    const endPage = Math.min(Math.ceil(filteredFiles.length / filesPerPage), startPage + MAX_PAGE_LINKS - 1);
    const pageNumbersToShow = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    const indexOfLastFile = currentPage * filesPerPage;
    const indexOfFirstFile = indexOfLastFile - filesPerPage;
    const currentFiles = filteredFiles.slice(indexOfFirstFile, indexOfLastFile);
    const pageNumber = [];

    useEffect(() => {
        let filtered = files;

        if (searchQuery.trim() !== '') {
            filtered = filtered.filter((file) =>
                ['nama_file', 'url', 'deskripsi'].some((field) =>
                    String(file[field]).toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }

        if (selectedCategory !== '') {
            filtered = filtered.filter((file) => file.kategori.id === Number(selectedCategory));
        }

        setFilteredFiles(filtered);
        setCurrentPage(1);
    }, [searchQuery, selectedCategory, files]);

    const truncateString = (url, maxLength = 24) => {
        if (url.length > maxLength) {
            return `${url.slice(0, maxLength)}...`;
        }
        return url;
    };

    const handleRestoreClick = (id) => {
        Swal.fire({
            title: 'Konfirmasi Pemulihan File',
            text: 'Anda yakin ingin memulihkan file ini?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#F8B9CF',
            confirmButtonColor: '#fe8e00',
            confirmButtonText: 'Pulihkan',
            cancelButtonText: '<span style="color: #fe8e00;">cancel</span>',
            reverseButtons: true,
            customClass: {
                confirmButton: 'custom-confirm-button-class',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = route('restore-file', { id: id });
            }
        });
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    for (let i = 1; i <= Math.ceil(filteredFiles.length / filesPerPage); i++) {
        pageNumber.push(i);
    }

    const handlePaging = (e) => {
        setFilesPerPage(e.target.value);
        setCurrentPage(1);
    };

    const renderPageNumbers = pageNumbersToShow.map((number, index, array) => {
        const isEllipsisStart = index === 0 && number > 1;
        const isEllipsisEnd = index === array.length - 1 && number < Math.ceil(filteredFiles.length / filesPerPage);

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
            <Head title="Sampah"></Head>
            <div className='flex w-full'>
                <Navbar auth={auth} kategori={kategori} />
                <div className='flex flex-col justify-between w-4/5 px-5 py-10'>
                    <div>
                        <div className='flex items-center justify-between pb-4 mb-4 text-sm border-b border-i-yellow-500 h-fit '>
                            <div>
                                <p className='text-lg font-semibold'>Sampah</p>
                                <p className='text-[12px]'>Pulihkan file-file yang sudah dihapus.</p>
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
                        <div className='flex items-center gap-4'>
                            <div className='flex items-end gap-2 h-fit'>
                                <select
                                    name="page"
                                    id="page"
                                    className='block mt-1 text-sm rounded-md w-fit border-i-amber-500 h-fit focus:border-i-amber-500 focus:ring-i-amber-500'
                                    onChange={handlePaging}
                                >
                                    <option value="10">10 Data</option>
                                    <option value="20">25 Data</option>
                                    <option value="50">50 Data</option>
                                    <option value="100">100 Data</option>
                                </select>
                            </div>
                            <SearchLink
                                onChange={(e) => setSearchQuery(e.target.value)}
                                value={searchQuery}
                            />
                            <select
                                name="kategori"
                                id="kategori"
                                className='block text-sm mt-1 w-[250px] rounded-md border-i-amber-500 h-fit focus:border-i-amber-500 focus:ring-i-amber-500'
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">Pilih Kategori</option>
                                {kategori && kategori.map((k) => (
                                    <option key={k.id} value={k.id}>{k.kategori}</option>
                                ))}
                            </select>
                        </div>
                        <table className='w-full my-3 text-sm rounded-md table-fixed text-wrap border-spacing-y-2'>
                            <thead className=''>
                                <tr className='border-b-[1px] border-i-amber-500 bg-i-amber-100'>
                                    <th className='w-1/3 font-semibold'>File</th>
                                    <th className='w-1/4 font-semibold'>Kategori</th>
                                    <th className='px-4 font-semibold'>Tanggal</th>
                                    <th className='font-semibold'>Waster</th>
                                    <th className='px-4 py-2 font-semibold'>Action</th>
                                </tr>
                            </thead>
                            {currentFiles && currentFiles.map((file, index) => (
                                <tbody>
                                    <tr key={index} className={`text-left ${index % 2 === 0 ? 'bg-i-amber-50' : 'bg-white'}`}>
                                        <td className='pl-2 text-start font-medium border-b-[1px] border-i-amber-500 cursor-default' title={`${file.nama_file}\n${file.deskripsi}`}>
                                            {truncateString(file.nama_file)}
                                        </td>
                                        <td className='border-b-[1px] border-i-amber-500'>{file.kategori ? truncateString(file.kategori.kategori) : 'Unknown'}</td>
                                        <td className='text-center border-b-[1px] border-i-amber-500'>{file.formattedDate}</td>
                                        <td className='px-4 text-center border-b-[1px] border-i-amber-500'>
                                            <p className=''>{file.waster.username}</p>
                                        </td>
                                        <td className='flex items-center justify-center gap-2 px-4 py-2 border-b-[1px] border-i-amber-500'>
                                            <a onClick={() => handleRestoreClick(file.id)} className={`cursor-pointer px-1 py-1 text-center text-white rounded-md hover:text-gray-900  bg-i-yellow-500`}>
                                                <IconRotateClockwise size={16} />
                                            </a>
                                        </td>
                                    </tr>

                                </tbody>

                            ))}
                        </table>
                    </div>
                    <div className='flex items-center justify-between mt-4'>
                        <div class="flex justify-center gap-2">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 ml-3 text-sm text-white text-gray-600 rounded-md hover:text-gray-900 ${currentPage === 1 ? 'cursor-default bg-i-amber-300 text-white' : 'bg-i-amber-500'}`}
                            >
                                <IconChevronsLeft size={18} strokeWidth={1.5} />
                            </button>
                            <ul className='flex'>
                                {renderPageNumbers}
                            </ul>
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === Math.ceil(filteredFiles.length / filesPerPage)}
                                className={`px-4 py-2 text-sm text-white text-gray-600 rounded-md hover:text-gray-900 ${currentPage === Math.ceil(filteredFiles.length / filesPerPage) ? 'cursor-default bg-i-amber-300 text-white' : 'bg-i-amber-500'}`}
                            >
                                <IconChevronsRight size={18} strokeWidth={1.5} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
