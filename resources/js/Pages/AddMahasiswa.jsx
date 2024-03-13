import { Head, Link, useForm } from '@inertiajs/react';
import { Navbar, NavbarAdmin } from '@/Components/Navbar';
import { useEffect, useState } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { IconDownload, IconArrowLeft } from '@tabler/icons-react';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

export default function AddMahasiswa({ auth, kategori }) {
    const [addType, setAddType] = useState('single');
    const [excelFile, setExcelFile] = useState(null);
    const [typeError, setTypeError] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        nama: '',
        nim: '',
        angkatan: '',
        jenis_kelamin: '',
        agama: '',
        jalur_masuk: '',
        status: '',
        batchFile: null,
    });

    const downloadTemplate = () => {
        const columns = [
            'nama',
            'nim',
            'angkatan',
            'jenis_kelamin',
            'agama',
            'jalur_masuk',
            'status',
        ];

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet([{}], { header: columns });

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

        XLSX.writeFile(workbook, 'template_mhs_iFile.xlsx');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data);

        if ((!data.nama || !data.nim || !data.angkatan || !data.jenis_kelamin || !data.agama || !data.jalur_masuk || !data.status)) {
            alert('Semua kolom harus diisi');
            return;
        }

        const formData = new FormData();
        formData.append('nama', data.nama);
        formData.append('nim', data.nim);
        formData.append('angkatan', data.angkatan);
        formData.append('jenis_kelamin', data.jenis_kelamin);
        formData.append('agama', data.agama);
        formData.append('jalur_masuk', data.jalur_masuk);
        formData.append('status', data.status);

        post(route('tambah-mahasiswa.store'), formData);
    }

    const handleFile = (e) => {
        let fileTypes = ['application/vnd.ms-excel', 'text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application / vnd.openxmlformats - officedocument.spreadsheetml.sheet']
        let selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile && fileTypes.includes(selectedFile.type)) {
                let reader = new FileReader();
                reader.readAsArrayBuffer(selectedFile);
                reader.onload = (e) => {
                    setExcelFile(e.target.result);
                }
            }
            else {

                setTypeError('Tolong pilih file dengan tipe excel.')
                setExcelFile(null);
            }
        } else {
            setExcelFile(null);
            console.log('Tolong pilih file excel.')
        }
    }

    const handleFileSubmit = async (e) => {
        e.preventDefault();

        if (excelFile !== null) {
            try {
                const workbook = XLSX.read(excelFile, { type: 'array' });
                const workSheetName = workbook.SheetNames[0];
                const workSheet = workbook.Sheets[workSheetName];
                const data = XLSX.utils.sheet_to_json(workSheet);
                const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

                const response = await fetch(route('tambah-mahasiswa.batchStore'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                    },
                    body: JSON.stringify({ data }),

                });
                console.log(data)
                console.log(response)

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil',
                        text: 'Data berhasil ditambahkan!',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Waduh!',
                        text: 'Data Gagal Diperbarui.',
                    })
                }
            } catch (error) {
                console.error('catch Error:', error);
                console.log('catch Full response:', error.response);
            }
        }
    };

    return (
        <>
            <Head title="Tambah Mahasiswa"></Head>
            <div class="w-full flex">
                {auth && auth.user && auth.user.role === 'admin' ? (
                    <NavbarAdmin auth={auth} kategori={kategori} />
                ) : (
                    <Navbar auth={auth} kategori={kategori} />
                )}
                <div className='flex-col w-4/5 pt-10'>
                    <p className='text-lg font-bold text-center text-i-amber-500'>Tambah Data Mahasiswa</p>
                    <div className="w-1/2 p-4 m-auto rounded-md shadow-md shadow-i-amber-500/20">
                        <div className='flex justify-between mb-3 overflow-hidden text-sm text-center border rounded-md border-i-amber-500'>
                            <label className={`py-2 w-1/2 cursor-pointer ${addType === 'single' ? 'bg-i-amber-500 text-white' : 'bg-i-amber-50 text-i-amber-500 '}`}>
                                <input
                                    type="radio"
                                    value="single"
                                    checked={addType === 'single'}
                                    onChange={() => setAddType('single')}
                                    className="hidden"
                                />
                                Tambah Satuan
                            </label>
                            <label className={`py-2 w-1/2 cursor-pointer ${addType === 'batch' ? 'bg-i-amber-500 text-white' : 'bg-i-amber-50 text-i-amber-500 '}`}>
                                <input
                                    type="radio"
                                    value="batch"
                                    checked={addType === 'batch'}
                                    onChange={() => setAddType('batch')}
                                    className="hidden"
                                />
                                Tambah Batch
                            </label>
                        </div>

                        {addType === 'single' && (
                            <form action="" method='post' className='flex flex-col justify-center'>
                                <div className=''>
                                    <InputLabel className='text-i-amber-500' htmlFor="nama" value="Nama" />

                                    <TextInput
                                        id="nama"
                                        type="text"
                                        name="nama"
                                        value={data.nama}
                                        className="block w-full mt-1"
                                        autoComplete="current-nama"
                                        isFocused={true}
                                        placeholder='Nama'
                                        onChange={(e) => setData('nama', e.target.value)}
                                    />

                                    <InputError message={errors.nama} className="mt-2 text-[#ff0000]" />
                                </div>
                                <div class="flex mt-4 gap-4 w-full items-center">

                                    <div className='w-full'>
                                        <InputLabel className='text-i-amber-500' htmlFor="nim" value="NIM" />

                                        <TextInput
                                            id="nim"
                                            type="text"
                                            name="nim"
                                            value={data.nim}
                                            className="w-full "
                                            autoComplete="current-nim"
                                            placeholder='NIM'
                                            onChange={(e) => setData('nim', e.target.value)}
                                        />

                                        <InputError message={errors.nim} className="mt-2 text-[#ff0000]" />
                                    </div>
                                    <div className='w-full'>
                                        <InputLabel className='text-i-amber-500' htmlFor="angkatan" value="Angkatan" />

                                        <TextInput
                                            id="angkatan"
                                            type="number"
                                            name="angkatan"
                                            value={data.angkatan}
                                            className="w-full "
                                            autoComplete="current-angkatan"
                                            placeholder='Angkatan'
                                            onChange={(e) => setData('angkatan', e.target.value)}
                                        />

                                        <InputError message={errors.angkatan} className="mt-2 text-[#ff0000]" />
                                    </div>
                                </div>
                                <div className='flex w-full gap-4'>
                                    <div className="w-full mt-4">
                                        <InputLabel className='text-i-amber-500' htmlFor="jenis_kelamin" value="Jenis Kelamin" />
                                        <select
                                            name="jenis_kelamin"
                                            id="jenis_kelamin"
                                            className='block w-full mt-1 text-sm rounded-md focus:border-i-amber-500 focus:ring-i-amber-500 border-i-amber-500'
                                            onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                        >
                                            <option value="">Pilih Jenis Kelamin</option>
                                            <option value="Laki-laki">Laki-laki</option>
                                            <option value="Perempuan">Perempuan</option>
                                        </select>
                                    </div>
                                    <div className="w-full mt-4">
                                        <InputLabel className='text-i-amber-500' htmlFor="Agama" value="Agama" />
                                        <select
                                            name="Agama"
                                            id="Agama"
                                            className='block w-full mt-1 text-sm rounded-md focus:border-i-amber-500 focus:ring-i-amber-500 border-i-amber-500'
                                            onChange={(e) => setData('agama', e.target.value)}
                                        >
                                            <option value="">Pilih Agama</option>
                                            <option value="Islam">Islam</option>
                                            <option value="Kristen">Kristen</option>
                                            <option value="Katolik">Katolik</option>
                                            <option value="Hindu">Hindu</option>
                                            <option value="Buddha">Buddha</option>
                                            <option value="Khonghucu">Khonghucu</option>
                                        </select>
                                    </div>
                                </div>
                                <div className='flex w-full gap-4'>

                                    <div className="w-full mt-4">
                                        <InputLabel className='text-i-amber-500' htmlFor="jalur_masuk" value="Jalur Masuk" />
                                        <select
                                            name="jalur_masuk"
                                            id="jalur_masuk"
                                            className='block w-full mt-1 text-sm rounded-md focus:border-i-amber-500 focus:ring-i-amber-500 border-i-amber-500'
                                            onChange={(e) => setData('jalur_masuk', e.target.value)}
                                        >
                                            <option value="">Pilih Jalur Masuk</option>
                                            <option value="SNBP">SNBP</option>
                                            <option value="SNBT">SNBT</option>
                                            <option value="Mandiri">Mandiri</option>
                                            <option value="Lainnya">Lainnya</option>
                                        </select>
                                    </div>
                                    <div className="w-full mt-4">
                                        <InputLabel className='text-i-amber-500' htmlFor="status" value="Status" />
                                        <select
                                            name="status"
                                            id="status"
                                            className='block w-full mt-1 text-sm rounded-md focus:border-i-amber-500 focus:ring-i-amber-500 border-i-amber-500'
                                            onChange={(e) => setData('status', e.target.value)}
                                        >
                                            <option value="">Pilih Status</option>
                                            <option value="Aktif">Aktif</option>
                                            <option value="Tidak Aktif">Tidak Aktif</option>
                                            <option value="Lulus">Lulus</option>
                                            <option value="Cuti">Cuti</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex self-center justify-center w-4/5 gap-4 mt-4 text-sm ">
                                    <button type="button" className="flex justify-center w-full gap-2 py-2 text-white text-gray-600 rounded-md px-7 h-fit hover:text-gray-900 focus:bg-i-orange-500/60 bg-i-orange-500"
                                        onClick={() => window.history.back()}>
                                        <IconArrowLeft size={20} />
                                        Batal
                                    </button>
                                    <button type="submit" className="w-full py-2 text-sm text-white text-gray-600 rounded-md px-7 h-fit hover:text-gray-900 focus:bg-i-amber-500/60 bg-i-amber-500"
                                        onClick={handleSubmit}>
                                        + Tambah Data
                                    </button>
                                </div>
                            </form>
                        )}

                        {addType === 'batch' && (
                            <form action="" method='post' className='flex flex-col justify-center'>
                                <div className='my-2'>
                                    <p className='font-semibold'>Contoh</p>
                                    <img src="/images/batch.png" alt='ifile' className="border-[1.5px] border-i-orange-500 rounded-md" />
                                </div>
                                <button
                                    type="button"
                                    className="flex justify-center w-4/5 gap-2 py-2 m-auto text-sm text-white rounded-md h-fit hover:bg-i-amber-300 bg-i-amber-500"
                                    onClick={downloadTemplate}
                                >
                                    <IconDownload size={18} />
                                    Download Template
                                </button>
                                <div className="mt-8 mb-4">
                                    <InputLabel className="text-i-amber-500" htmlFor="batchFile" value="Unggah File CSV" />
                                    <input
                                        type="file"
                                        id="batchFile"
                                        name="batchFile"
                                        onChange={handleFile}

                                        className="block w-full mt-1 rounded-md focus:border-i-amber-500 focus:ring-i-amber-500 border-i-amber-500"
                                    />
                                    <InputError message={errors.batchFile} className="mt-2 text-[#ff0000]" />
                                    {typeError && <InputError message={typeError} className="mt-2 text-[#ff0000]" />}
                                </div>
                                <div>

                                </div>
                                <div className="flex self-center justify-center w-4/5 gap-4 mt-4 text-sm ">
                                    <button type="button" className="flex justify-center w-full gap-2 py-2 text-white text-gray-600 rounded-md px-7 h-fit hover:text-gray-900 focus:bg-i-orange-500/60 bg-i-orange-500"
                                        onClick={() => window.history.back()}>
                                        <IconArrowLeft size={20} />
                                        Batal
                                    </button>
                                    <Link
                                        type="submit"
                                        className="w-full py-2 text-sm text-white text-gray-600 rounded-md px-7 h-fit hover:text-gray-900 focus:bg-i-amber-500/60 bg-i-amber-500"
                                        onClick={handleFileSubmit}
                                    >
                                        + Tambah Batch
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
