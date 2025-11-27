import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CategorySelector } from '../CategorySelector';

describe('CategorySelector', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with default props', () => {
    render(
      <CategorySelector
        value=""
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Select a category')).toBeInTheDocument();
  });

  it('displays selected category with icon and badge', () => {
    render(
      <CategorySelector
        value="Entertainment"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('🎬')).toBeInTheDocument();
    expect(screen.getByText('Entertainment')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', async () => {
    render(
      <CategorySelector
        value=""
        onChange={mockOnChange}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Netflix, Spotify, Disney+')).toBeInTheDocument();
      expect(screen.getByText('Office, Adobe, GitHub')).toBeInTheDocument();
    });
  });

  it('selects predefined category', async () => {
    render(
      <CategorySelector
        value=""
        onChange={mockOnChange}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      const entertainmentOption = screen.getByText('Entertainment');
      fireEvent.click(entertainmentOption);
    });

    expect(mockOnChange).toHaveBeenCalledWith('Entertainment');
  });

  it('shows custom input when custom category option is clicked', async () => {
    render(
      <CategorySelector
        value=""
        onChange={mockOnChange}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      const customOption = screen.getByText('Custom Category');
      fireEvent.click(customOption);
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter custom category')).toBeInTheDocument();
    });
  });

  it('handles custom category input', async () => {
    render(
      <CategorySelector
        value=""
        onChange={mockOnChange}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      const customOption = screen.getByText('Custom Category');
      fireEvent.click(customOption);
    });

    await waitFor(() => {
      const input = screen.getByPlaceholderText('Enter custom category');
      fireEvent.change(input, { target: { value: 'Education' } });
    });

    expect(mockOnChange).toHaveBeenCalledWith('Education');
  });

  it('shows error message when error prop is provided', () => {
    render(
      <CategorySelector
        value=""
        onChange={mockOnChange}
        error="Category is required"
      />
    );

    expect(screen.getByText('Category is required')).toBeInTheDocument();
  });

  it('shows required indicator when required prop is true', () => {
    render(
      <CategorySelector
        value=""
        onChange={mockOnChange}
        required={true}
      />
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <CategorySelector
        value=""
        onChange={mockOnChange}
        disabled={true}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('displays custom category value', () => {
    render(
      <CategorySelector
        value="Education"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByDisplayValue('Education')).toBeInTheDocument();
  });

  it('resets to General when custom input is cleared', async () => {
    render(
      <CategorySelector
        value="Education"
        onChange={mockOnChange}
      />
    );

    const input = screen.getByDisplayValue('Education');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('General');
    });
  });
});