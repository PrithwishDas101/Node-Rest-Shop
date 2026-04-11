import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { toast } from '../utils/toast';
import { authAPI } from '../api/endpoints';

export function AccountPage() {
  const navigate = useNavigate();
  const { user, deleteAccount } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getProfile();
      setProfileData(response.data.data.user);
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Failed to fetch profile';
      toast.error(message);
      // Fallback to context user if profile fetch fails
      setProfileData(user);
    } finally {
      setLoading(false);
    }
  };

  const displayUser = profileData || user;

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const userId = displayUser._id;
      const success = await deleteAccount(userId);
      if (success) {
        navigate('/products');
      }
    } finally {
      setDeleting(false);
      setDeleteModal(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Account</h1>
        <p className="text-slate-600 mt-2">Manage your account settings</p>
      </div>

      {loading ? (
        <div className="card p-8 text-center">
          <p className="text-slate-600">Loading profile...</p>
        </div>
      ) : (
        <>
          {/* Account Information */}
          <div className="card p-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Account Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                  <div className="px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900">
                    {displayUser?.email || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Username</label>
                  <div className="px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900">
                    {displayUser?.username || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Age</label>
                  <div className="px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900">
                    {displayUser?.age || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">User ID</label>
                  <div className="px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 font-mono text-sm">
                    {displayUser?._id || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card p-8 border-red-200 bg-red-50 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-red-900 mb-2">Danger Zone</h2>
              <p className="text-red-700 text-sm mb-6">
                Irreversible and destructive actions
              </p>

              <Button
                variant="danger"
                onClick={() => setDeleteModal(true)}
              >
                Delete Account
              </Button>
            </div>
          </div>

          {/* Delete Account Modal */}
          <Modal
            isOpen={deleteModal}
            title="Delete Account"
            onClose={() => setDeleteModal(false)}
            onConfirm={handleDeleteAccount}
            confirmText="Delete My Account"
            isDangerous
            isLoading={deleting}
          >
            <div className="space-y-4">
              <p className="text-slate-600">
                This action is <strong>permanent</strong> and cannot be undone.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 font-medium">All your data will be deleted:</p>
                <ul className="list-disc list-inside text-red-700 text-sm mt-2 space-y-1">
                  <li>Account information</li>
                  <li>Orders history</li>
                  <li>Products created</li>
                </ul>
              </div>
              <p className="text-slate-600 text-sm">
                Please type your email to confirm: <strong>{displayUser?.email}</strong>
              </p>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
}

export default AccountPage;
