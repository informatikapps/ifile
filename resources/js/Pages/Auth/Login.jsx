import { useEffect, useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const [captchaNum, setCaptchaNum] = useState(0);
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const generateRandomNumber = () => {
        const randomNum1 = Math.floor(Math.random() * 20) + 1;
        const randomNum2 = Math.floor(Math.random() * 20) + 1;
        setNum1(randomNum1);
        setNum2(randomNum2);
    };

    useEffect(() => {
        generateRandomNumber();
    }, []);

    const [captchaCheck, setCaptchaCheck] = useState('');
    const [loginError, setLoginError] = useState('');

    const handleCaptchaCheck = (e) => {
        setCaptchaCheck(e.target.value);
    };

    const submit = async (e) => {
        e.preventDefault();
        const userAnswer = parseInt(captchaCheck, 10)
        if (userAnswer === num1 + num2) {
            setLoginError('');
            try {
                return await post(route('login'));
            } catch (error) {
                console.error('Post Request Error:', error);
            }
        } else {
            setLoginError('Captcha salah.');
            generateRandomNumber();
        }
    };



    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}
            <p className='mb-4 font-semibold text-center text-md'>Selamat Datang di Sistem Informasi iFile!</p>
            <form onSubmit={submit}>
                <div>
                    <InputLabel className='text-i-amber-500' htmlFor="username" value="Username" />

                    <TextInput
                        id="username"
                        type="text"
                        name="username"
                        value={data.username}
                        className="block w-full mt-1"
                        autoComplete="username"
                        isFocused={true}
                        placeholder='Username'
                        onChange={(e) => setData('username', e.target.value)}
                    />

                    <InputError message={errors.username} className="mt-2 text-[#ff0000]" />
                </div>

                <div className="mt-4">
                    <InputLabel className='text-i-amber-500' htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block w-full mt-1"
                        autoComplete="current-password"
                        placeholder="****"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2 text-[#ff0000]" />
                </div>
                <div className="mt-4 ">
                    <InputLabel className='text-i-amber-500' htmlFor="captcha" value="Captcha" />
                    <div className='flex items-center gap-4'>
                        <TextInput
                            id="captchaNum"
                            type="number"
                            disabled
                            name="num1"
                            value={num1}
                            className="block w-1/3 mt-1 text-center bg-i-amber-50"
                            autoComplete=""
                        />
                        <p>+</p>
                        <TextInput
                            id="captchaNum"
                            type="number"
                            disabled
                            name="num2"
                            value={num2}
                            className="block w-1/3 mt-1 text-center bg-i-amber-50"
                            autoComplete=""
                        />
                        <p>=</p>
                        <TextInput
                            id="captchaCheck"
                            type="number"
                            name="captchaCheck"
                            value={captchaCheck}
                            className="block w-1/3 mt-1"
                            autoComplete=""
                            onChange={handleCaptchaCheck}
                        />
                    </div>
                </div>
                <div className="mt-2 text-sm text-[#ff0000]">{loginError}</div>

                <div className="block mt-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                </div>

                <div className="flex flex-col items-center justify-end mt-4">

                    <PrimaryButton className="w-full mb-4" disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
