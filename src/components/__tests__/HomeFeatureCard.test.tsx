/**
 * HomeFeatureCard Component Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HomeFeatureCard } from '../home/HomeFeatureCard'

describe('HomeFeatureCard', () => {
  it('renders title, description, and action label', () => {
    render(
      <HomeFeatureCard
        title="Fast Deployment"
        description="Deploy solutions quickly."
        actionLabel="Learn more"
        icon={<span data-testid="icon" />}
        onSelect={vi.fn()}
        ariaLabel="Learn about deployment"
      />
    )

    expect(screen.getByText('Fast Deployment')).toBeInTheDocument()
    expect(screen.getByText('Deploy solutions quickly.')).toBeInTheDocument()
    expect(screen.getByText('Learn more')).toBeInTheDocument()
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('calls onSelect when clicked', async () => {
    const handleSelect = vi.fn()
    render(
      <HomeFeatureCard
        title="Fast Deployment"
        description="Deploy solutions quickly."
        actionLabel="Learn more"
        icon={<span />}
        onSelect={handleSelect}
        ariaLabel="Learn about deployment"
      />
    )

    await userEvent.click(screen.getByRole('button', { name: 'Learn about deployment' }))

    expect(handleSelect).toHaveBeenCalledTimes(1)
  })
})
