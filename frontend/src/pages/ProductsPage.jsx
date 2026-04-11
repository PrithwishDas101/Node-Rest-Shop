import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../api/endpoints';
import { Button } from '../components/Button';
import { SkeletonGrid } from '../components/Skeleton';
import { toast } from '../utils/toast';

export function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await productsAPI.getAll();

      // 🔍 DEBUG LOGS
      console.log("FULL RESPONSE:", response);
      console.log("RESPONSE.DATA:", response.data);
      console.log("POSSIBLE PATH 1:", response.data?.data?.products);
      console.log("POSSIBLE PATH 2:", response.data?.products);

      // 🔥 SAFE DATA EXTRACTION (handles ALL cases)
      const productsData =
        response.data?.data?.products ||
        response.data?.products ||
        [];

      console.log("FINAL PRODUCTS USED:", productsData);

      setProducts(productsData);
    } catch (err) {
      const message =
        err.response?.data?.error?.message || "Failed to fetch products";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <SkeletonGrid />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-600 mt-2">
            Browse our collection of products
          </p>
        </div>
        <Button onClick={() => navigate("/create-product")}>
          + Add Product
        </Button>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12 card p-8">
          <p className="text-slate-600">No products available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onNavigate={() => navigate(`/products/${product._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, onNavigate }) {
  // 🔍 DEBUG EACH PRODUCT
  console.log("SINGLE PRODUCT:", product);
  console.log("IMAGE URL:", product.productImage);

  // 🔥 FORCE FIX: ensure absolute URL
  let imageUrl = product.productImage;

  if (imageUrl && !imageUrl.startsWith("http")) {
    imageUrl = `http://localhost:8000/${imageUrl}`;
  }

  return (
    <div
      className="card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onNavigate}
    >
      {/* Image */}
      <div className="h-48 bg-slate-200 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log("IMAGE FAILED TO LOAD:", imageUrl);
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            📦
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <h3 className="font-semibold text-slate-900 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">
            ${Number(product.price) || 0}
          </span>
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate();
            }}
          >
            Order
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;