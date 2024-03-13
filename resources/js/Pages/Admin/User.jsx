import {
    Head,
    Link
} from '@inertiajs/react';
import SearchLink from '@/Components/SearchLink';
import { NavbarAdmin } from '@/Components/Navbar'
import LinkCard from '@/Components/LinkCard';
import { IconUserCircle, IconTrash, IconPencil, IconChevronsRight, IconChevronsLeft } from '@tabler/icons-react';
import React, { useRef, useState, useEffect } from 'react'
import Swal from 'sweetalert2';

export default function User({ auth, users, kategori }) {
    const contentRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUser] = useState(users);
    const [usersPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const MAX_PAGE_USERS = 3;
    const startPage = Math.max(1, currentPage - Math.floor(MAX_PAGE_USERS / 2));
    const endPage = Math.min(Math.ceil(Object.entries(filteredUsers).length / usersPerPage), startPage + MAX_PAGE_USERS - 1);
    const pageNumbersToShow = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = Object.entries(filteredUsers).slice(indexOfFirstUser, indexOfLastUser);
    const pageNumber = [];

    const handleDeleteUser = (id) => {
        Swal.fire({
            title: 'Konfirmasi Hapus Pengguna ini',
            text: 'Menghapus pengguna berarti menjadikan file yang diunggah pengguna tersebut menjadi unknown, anda yakin?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#fff2df',
            cancelButtonColor: '#fe8e00',
            confirmButtonText: '<span style="color: #fe8e00;">Hapus</span>',
            reverseButtons: true,
            customClass: {
                confirmButton: 'custom-confirm-button-class',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = route('delete-user', { id: id });
            }
        });
    };

    const searchFilter = () => {
        if (searchQuery.trim() === '') {
            setFilteredUser(users);
        } else {
            const filtered = Object.values(users).filter((user) => {
                return ['username', 'role'].some((field) => {
                    const fieldValue = user[field];
                    return fieldValue && fieldValue.toLowerCase().includes(searchQuery.toLowerCase());
                });
            });
            setFilteredUser(filtered);
            setCurrentPage(1);
        }
    };

    useEffect(() => {
        searchFilter();
    }, [searchQuery, users]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    for (let i = 1; i <= Math.ceil(Object.entries(filteredUsers).length / usersPerPage); i++) {
        pageNumber.push(i);
    }

    const renderPageNumbers = pageNumbersToShow.map((number, index, array) => {
        const isEllipsisStart = index === 0 && number > 1;
        const isEllipsisEnd = index === array.length - 1 && number < Math.ceil(Object.entries(filteredUsers).length / usersPerPage);

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
            <Head title="Pengguna" />
            <div className='flex w-full'>
                <NavbarAdmin auth={auth} kategori={kategori} />
                <div className='flex flex-col justify-between w-4/5 px-5 py-10'>
                    <div>
                        <div className='flex items-center justify-between pb-4 mb-4 text-sm border-b border-i-yellow-500 h-fit '>
                            <div>
                                <p className='text-lg font-semibold'>Daftar Pengguna</p>
                                <p className='text-[12px]'>Kelola pengguna yang dapat mengakses sistem informasi <span className='font-semibold'>iFile</span>.</p>

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
                        <div className='flex items-center justify-between'>
                            <SearchLink
                                onChange={(e) => setSearchQuery(e.target.value)}
                                value={searchQuery}
                            />
                            <Link href={route('tambah-user')} className='px-4 py-2 text-sm text-white text-gray-600 rounded-md h-fit hover:text-gray-900 focus:bg-i-amber-500/60 bg-i-amber-500'>
                                +Tambah User
                            </Link>
                        </div>
                        <table className='w-full my-3 text-sm rounded-md table-auto text-wrap border-spacing-y-2'>
                            <thead className=''>
                                <tr className='border-b border-i-amber-500 bg-i-amber-100'>
                                    <th className='py-3 font-semibold'>Username</th>
                                    <th className='font-semibold'>Peran</th>
                                    <th className='font-semibold'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.values(currentUsers).map((user, index) => (
                                    <tr key={index} className={`text-left ${index % 2 === 0 ? 'bg-i-amber-50' : 'bg-white'}`}>
                                        <td className='px-2 font-medium border-b border-i-amber-500'>{user[1].username}</td>
                                        <td className='text-center border-b border-i-amber-500'>{user[1].role}</td>
                                        <td className='flex justify-center py-2 border-b border-i-amber-500'>
                                            <div className='flex items-center justify-center w-1/3 gap-2'>
                                                <a className='flex justify-center gap-2 p-1 text-white rounded-md w-fit bg-i-yellow-500'
                                                    href={route('edit-user', { id: user[1].id })} >
                                                    <IconPencil size={16} />
                                                </a>
                                                <a className='flex justify-center gap-2 p-1 text-white rounded-md cursor-pointer w-fit bg-i-orange-500'
                                                    onClick={() => handleDeleteUser(user[1].id)}>
                                                    <IconTrash size={16} />
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div class="flex justify-center gap-2 mt-4">
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
                            disabled={currentPage === Math.ceil(Object.entries(filteredUsers).length / usersPerPage)}
                            className={`px-4 py-2 text-sm text-white text-gray-600 rounded-md hover:text-gray-900 ${currentPage === Math.ceil(Object.entries(filteredUsers).length / usersPerPage) ? 'cursor-default bg-i-amber-300 text-white' : 'bg-i-amber-500'}`}
                        >
                            <IconChevronsRight size={18} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
