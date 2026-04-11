import React, { useEffect, useState } from 'react';
import { ordersAPI } from '../api/endpoints';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { SkeletonGrid } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { toast } from '../utils/toast';

export function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, orderId: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAll();
      const ordersList = response.data.data.orders || [];
      setOrders(ordersList);
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Failed to fetch orders';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (orderId) => {
    setDeleteModal({ isOpen: true, orderId });
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await ordersAPI.delete(deleteModal.orderId);
      toast.success('Order deleted successfully');
      setOrders(prev => prev.filter(o => o._id !== deleteModal.orderId));
      setDeleteModal({ isOpen: false, orderId: null });
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Failed to delete order';
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <SkeletonGrid />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Orders</h1>
        <p className="text-slate-600 mt-2">Track and manage your orders</p>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No orders yet"
          description="Start shopping to create your first order"
        />
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <OrderCard
              key={order._id}
              order={order}
              onDelete={() => handleDeleteClick(order._id)}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={deleteModal.isOpen}
        title="Delete Order"
        onClose={() => setDeleteModal({ isOpen: false, orderId: null })}
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
        isDangerous
        isLoading={deleting}
      >
        <p className="text-slate-600">
          Are you sure you want to delete this order? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

function OrderCard({ order, onDelete }) {
  const product = order.product || {};
  const price = Number(product.price) || 0;
  const quantity = Number(order.quantity) || 0;
  
  return (
    <div className="card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div className="flex-1 space-y-2">
        <h3 className="font-semibold text-slate-900">
          {product?.name || 'Product'}
        </h3>
        <div className="text-sm text-slate-600 space-y-1">
          <p>Order ID: {order._id}</p>
          <p>Quantity: {quantity}</p>
          {product?.name && <p>Price per unit: ${price}</p>}
          <p>Total: ${(price * quantity).toFixed(2)}</p>
        </div>
      </div>
      
      <Button
        variant="danger"
        size="sm"
        onClick={onDelete}
      >
        Delete Order
      </Button>
    </div>
  );
}

export default OrdersPage;
