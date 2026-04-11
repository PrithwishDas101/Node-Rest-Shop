import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { toast } from '../utils/toast';
import { productsAPI } from '../api/endpoints';
import { useNavigate } from 'react-router-dom';

export function CreateProductPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    productImage: null,
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, productImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      if (errors.productImage) {
        setErrors(prev => ({ ...prev, productImage: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.productImage) newErrors.productImage = 'Product image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('productImage', formData.productImage);

      await productsAPI.create(formDataToSend);
      toast.success('Product created successfully!');
      navigate('/products');
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Failed to create product';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Create Product</h1>
        <p className="text-slate-600 mt-2">Add a new product to your store</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-8 space-y-6">
        <Input
          label="Product Name"
          name="name"
          placeholder="Enter product name"
          value={formData.name}
          onChange={handleInputChange}
          error={errors.name}
          required
        />

        <Input
          label="Price"
          name="price"
          type="number"
          placeholder="0.00"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={handleInputChange}
          error={errors.price}
          required
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Product Image
            <span className="text-red-500">*</span>
          </label>
          
          {imagePreview && (
            <div className="mb-4 rounded-lg overflow-hidden h-40">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-medium
              file:bg-primary-600 file:text-white
              hover:file:bg-primary-700"
          />
          
          {errors.productImage && (
            <p className="mt-1.5 text-sm text-red-600">{errors.productImage}</p>
          )}
        </div>

        <div className="flex gap-4">
          <Button
            variant="primary"
            type="submit"
            className="flex-1"
            isLoading={loading}
          >
            Create Product
          </Button>
          <Button
            variant="secondary"
            type="button"
            className="flex-1"
            onClick={() => navigate('/products')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateProductPage;
