import React from "react";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LogoutConfirmModal({
  isOpen,
  isLoading,
  onConfirm,
  onCancel,
}: LogoutConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300"
        onClick={() => !isLoading && onCancel()}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Xác nhận đăng xuất
          </h3>
          <p className="text-gray-600 mb-6">
            Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?
          </p>
          
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Đang đăng xuất...
                </>
              ) : (
                "Đăng xuất"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
