import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { Toast } from '../Toast';

describe('Toast', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders success toast with correct styling and message', () => {
    render(
      <Toast
        id="test-toast"
        type="success"
        message="Test success message"
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Test success message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close notification' })).toBeInTheDocument();
    
    // Check for success styling (FlyonUI alert-success class) - find the outermost div
    const toastElement = screen.getByText('Test success message').closest('.alert-success');
    expect(toastElement).toBeInTheDocument();
  });

  it('renders error toast with correct styling and message', () => {
    render(
      <Toast
        id="test-toast"
        type="error"
        message="Test error message"
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Test error message')).toBeInTheDocument();
    
    // Check for error styling (FlyonUI alert-error class) - find the outermost div
    const toastElement = screen.getByText('Test error message').closest('.alert-error');
    expect(toastElement).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <Toast
        id="test-toast"
        type="success"
        message="Test message"
        onClose={mockOnClose}
      />
    );

    const closeButton = screen.getByRole('button', { name: 'Close notification' });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledWith('test-toast');
  });

  it('auto-closes after specified duration', async () => {
    render(
      <Toast
        id="test-toast"
        type="success"
        message="Test message"
        duration={100}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledWith('test-toast');
    }, { timeout: 200 });
  });

  it('uses default duration when not specified', async () => {
    render(
      <Toast
        id="test-toast"
        type="success"
        message="Test message"
        onClose={mockOnClose}
      />
    );

    // Should not close immediately
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});