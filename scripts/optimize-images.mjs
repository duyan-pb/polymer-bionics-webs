/**
 * Image Optimization Script
 * 
 * Converts large PNG/JPG images to optimized WebP format.
 * Maintains visual quality while drastically reducing file size.
 * 
 * Usage: node scripts/optimize-images.mjs
 */

import sharp from 'sharp'
import { readdir, stat, mkdir } from 'fs/promises'
import { join, parse } from 'path'

const IMAGES_DIR = './src/assets/images'
const OUTPUT_DIR = './src/assets/images/optimized'

// Target sizes for different image types
const HERO_MAX_WIDTH = 1920  // Full-width hero images
const PRODUCT_MAX_WIDTH = 800  // Product thumbnails

// Quality settings (0-100)
const WEBP_QUALITY = 82  // Good balance of quality and size
const JPEG_QUALITY = 85

// Images to optimize (hero/background images that are too large)
const HERO_IMAGES = [
  'CE_sheet.png',
  'Elastomer_array.png', 
  'Neural_Cells.png',
  'Background_Cover.png',
]

const PRODUCT_IMAGES = [
  'PXL_20251216_115711682.PORTRAIT.jpg',
  'PXL_20251216_115728419.PORTRAIT.ORIGINAL.jpg',
  'PXL_20251216_115810661.jpg',
  'PXL_20251216_115854143.jpg',
  'PXL_20251216_115905670.jpg',
  'PXL_20251216_115937300.jpg',
  'PXL_20251216_115958662.jpg',
  'PXL_20251216_120055171.jpg',
  'PXL_20251216_120056575.jpg',
  'PXL_20251216_120119941.jpg',
]

async function optimizeImage(inputPath, outputPath, maxWidth, isHero = false) {
  const inputStats = await stat(inputPath)
  const inputSizeKB = Math.round(inputStats.size / 1024)
  
  const image = sharp(inputPath)
  const metadata = await image.metadata()
  
  // Resize if larger than max width
  const shouldResize = metadata.width > maxWidth
  
  let pipeline = image
  
  if (shouldResize) {
    pipeline = pipeline.resize(maxWidth, null, {
      withoutEnlargement: true,
      fit: 'inside',
    })
  }
  
  // Convert to WebP for best compression
  const webpPath = outputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp')
  await pipeline
    .webp({ quality: WEBP_QUALITY, effort: 6 })
    .toFile(webpPath)
  
  // Also create optimized JPEG fallback for older browsers
  const jpegPath = outputPath.replace(/\.(png|jpg|jpeg)$/i, '.jpg')
  await sharp(inputPath)
    .resize(maxWidth, null, { withoutEnlargement: true, fit: 'inside' })
    .jpeg({ quality: JPEG_QUALITY, progressive: true })
    .toFile(jpegPath)
  
  const webpStats = await stat(webpPath)
  const jpegStats = await stat(jpegPath)
  const webpSizeKB = Math.round(webpStats.size / 1024)
  const jpegSizeKB = Math.round(jpegStats.size / 1024)
  
  const webpReduction = Math.round((1 - webpSizeKB / inputSizeKB) * 100)
  const jpegReduction = Math.round((1 - jpegSizeKB / inputSizeKB) * 100)
  
  console.log(`✓ ${parse(inputPath).base}`)
  console.log(`  Original: ${inputSizeKB} KB (${metadata.width}x${metadata.height})`)
  console.log(`  WebP:     ${webpSizeKB} KB (-${webpReduction}%)`)
  console.log(`  JPEG:     ${jpegSizeKB} KB (-${jpegReduction}%)`)
  console.log('')
  
  return { webpPath, jpegPath, webpSizeKB, jpegSizeKB, inputSizeKB }
}

async function main() {
  console.log('🖼️  Image Optimization Script\n')
  console.log('=' .repeat(50))
  
  // Create output directory
  try {
    await mkdir(OUTPUT_DIR, { recursive: true })
  } catch (e) {
    // Directory exists
  }
  
  let totalOriginal = 0
  let totalWebp = 0
  let totalJpeg = 0
  
  // Optimize hero images
  console.log('\n📸 Hero/Background Images (max 1920px width):\n')
  for (const filename of HERO_IMAGES) {
    const inputPath = join(IMAGES_DIR, filename)
    const outputPath = join(OUTPUT_DIR, filename)
    try {
      const result = await optimizeImage(inputPath, outputPath, HERO_MAX_WIDTH, true)
      totalOriginal += result.inputSizeKB
      totalWebp += result.webpSizeKB
      totalJpeg += result.jpegSizeKB
    } catch (e) {
      console.log(`⚠️  Skipped ${filename}: ${e.message}`)
    }
  }
  
  // Optimize product images
  console.log('\n📷 Product Images (max 800px width):\n')
  for (const filename of PRODUCT_IMAGES) {
    const inputPath = join(IMAGES_DIR, filename)
    const outputPath = join(OUTPUT_DIR, filename)
    try {
      const result = await optimizeImage(inputPath, outputPath, PRODUCT_MAX_WIDTH, false)
      totalOriginal += result.inputSizeKB
      totalWebp += result.webpSizeKB
      totalJpeg += result.jpegSizeKB
    } catch (e) {
      console.log(`⚠️  Skipped ${filename}: ${e.message}`)
    }
  }
  
  // Summary
  console.log('=' .repeat(50))
  console.log('\n📊 Summary:\n')
  console.log(`  Total Original: ${(totalOriginal / 1024).toFixed(2)} MB`)
  console.log(`  Total WebP:     ${(totalWebp / 1024).toFixed(2)} MB (-${Math.round((1 - totalWebp / totalOriginal) * 100)}%)`)
  console.log(`  Total JPEG:     ${(totalJpeg / 1024).toFixed(2)} MB (-${Math.round((1 - totalJpeg / totalOriginal) * 100)}%)`)
  console.log(`\n✅ Optimized images saved to: ${OUTPUT_DIR}`)
  console.log('\nNext steps:')
  console.log('1. Review optimized images for quality')
  console.log('2. Replace original imports with optimized versions')
  console.log('3. Update HeroImage component to use WebP with JPEG fallback')
}

main().catch(console.error)
