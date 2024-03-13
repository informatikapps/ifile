import React, { useRef } from 'react'
import { IconUserCircle, IconCalendarPlus } from '@tabler/icons-react';
import { Link } from '@inertiajs/react';


export default function LinkCard({ icons, file, id }) {
    const contentRef = useRef(null);

    const handleCopyClick = () => {
        const range = document.createRange();
        range.selectNode(contentRef.current);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
    };

    return (

        <>
            <div className='w-full overflow-hidden shadow-md shadow-i-amber-500/20 rounded-xl'>
                <div className=' flex justify-between px-4 text-[12px] text-i-amber-500 relative top-4'>
                    <p className='flex items-center gap-1'><IconUserCircle size={16} strokeWidth={1.2} ></IconUserCircle>
                        {file.userRole === 'uploader' ? (file.uploader ? file.uploader.name : 'Unknown Uploader') : file.waster.name}
                    </p>
                    <p className='flex items-center gap-1'><IconCalendarPlus size={16} strokeWidth={1.2} ></IconCalendarPlus> {file.formattedDate}</p>
                </div>

                <div className='bg-i-amber-100 w-[70px] h-[70px] rounded-full m-auto z-10 relative top-[35px]'>

                </div>
                <div className='flex flex-col items-center h-4/5 p-5 pt-10 text-sm bg-i-amber-50 z-[-1] '>
                    <p className='px-4 py-2 text-[12px] bg-white rounded-full text-i-amber-500 '>{file.kategori.kategori}</p>
                    <div className='py-3'>
                        <p className='py-1 font-semibold text-center'>{file.nama_file}</p>
                        <p className='py-1 text-[12px] text-center'>{file.deskripsi}</p>

                    </div>
                    <div className='flex w-full gap-2' ref={contentRef}>

                        <Link className="w-full px-4 py-2 text-center text-white text-gray-600 truncate rounded-md hover:text-gray-900 focus:bg-i-amber-500/60 bg-i-amber-500"
                            onClick={handleCopyClick}>
                            {file.url}
                        </Link>
                        {icons.map((icon, index) => (
                            <a key={index} className={`px-2 py-2 text-center text-white rounded-md hover:text-gray-900  bg-${icon.color}`}
                                href={icon.route ? route(icon.route, { id: file.id }) : ''}
                                onClick={icon.action}
                            >
                                {icon.component}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
