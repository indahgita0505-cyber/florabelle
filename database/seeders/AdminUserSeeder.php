<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Karena model User memiliki cast 'password' => 'hashed', 
        // kita CUKUP memasukkan string biasa dan Laravel akan meng-hash-nya secara otomatis.
        // Jika kita menggunakan Hash::make() di sini, maka password akan ter-hash dua kali!
        
        User::updateOrCreate(
            ['email' => 'admin@florabelle.id'], // Cari berdasarkan email ini
            [
                'name' => 'Admin Florabelle',
                'username' => 'admin',
                'password' => 'password', // Masukkan string murni, JANGAN gunakan Hash::make()
                'role' => 'admin',
            ]
        );

        $this->command->info('Akun Admin berhasil dibuat/diperbarui!');
        $this->command->info('Email: admin@florabelle.id');
        $this->command->info('Password: password');
    }
}
