import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    message: '',
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'เกิดข้อผิดพลาดที่ไม่คาดคิด',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application error caught by ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-dvh w-full flex items-center justify-center bg-[#F7F6FA] p-6 text-[#181326]">
          <div className="max-w-md w-full bg-white border-2 border-[#181326] rounded-2xl p-6 shadow-[0_8px_0_#181326] space-y-4">
            <h1 className="font-display text-lg font-bold text-[#181326]">
              เกิดข้อผิดพลาดในการเชื่อมต่อระบบ
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              ไม่สามารถดำเนินการคำขอได้ในขณะนี้ กรุณาลองรีเฟรชหน้าจอหรือตรวจสอบสิทธิ์การเข้าสู่ระบบของคุณ
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm font-semibold text-white bg-[#741B7E] hover:bg-[#5E1467] rounded-xl transition-colors cursor-pointer"
            >
              โหลดหน้าใหม่
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
