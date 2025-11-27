import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { ToastProvider } from '../../hooks/useToast';
import { ToastContainer } from '../ToastContainer';
import { useToast } from '../../hooks/useToast';

// Mock component to test toast integration
function TestComponent() {
  const { toasts, showSuccess, showError, removeToast } = useToast();

  return (
    <div>
      <button onClick={() => showSuccess('Subscription added successfully')}>
        Add Success Toast
      </button>
      <button onClick={() => showError('Failed to delete subscription')}>
        Add Error Toast
      </button>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

describe('Toast Integration', () => {
  it('should display success toast when triggered', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const successButton = screen.getByText('Add Success Toast');
    fireEvent.click(successButton);

    await waitFor(() => {
      expect(screen.getByText('Subscription added successfully')).toBeInTheDocument();
    });

    // Check that the toast has success styling (FlyonUI alert-success class)
    const toastElement = screen.getByText('Subscription added successfully').closest('.alert-success');
    expect(toastElement).toBeInTheDocument();
  });

  it('should display error toast when triggered', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const errorButton = screen.getByText('Add Error Toast');
    fireEvent.click(errorButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to delete subscription')).toBeInTheDocument();
    });

    // Check that the toast has error styling (FlyonUI alert-error class)
    const toastElement = screen.getByText('Failed to delete subscription').closest('.alert-error');
    expect(toastElement).toBeInTheDocument();
  });

  it('should allow manual dismissal of toasts', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const successButton = screen.getByText('Add Success Toast');
    fireEvent.click(successButton);

    await waitFor(() => {
      expect(screen.getByText('Subscription added successfully')).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: 'Close notification' });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Subscription added successfully')).not.toBeInTheDocument();
    });
  });

  it('should display multiple toasts simultaneously', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const successButton = screen.getByText('Add Success Toast');
    const errorButton = screen.getByText('Add Error Toast');
    
    fireEvent.click(successButton);
    fireEvent.click(errorButton);

    await waitFor(() => {
      expect(screen.getByText('Subscription added successfully')).toBeInTheDocument();
      expect(screen.getByText('Failed to delete subscription')).toBeInTheDocument();
    });

    // Should have two close buttons (one for each toast)
    const closeButtons = screen.getAllByRole('button', { name: 'Close notification' });
    expect(closeButtons).toHaveLength(2);
  });
});