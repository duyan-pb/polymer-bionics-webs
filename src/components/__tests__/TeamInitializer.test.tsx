/**
 * TeamInitializer Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { TeamInitializer } from '../TeamInitializer'

// Mock useKV hook
const mockSetTeam = vi.fn()
vi.mock('@github/spark/hooks', () => ({
  useKV: vi.fn(() => [[], mockSetTeam]),
}))

// Mock team-data
vi.mock('@/lib/team-data', () => ({
  teamMembers: [
    {
      id: 'member-1',
      name: 'Test Member 1',
      title: 'Test Title 1',
      role: 'Test Role 1',
      category: 'founders',
      shortBio: 'Short bio 1',
    },
    {
      id: 'member-2',
      name: 'Test Member 2',
      title: 'Test Title 2',
      role: 'Test Role 2',
      category: 'research',
      shortBio: 'Short bio 2',
    },
  ],
}))

describe('TeamInitializer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders null (no visible output)', () => {
      const { container } = render(<TeamInitializer />)
      
      expect(container.firstChild).toBeNull()
    })
  })

  describe('initialization', () => {
    it('sets team members when team array is empty', async () => {
      render(<TeamInitializer />)
      
      await waitFor(() => {
        expect(mockSetTeam).toHaveBeenCalledWith(expect.arrayContaining([
          expect.objectContaining({
            id: 'member-1',
            name: 'Test Member 1',
          }),
          expect.objectContaining({
            id: 'member-2',
            name: 'Test Member 2',
          }),
        ]))
      })
    })

    it('updates team when length differs from source', async () => {
      const { useKV } = await import('@github/spark/hooks')
      // Single member, but source has 2
      vi.mocked(useKV).mockReturnValue([[{ id: 'old-member' }], mockSetTeam])
      
      render(<TeamInitializer />)
      
      await waitFor(() => {
        expect(mockSetTeam).toHaveBeenCalled()
      })
    })
  })

  describe('with existing team', () => {
    it('does not update when team length matches', async () => {
      const { useKV } = await import('@github/spark/hooks')
      // Same length as mock teamMembers
      vi.mocked(useKV).mockReturnValue([
        [{ id: 'member-1' }, { id: 'member-2' }],
        mockSetTeam,
      ])
      
      render(<TeamInitializer />)
      
      // Wait a bit to ensure no update happens
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Should not call setTeam because lengths match
      expect(mockSetTeam).not.toHaveBeenCalled()
    })
  })
})
