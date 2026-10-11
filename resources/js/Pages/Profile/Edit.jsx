import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Profile
                    </h2>
                    <div className="flex gap-4">
                        <Link 
                            href={route('dashboard')} 
                            className="bg-white px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-pink-600 border border-gray-300 shadow-sm transition"
                        >
                            Kembali ke Halaman Pembeli
                        </Link>
                        {user.role === 'admin' && (
                            <Link 
                                href={route('admin.dashboard')} 
                                className="bg-pink-500 px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-pink-600 shadow-sm transition"
                            >
                                Kembali ke Panel Penjual
                            </Link>
                        )}
                    </div>
                </div>
            }
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
