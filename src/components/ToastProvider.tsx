import toast, { Toaster } from 'react-hot-toast';
import { CheckCircle2, XCircle, AlertCircle, Info, Loader2 } from 'lucide-react';

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Default options
        duration: 4000,
        style: {
          background: '#fff',
          color: '#1F2937',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          maxWidth: '500px',
        },
        
        // Success
        success: {
          duration: 4000,
          style: {
            background: '#F0F9FF',
            border: '1px solid #7FAFD9',
          },
          icon: <CheckCircle2 className="w-5 h-5 text-[#5B8FB9]" />,
        },
        
        // Error
        error: {
          duration: 5000,
          style: {
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
          },
          icon: <XCircle className="w-5 h-5 text-red-500" />,
        },
        
        // Loading
        loading: {
          duration: Infinity,
          style: {
            background: '#F8FAFB',
            border: '1px solid #D8E6F3',
          },
          icon: <Loader2 className="w-5 h-5 text-[#5B8FB9] animate-spin" />,
        },
      }}
    />
  );
}

// Custom toast helper functions with enhanced styling
export const customToast = {
  success: (message: string, description?: string) => {
    return toast.success(
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#5B8FB9] flex-shrink-0" />
          <span className="font-semibold text-[#1F2937]">{message}</span>
        </div>
        {description && (
          <p className="text-sm text-[#6B7280] ml-7">{description}</p>
        )}
      </div>,
      {
        style: {
          background: '#F0F9FF',
          border: '1px solid #7FAFD9',
          animation: 'toast-in 0.3s ease-out',
        },
        icon: null,
      }
    );
  },

  error: (message: string, description?: string) => {
    return toast.error(
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="font-semibold text-[#1F2937]">{message}</span>
        </div>
        {description && (
          <p className="text-sm text-[#6B7280] ml-7">{description}</p>
        )}
      </div>,
      {
        style: {
          background: '#FEF2F2',
          border: '1px solid #FCA5A5',
          animation: 'toast-in 0.3s ease-out',
        },
        icon: null,
      }
    );
  },

  loading: (message: string) => {
    return toast.loading(
      <div className="flex items-center gap-2">
        <Loader2 className="w-5 h-5 text-[#5B8FB9] animate-spin flex-shrink-0" />
        <span className="font-medium text-[#1F2937]">{message}</span>
      </div>,
      {
        style: {
          background: '#F8FAFB',
          border: '1px solid #D8E6F3',
        },
        icon: null,
      }
    );
  },

  info: (message: string, description?: string) => {
    return toast(
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-[#5B8FB9] flex-shrink-0" />
          <span className="font-semibold text-[#1F2937]">{message}</span>
        </div>
        {description && (
          <p className="text-sm text-[#6B7280] ml-7">{description}</p>
        )}
      </div>,
      {
        style: {
          background: '#F0F9FF',
          border: '1px solid #D8E6F3',
          animation: 'toast-in 0.3s ease-out',
        },
        icon: null,
      }
    );
  },

  warning: (message: string, description?: string) => {
    return toast(
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
          <span className="font-semibold text-[#1F2937]">{message}</span>
        </div>
        {description && (
          <p className="text-sm text-[#6B7280] ml-7">{description}</p>
        )}
      </div>,
      {
        style: {
          background: '#FFFBEB',
          border: '1px solid #FCD34D',
          animation: 'toast-in 0.3s ease-out',
        },
        icon: null,
      }
    );
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return toast.promise(
      promise,
      {
        loading: (
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 text-[#5B8FB9] animate-spin" />
            <span>{messages.loading}</span>
          </div>
        ),
        success: (data) => (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#5B8FB9]" />
            <span>{typeof messages.success === 'function' ? messages.success(data) : messages.success}</span>
          </div>
        ),
        error: (err) => (
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            <span>{typeof messages.error === 'function' ? messages.error(err) : messages.error}</span>
          </div>
        ),
      },
      {
        loading: {
          style: {
            background: '#F8FAFB',
            border: '1px solid #D8E6F3',
          },
          icon: null,
        },
        success: {
          style: {
            background: '#F0F9FF',
            border: '1px solid #7FAFD9',
          },
          icon: null,
        },
        error: {
          style: {
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
          },
          icon: null,
        },
      }
    );
  },
  
  dismiss: (toastId?: string) => {
    return toast.dismiss(toastId);
  },
};
