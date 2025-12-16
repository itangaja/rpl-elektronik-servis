import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { paymentService } from '../services/paymentService'
import { orderService } from '../services/orderService'
import { formatCurrency, getStatusLabel } from '../utils/format'
import { useAuth } from '../contexts/AuthContext'

const Payment = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isCustomer, isTechnician, isAdmin } = useAuth()
  const [order, setOrder] = useState(null)
  const [payment, setPayment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('CASH')
  const [transactionRef, setTransactionRef] = useState('')

  useEffect(() => {
    loadPayment()
  }, [id])

  const loadPayment = async () => {
    setLoading(true)
    setError('')
    try {
      // Ambil detail order terlebih dahulu
      const orderRes = await orderService.getById(id)
      if (orderRes.data?.success) {
        setOrder(orderRes.data.data)
      }

      // Coba ambil payment jika sudah ada
      const payRes = await paymentService.getPayment(id)
      if (payRes.data?.success) {
        setPayment(payRes.data.data)
        if (payRes.data.data.method) {
          setSelectedMethod(payRes.data.data.method)
        }
        if (payRes.data.data.transaction_ref) {
          setTransactionRef(payRes.data.data.transaction_ref)
        }
      }
    } catch (err) {
      // Jika payment belum ada (404), biarkan user/teknisi membuat payment baru
      if (err.response?.status !== 404) {
        setError(err.response?.data?.message || 'Gagal memuat data pembayaran')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePayment = async () => {
    // Hanya teknisi atau admin yang boleh membuat tagihan pembayaran
    if (!isTechnician && !isAdmin) {
      setError('Hanya teknisi yang dapat membuat tagihan pembayaran.')
      return
    }

    setActionLoading(true)
    setError('')
    try {
      const payload = {
        // Gunakan harga yang disepakati jika tersedia, jika tidak 0 sebagai fallback
        amount: order?.agreed_price ?? 0,
        method: selectedMethod,
        status: 'UNPAID',
        transaction_ref: null,
      }

      const { data } = await paymentService.createPayment(id, payload)
      if (data.success) {
        setPayment(data.data)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat pembayaran')
    } finally {
      setActionLoading(false)
    }
  }

  const handleCustomerUpdate = async () => {
    if (!payment) return

    setActionLoading(true)
    setError('')
    try {
      const payload = {
        method: selectedMethod,
        transaction_ref: transactionRef || null,
      }

      const { data } = await paymentService.updatePayment(order.id, payload)
      if (data.success) {
        setPayment(data.data)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengirim data pembayaran')
    } finally {
      setActionLoading(false)
    }
  }

  const handleConfirmPaid = async () => {
    if (!payment) return

    setActionLoading(true)
    setError('')
    try {
      const payload = {
        // Jika amount di payment masih 0, gunakan harga yang disepakati dari order sebagai jumlah pembayaran
        amount: payment.amount && payment.amount > 0
          ? payment.amount
          : (order?.agreed_price ?? 0),
        status: 'PAID',
      }

      const { data } = await paymentService.updatePayment(order.id, payload)
      if (data.success) {
        setPayment(data.data)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengkonfirmasi pembayaran')
    } finally {
      setActionLoading(false)
    }
  }

  const handleBackToOrder = () => {
    navigate(`/orders/${id}`)
  }

  if (loading) {
    return <div className="text-center py-12">Memuat data pembayaran...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pembayaran Order #{id}</h1>
        <button
          onClick={handleBackToOrder}
          className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Kembali ke Detail Order
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        {order && (
          <div className="border-b pb-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">Rincian Order</h2>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Pelanggan:</span>{' '}
                {order.customer?.name}
              </p>
              <p>
                <span className="font-medium">Toko/Teknisi:</span>{' '}
                {order.technician?.shop_name || '-'}
              </p>
              <p>
                <span className="font-medium">Kategori:</span>{' '}
                {order.category}
              </p>
              {order.device_model && (
                <p>
                  <span className="font-medium">Perangkat:</span>{' '}
                  {order.device_model}
                </p>
              )}
              <p>
                <span className="font-medium">Deskripsi:</span>{' '}
                {order.problem_description}
              </p>
              {order.agreed_price && (
                <p>
                  <span className="font-medium">Harga Disepakati:</span>{' '}
                  {formatCurrency(order.agreed_price)}
                </p>
              )}
            </div>
          </div>
        )}

        {!payment ? (
          <>
            {isTechnician || isAdmin ? (
              <>
                <p className="text-gray-700 mb-4">
                  Belum ada data pembayaran untuk order ini. Pilih metode pembayaran dan buat tagihan.
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Metode Pembayaran
                  </label>
                  <select
                    className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md"
                    value={selectedMethod}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    disabled={actionLoading}
                  >
                    <option value="CASH">Cash</option>
                    <option value="TRANSFER">Transfer Bank</option>
                    <option value="EWALLET">E-Wallet</option>
                    <option value="OTHER">Lainnya</option>
                  </select>
                </div>
                <button
                  onClick={handleCreatePayment}
                  disabled={actionLoading}
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  {actionLoading ? 'Memproses...' : 'Buat Tagihan Pembayaran'}
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-700 mb-4">
                  Belum ada data pembayaran untuk order ini. Menunggu teknisi membuat tagihan pembayaran.
                </p>
              </>
            )}
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Detail Pembayaran</h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Status:</span>{' '}
                {getStatusLabel(payment.status)}
              </p>
              <p>
                <span className="font-medium">Jumlah:</span>{' '}
                {formatCurrency(payment.amount)}
              </p>
              {payment.method && (
                <p>
                  <span className="font-medium">Metode:</span> {payment.method}
                </p>
              )}
              {payment.paid_at && (
                <p>
                  <span className="font-medium">Dibayar pada:</span> {payment.paid_at}
                </p>
              )}
              {payment.transaction_ref && (
                <p>
                  <span className="font-medium">Referensi:</span> {payment.transaction_ref}
                </p>
              )}
            </div>

            {/* Form aksi customer: melengkapi data pembayaran */}
            {isCustomer && (
              <div className="mt-6 border-t pt-4 space-y-3">
                <h3 className="font-semibold text-sm">Konfirmasi Pembayaran</h3>
                <p className="text-xs text-gray-600">
                  Pilih metode pembayaran yang Anda gunakan dan isi nomor referensi/berita transfer jika ada,
                  lalu klik "Saya sudah bayar".
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Metode Pembayaran</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={selectedMethod}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                      disabled={actionLoading}
                    >
                      <option value="CASH">Cash</option>
                      <option value="TRANSFER">Transfer Bank</option>
                      <option value="EWALLET">E-Wallet</option>
                      <option value="OTHER">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">No. Referensi / Catatan</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      disabled={actionLoading}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCustomerUpdate}
                  disabled={actionLoading}
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  {actionLoading ? 'Mengirim...' : 'Saya sudah bayar'}
                </button>
              </div>
            )}

            {/* Aksi teknisi/admin: konfirmasi pembayaran */}
            {(isTechnician || isAdmin) && payment.status !== 'PAID' && (
              <div className="mt-6 border-t pt-4 space-y-3">
                <h3 className="font-semibold text-sm">Konfirmasi oleh Teknisi</h3>
                <p className="text-xs text-gray-600">
                  Periksa bukti pembayaran dari pelanggan. Jika sudah valid, klik tombol di bawah untuk menandai
                  pembayaran sebagai sudah dibayar.
                </p>
                <button
                  type="button"
                  onClick={handleConfirmPaid}
                  disabled={actionLoading}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {actionLoading ? 'Memproses...' : 'Konfirmasi Pembayaran'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Payment
