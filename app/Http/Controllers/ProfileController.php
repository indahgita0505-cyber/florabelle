<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Order;
use App\Models\UserAddress;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        $totalOrders = Order::where('user_id', $user->id)->count();
        $processingOrders = Order::where('user_id', $user->id)->whereIn('status', ['pending', 'processing'])->count();
        $completedOrders = Order::where('user_id', $user->id)->whereIn('status', ['completed', 'delivered'])->count();

        $primaryAddress = UserAddress::where('user_id', $user->id)->where('is_primary', true)->first()
            ?? UserAddress::where('user_id', $user->id)->latest()->first();

        if (! $primaryAddress) {
            $latestOrderAddress = Order::where('user_id', $user->id)->whereNotNull('customer_address')->latest()->value('customer_address');
            $primaryAddress = (object) [
                'id' => null,
                'label' => 'Alamat Utama',
                'recipient_name' => $user->name,
                'phone_number' => $user->whatsapp_number ?: '0823 4567 8910',
                'full_address' => $latestOrderAddress ?: 'Jl. Melati No. 12, Kel. Tatura, Kec. Mantikulore, Kota Palu, Sulawesi Tengah 94118',
                'is_primary' => true,
            ];
        }

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'stats' => [
                'total_orders' => $totalOrders,
                'processing_orders' => $processingOrders,
                'completed_orders' => $completedOrders,
            ],
            'primaryAddress' => $primaryAddress,
        ]);
    }

    /**
     * Update or create the user's primary delivery address.
     */
    public function updateAddress(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'full_address' => ['required', 'string'],
            'recipient_name' => ['nullable', 'string', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:30'],
            'label' => ['nullable', 'string', 'max:50'],
        ]);

        $user = $request->user();

        UserAddress::updateOrCreate(
            ['user_id' => $user->id, 'is_primary' => true],
            [
                'recipient_name' => ! empty($validated['recipient_name']) ? $validated['recipient_name'] : $user->name,
                'phone_number' => ! empty($validated['phone_number']) ? $validated['phone_number'] : ($user->whatsapp_number ?: '0823 4567 8910'),
                'full_address' => $validated['full_address'],
                'label' => ! empty($validated['label']) ? $validated['label'] : 'Alamat Utama',
            ]
        );

        return Redirect::route('profile.edit')->with('status', 'address-updated');
    }

    /**
     * Upload and update user's profile avatar.
     */
    public function updateAvatar(Request $request): RedirectResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpeg,png,jpg,webp,gif', 'max:5120'],
        ]);

        $user = $request->user();

        if ($request->hasFile('avatar')) {
            if ($user->avatar && str_starts_with($user->avatar, '/storage/avatars/')) {
                $oldPath = str_replace('/storage/', '', $user->avatar);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('avatar')->store('avatars', 'public');
            $user->update(['avatar' => '/storage/'.$path]);
        }

        return Redirect::route('profile.edit')->with('status', 'avatar-updated');
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
