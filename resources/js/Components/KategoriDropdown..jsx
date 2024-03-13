import React from 'react'
import InputLabel from './InputLabel'

export default function KategoriDropdown({ kategori }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        kategori: '',
    });
    return <>
        <div className="mt-4">
            <InputLabel className='text-i-amber-500' htmlFor="kategori" value="Kategori" />
            <select
                name="kategori"
                id="kategori"
                className='w-full rounded-md block mt-1 border-i-amber-500'
                value={data.kategori}
                onChange={(e) => setData('kategori', e.target.value)}
            >
                <option value="">Pilih Kategori</option>
                {kategori && kategori.map((k) => (
                    <option key={k.id} value={k.id}>{k.kategori}</option>
                ))}
            </select>
        </div>
    </>
}