import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';
import { ToastProvider, useToast } from '../useToast';

const wrapper = ({ children }: { children: ReactNode }) => (
  <ToastProvider>{children}</ToastProvider>
);

describe('useToast', () => {
  it('should throw error when used outside ToastProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useToast());
    }).toThrow('useToast must be used within a ToastProvider');
    
    consoleSpy.mockRestore();
  });

  it('should add success toast', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showSuccess('Success message');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toMatchObject({
      type: 'success',
      message: 'Success message',
      duration: 4000,
    });
    expect(result.current.toasts[0].id).toBeDefined();
  });

  it('should add error toast', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showError('Error message');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toMatchObject({
      type: 'error',
      message: 'Error message',
      duration: 4000,
    });
  });

  it('should add toast with custom duration', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showToast('success', 'Custom duration', 2000);
    });

    expect(result.current.toasts[0].duration).toBe(2000);
  });

  it('should remove toast by id', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showSuccess('Toast 1');
      result.current.showSuccess('Toast 2');
    });

    expect(result.current.toasts).toHaveLength(2);

    const firstToastId = result.current.toasts[0].id;

    act(() => {
      result.current.removeToast(firstToastId);
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Toast 2');
  });

  it('should handle multiple toasts', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showSuccess('Success 1');
      result.current.showError('Error 1');
      result.current.showSuccess('Success 2');
    });

    expect(result.current.toasts).toHaveLength(3);
    expect(result.current.toasts[0].type).toBe('success');
    expect(result.current.toasts[1].type).toBe('error');
    expect(result.current.toasts[2].type).toBe('success');
  });
});