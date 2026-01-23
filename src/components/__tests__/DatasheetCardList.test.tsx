/**
 * DatasheetCardList Component Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DatasheetCardList } from '../datasheets/DatasheetCardList'
import type { Datasheet } from '../../lib/types'

describe('DatasheetCardList', () => {
  const datasheet: Datasheet = {
    id: 'sheet-1',
    name: 'BioFlex Sheet',
    title: 'BioFlex Datasheet',
    description: 'Datasheet description',
    category: 'implant',
    version: 'v1.0',
    lastUpdated: '2024-05-01',
    pdfUrl: 'https://example.com/bioflex.pdf',
  }

  it('renders datasheet cards', () => {
    render(
      <DatasheetCardList
        datasheets={[datasheet]}
        onSelect={vi.fn()}
        onDownload={vi.fn()}
      />
    )

    expect(screen.getByText('BioFlex Sheet')).toBeTruthy()
    expect(screen.getByText('v1.0')).toBeTruthy()
  })

  it('calls onSelect when card is clicked', async () => {
    const handleSelect = vi.fn()
    render(
      <DatasheetCardList
        datasheets={[datasheet]}
        onSelect={handleSelect}
        onDownload={vi.fn()}
      />
    )

    await userEvent.click(screen.getByText('BioFlex Sheet'))

    expect(handleSelect).toHaveBeenCalledWith(datasheet)
  })

  it('calls onDownload when download button is clicked', async () => {
    const handleDownload = vi.fn()
    const handleSelect = vi.fn()

    render(
      <DatasheetCardList
        datasheets={[datasheet]}
        onSelect={handleSelect}
        onDownload={handleDownload}
      />
    )

    await userEvent.click(screen.getByRole('button', { name: /download pdf/i }))

    expect(handleDownload).toHaveBeenCalledWith(datasheet)
    expect(handleSelect).not.toHaveBeenCalled()
  })
})
