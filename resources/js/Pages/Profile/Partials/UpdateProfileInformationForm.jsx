import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        username: user.username,
    });

    const submit = (e) => {
        e.preventDefault();
        console.log(data);

        patch(route('profile.update'));
    };

    return (
        <>
            <header>
                <p className="mt-1 text-gray-600 text-md">
                    Perbarui Informasi pribadi anda.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">

                <div>
                    <InputLabel htmlFor="username" value="Username" />

                    <TextInput
                        id="username"
                        className="block w-full mt-1 "
                        value={data.username}
                        onChange={(e) => setData('username', e.target.value)}
                        required
                        isFocused
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div className="flex items-center justify-center gap-4">
                    <PrimaryButton disabled={processing} className='px-12'>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </>
    );
}
