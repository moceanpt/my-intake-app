import React from 'react'
import { render, screen } from '@testing-library/react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />)
    
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders with custom text', () => {
    render(<LoadingSpinner text="Processing data..." />)
    
    expect(screen.getByText('Processing data...')).toBeInTheDocument()
  })

  it('renders without text when text prop is empty', () => {
    render(<LoadingSpinner text="" />)
    
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })

  it('applies correct size classes', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />)
    expect(screen.getByRole('status')).toHaveClass('w-4', 'h-4')

    rerender(<LoadingSpinner size="lg" />)
    expect(screen.getByRole('status')).toHaveClass('w-12', 'h-12')
  })

  it('applies correct variant classes', () => {
    const { rerender } = render(<LoadingSpinner variant="primary" />)
    expect(screen.getByRole('status')).toHaveClass('border-coast-500')

    rerender(<LoadingSpinner variant="secondary" />)
    expect(screen.getByRole('status')).toHaveClass('border-gray-300')
  })

  it('has proper accessibility attributes', () => {
    render(<LoadingSpinner />)
    
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveAttribute('aria-label', 'Loading')
  })
}) 