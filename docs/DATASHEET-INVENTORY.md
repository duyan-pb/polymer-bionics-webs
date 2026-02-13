# Datasheet Inventory

> Status of product datasheets — which exist and which are missing.
>
> Last updated: February 2026

## Available Datasheets

| # | Item | Type | File | Path |
|---|------|------|------|------|
| 1 | SimplEEG (Foam Electrode) | Product | `SimplEEG_PB_datasheet.pdf` | `/datasheets/SimplEEG_PB_datasheet.pdf` |
| 2 | FlexElec Probe Electrode | Product | `FlexElecProbe_PB_datasheet.pdf` | `/datasheets/FlexElecProbe_PB_datasheet.pdf` |
| 3 | SimplEEG Headband | Device | `SimplEEGheadband_PB_datasheet.pdf` | `/datasheets/SimplEEGheadband_PB_datasheet.pdf` |

## Missing Datasheets

### Products (electrodes)

| # | Product | Priority | Notes |
|---|---------|----------|-------|
| 1 | **FlexElec Sheet Electrode** | High | Adhesive skin-conforming electrode — no datasheet at all |
| 2 | **FlexElec Cuff** | High | Peripheral nerve cuff electrode — no datasheet at all |
| 3 | **FlexElec MEA** | High | Multi-electrode array (implantable) — no datasheet at all |

### Devices (EEG systems)

| # | Device | Priority | Notes |
|---|--------|----------|-------|
| 4 | **BabEEG** | Medium | Neonatal/infant EEG cap — still in development |
| 5 | **In-Ear EEG** | Low | Early-stage development — datasheet not expected yet |
| 6 | **Sports EEG** | Low | Prototype stage — datasheet not expected yet |

### Materials

| # | Material | Priority | Notes |
|---|----------|----------|-------|
| 7 | **FlexElec** (conductive elastomer) | High | Core material — no product datasheet |
| 8 | **BionGel** (conductive hydrogel) | High | Core material — placeholder URL in media-data only |
| 9 | **ElastiSolder** (stretchable solder) | Medium | Supporting material |

### Custom Solutions

| # | Solution | Priority | Notes |
|---|----------|----------|-------|
| 10 | Custom Embedded Electrodes | Low | Partner-specific — may need generic capability sheet |
| 11 | Wearable Systems | Low | Partner-specific |
| 12 | Wearable Garment Systems | Low | Partner-specific |
| 13 | Adhesive Monitoring Systems | Low | Partner-specific |
| 14 | Custom Implantable Arrays | Medium | High-value product line — capability sheet recommended |

## Summary

- **3 datasheets available** (on disk in `public/datasheets/`)
- **11 datasheets missing** (3 high priority products, 3 high priority materials, 5 others)

### Recommended Priority Order

1. FlexElec Sheet Electrode — commercially available product, no datasheet
2. FlexElec Cuff — commercially available product, no datasheet
3. FlexElec MEA — commercially available product, no datasheet
4. FlexElec (material) — core material platform, needs own sheet
5. BionGel (material) — core material, has placeholder reference but no real PDF
6. Custom Implantable Arrays — high-value partner offering
7. BabEEG — when development advances
8. ElastiSolder — supporting material

### File Naming Convention

Existing files follow the pattern: `{ProductName}_PB_datasheet.pdf`

Suggested filenames for missing datasheets:
- `FlexElecSheet_PB_datasheet.pdf`
- `FlexElecCuff_PB_datasheet.pdf`
- `FlexElecMEA_PB_datasheet.pdf`
- `FlexElec_PB_datasheet.pdf` (material)
- `BionGel_PB_datasheet.pdf` (material)
- `ElastiSolder_PB_datasheet.pdf` (material)
- `BabEEG_PB_datasheet.pdf`
- `CustomImplantableArrays_PB_datasheet.pdf`
