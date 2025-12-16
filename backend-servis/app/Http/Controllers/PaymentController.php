<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreatePaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Models\Notification;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function show(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $order = Order::findOrFail($id);

        // Check authorization
        if ($user->isCustomer() && $order->customer_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        if ($user->isTechnician() && $order->technician_id !== $user->technician?->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $payment = $order->payment;

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new PaymentResource($payment),
        ]);
    }

    public function store(CreatePaymentRequest $request, int $id): JsonResponse
    {
        $user = $request->user();
        $order = Order::findOrFail($id);

        // Check authorization - technician or admin can create payment
        if (!$user->isTechnician() && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        if ($user->isTechnician() && $order->technician_id !== $user->technician?->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        // Check if payment already exists
        if ($order->payment) {
            return response()->json([
                'success' => false,
                'message' => 'Payment already exists for this order',
            ], 400);
        }

        $payment = Payment::create([
            'order_id' => $id,
            // Jika amount tidak diisi atau 0, gunakan harga yang disepakati dari order sebagai default
            'amount' => ($request->amount !== null && $request->amount > 0)
                ? $request->amount
                : ($order->agreed_price ?? 0),
            'method' => $request->method,
            'status' => $request->status,
            'transaction_ref' => $request->transaction_ref,
            'paid_at' => $request->status === 'PAID' ? now() : null,
        ]);

        // Create notification for customer
        Notification::create([
            'user_id' => $order->customer_id,
            'title' => 'Pembayaran',
            'body' => "Pembayaran untuk order Anda telah dicatat",
            'type' => 'PAYMENT',
            'related_id' => (string) $order->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Payment created successfully',
            'data' => new PaymentResource($payment),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        // Di route, {id} merepresentasikan order_id, jadi cari payment berdasarkan order_id
        $payment = Payment::where('order_id', $id)->firstOrFail();
        $order = $payment->order;

        // CUSTOMER: boleh mengubah metode & transaction_ref untuk order miliknya sendiri,
        // namun tidak boleh mengubah amount maupun status pembayaran.
        if ($user->isCustomer()) {
            if ($order->customer_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized',
                ], 403);
            }

            $validated = $request->validate([
                'method' => 'sometimes|in:CASH,TRANSFER,EWALLET,OTHER',
                'transaction_ref' => 'sometimes|nullable|string|max:255',
            ]);

            // Pastikan customer tidak bisa memaksa mengganti amount atau status
            unset($validated['amount'], $validated['status']);

            $payment->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Payment updated successfully',
                'data' => new PaymentResource($payment->fresh()),
            ]);
        }

        // TEKNISI / ADMIN: dapat mengubah amount, method, status, dan transaction_ref
        if (!$user->isTechnician() && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $validated = $request->validate([
            'amount' => 'sometimes|numeric|min:0',
            'method' => 'sometimes|in:CASH,TRANSFER,EWALLET,OTHER',
            'status' => 'sometimes|in:UNPAID,PAID,FAILED,REFUNDED',
            'transaction_ref' => 'sometimes|nullable|string|max:255',
        ]);

        // Jika amount tidak dikirim atau 0 saat update oleh teknisi/admin,
        // gunakan harga yang disepakati dari order sebagai default.
        if (!isset($validated['amount']) || $validated['amount'] == 0) {
            $validated['amount'] = $order->agreed_price ?? $payment->amount ?? 0;
        }

        if (isset($validated['status']) && $validated['status'] === 'PAID' && !$payment->paid_at) {
            $validated['paid_at'] = now();
        }

        $payment->update($validated);

        // Create notification if status changed to PAID
        if (isset($validated['status']) && $validated['status'] === 'PAID') {
            Notification::create([
                'user_id' => $order->customer_id,
                'title' => 'Pembayaran Dikonfirmasi',
                'body' => "Pembayaran Anda telah dikonfirmasi",
                'type' => 'PAYMENT',
                'related_id' => (string) $order->id,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Payment updated successfully',
            'data' => new PaymentResource($payment->fresh()),
        ]);
    }
}

