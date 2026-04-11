import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI, ordersAPI } from '../api/endpoints';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Skeleton, SkeletonText } from '../components/Skeleton';
import { toast } from '../utils/toast';
import { useAuth } from '../hooks/useAuth';

const BASE_URL = "http://localhost:8000";

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);

      const data = response.data.data.product;

      console.log("FULL PRODUCT:", data);

      setProduct(data);

    } catch (err) {
      const message =
        err.response?.data?.error?.message || 'Failed to fetch product';
      toast.error(message);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to create an order');
      navigate('/login');
      return;
    }

    setCreating(true);
    try {
      await ordersAPI.create(id, quantity);
      toast.success('Order created successfully!');
      navigate('/orders');
    } catch (err) {
      const message =
        err.response?.data?.error?.message || 'Failed to create order';
      toast.error(message);
    } finally {
      setCreating(false);
    }
  };

  // ✅ Safe calculations
  const price = Number(product?.price) || 0;
  const qty = Number(quantity) || 0;
  const total = price * qty;

  // 🔥 MAIN FIX HERE
  let imagePath = product?.productImage;

  if (imagePath) {
    // convert backslashes → forward slashes
    imagePath = imagePath.replace(/\\/g, "/");

    // if already full URL → use directly
    if (!imagePath.startsWith("http")) {
      imagePath = `${BASE_URL}/${imagePath}`;
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="h-96 w-full" />
        <div className="space-y-6">
          <SkeletonText lines={2} />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      </div>
    );
  }

  if (!product) return <div>Product not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/products')}
        className="text-primary-600 hover:text-primary-700 font-medium mb-8"
      >
        ← Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* IMAGE */}
        <div className="card overflow-hidden">
          {imagePath ? (
            <img
              src={imagePath}
              alt={product.name}
              className="w-full h-96 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://dummyimage.com/400x300/cccccc/000000&text=No+Image";
              }}
            />
          ) : (
            <div className="w-full h-96 flex items-center justify-center bg-slate-100 text-2xl font-bold">
              NO IMAGE
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {product?.name}
            </h1>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary-600">
                ${price}
              </span>
              <span className="text-slate-600">per unit</span>
            </div>
          </div>

          <div className="space-y-4">
            <label htmlFor="quantity" className="block">
              <span className="text-sm font-medium text-slate-700 mb-2 block">
                Quantity
              </span>

              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                max="100"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
              />
            </label>

            <div className="bg-slate-100 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Total Price</p>
              <p className="text-2xl font-bold text-slate-900">
                ${total.toFixed(2)}
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleCreateOrder}
              isLoading={creating}
            >
              {isAuthenticated ? 'Create Order' : 'Login to Order'}
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProductDetailPage;