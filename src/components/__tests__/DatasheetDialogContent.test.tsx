/**
 * DatasheetDialogContent Component Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DatasheetDialogContent } from '../datasheets/DatasheetDialogContent'
import type { Datasheet } from '../../lib/types'

describe('DatasheetDialogContent', () => {
  const datasheet: Datasheet = {
    id: 'sheet-1',
    name: 'BioFlex Sheet',
    title: 'BioFlex Datasheet',
    description: 'Datasheet description',
    category: 'implant',
    version: 'v1.0',
    lastUpdated: '2024-05-01',
    pdfUrl: 'https://example.com/bioflex.pdf',
    technicalSpecs: {
      tensile: '50 MPa',
    },
  }

  it('renders datasheet details', () => {
    render(
      <DatasheetDialogContent
        datasheet={datasheet}
        onDownload={vi.fn()}
      />
    )

    expect(screen.getByText('BioFlex Sheet')).toBeTruthy()
    expect(screen.getByText('Datasheet description')).toBeTruthy()
    expect(screen.getByText('tensile')).toBeTruthy()
    expect(screen.getByText('50 MPa')).toBeTruthy()
  })

  it('calls onDownload when button is clicked', async () => {
    const handleDownload = vi.fn()

    render(
      <DatasheetDialogContent
        datasheet={datasheet}
        onDownload={handleDownload}
      />
    )

    await userEvent.click(screen.getByRole('button', { name: /download complete datasheet/i }))

    expect(handleDownload).toHaveBeenCalledWith(datasheet)
  })
})
