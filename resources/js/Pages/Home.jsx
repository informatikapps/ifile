import { Head, Link } from '@inertiajs/react';
import { Navbar } from '@/Components/Navbar';
import { useEffect, useState } from 'react';
import { IconArrowUpRight, IconUserCircle } from '@tabler/icons-react';

export default function Home({ auth, kategori, mahasiswaData }) {
    const [isLoading, setIsLoading] = useState(true);

    const generateTableData = () => {
        const tableData = {};

        mahasiswaData.forEach(mahasiswa => {
            const { angkatan, status } = mahasiswa;

            if (!tableData[angkatan]) {
                tableData[angkatan] = {
                    Aktif: 0,
                    Lulus: 0,
                    'Tidak Aktif': 0,
                    Cuti: 0,
                };
            }

            tableData[angkatan][status]++;
        });

        return tableData;
    };

    const tableData = generateTableData();

    useEffect(() => {
        setIsLoading(false);
    }, [mahasiswaData]);

    const statuses = ['Aktif', 'Lulus', 'Tidak Aktif', 'Cuti'];

    const calculateTotal = (status) => {
        return Object.values(tableData).reduce((sum, angkatan) => sum + angkatan[status], 0);
    };

    return (
        <>
            <Head title="Home" />
            <div className='flex w-full'>
                <Navbar auth={auth} kategori={kategori} />
                <div className='w-4/5 px-5 py-10'>
                    <div className='flex items-center justify-between pb-4 mb-4 text-sm border-b border-i-yellow-500 h-fit '>
                        <div>
                            <p className='text-lg font-semibold'>Beranda</p>
                            <p className='text-[12px]'>Beranda sistem informasi <span className='font-semibold'>iFile</span>.</p>
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
                    <p className='mt-5 text-lg font-semibold text-center'>Monitoring Status Mahasiswa</p>
                    <div className='w-full my-4'>
                        <table className="w-full text-sm text-center table-auto">
                            <thead>
                                <tr className='bg-i-amber-100'>
                                    <th className='py-3'>Angkatan</th>
                                    {statuses.map(status => (
                                        <th key={status}>{status}</th>
                                    ))}
                                    <th>Detail</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(tableData).map(([angkatan, statusCounts]) => (
                                    <tr key={angkatan} className={`text-center  ${angkatan % 2 === 0 ? 'bg-i-amber-50' : 'bg-white'}`}>
                                        <td className='py-2'>{angkatan}</td>
                                        {statuses.map(status => (
                                            <td key={status}>{statusCounts[status]}</td>
                                        ))}
                                        <td className='flex items-center justify-center py-1'>
                                            <a href={route('detail-angkatan', { angkatan: angkatan })} className='flex items-center justify-center px-2 py-1 transition-opacity duration-300 rounded-md text-md bg-i-amber-100/60 w-fit hover:text-white hover:bg-i-amber-300'>
                                                Detail
                                                <IconArrowUpRight size={18} strokeWidth={1.2} /></a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className='font-semibold bg-i-amber-100'>
                                    <td className='py-3 '>Total</td>
                                    {statuses.map(status => (
                                        <td key={status}>{calculateTotal(status)}</td>
                                    ))}
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
