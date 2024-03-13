import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="flex flex-col items-center min-h-screen pt-6 bg-gray-100 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <ApplicationLogo className="w-16 h-16 text-gray-500 fill-current" />
                </Link>
            </div>

            <div className="w-full px-6 py-4 overflow-hidden bg-white shadow-i-amber-500/20 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
