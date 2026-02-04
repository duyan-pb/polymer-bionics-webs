/**
 * Convert team images to PNG and create web-optimized versions
 */
import sharp from 'sharp'
import { readdir, mkdir } from 'fs/promises'
import { join, parse } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const TEAM_DIR = join(__dirname, '../src/assets/images/team')
const OPTIMIZED_DIR = join(TEAM_DIR, 'optimized')

// Supported input formats
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.heic', '.webp', '.avif', '.tiff']

async function convertImages() {
  console.log('🖼️  Converting team images...\n')
  
  // Create optimized directory
  await mkdir(OPTIMIZED_DIR, { recursive: true })
  console.log(`📁 Created optimized folder: ${OPTIMIZED_DIR}\n`)
  
  // Get all image files
  const files = await readdir(TEAM_DIR)
  const imageFiles = files.filter(f => {
    const ext = parse(f).ext.toLowerCase()
    return SUPPORTED_EXTENSIONS.includes(ext) && f !== 'README.md'
  })
  
  console.log(`Found ${imageFiles.length} images to process:\n`)
  
  for (const file of imageFiles) {
    const { name, ext } = parse(file)
    const inputPath = join(TEAM_DIR, file)
    const pngOutputPath = join(TEAM_DIR, `${name}.png`)
    const optimizedOutputPath = join(OPTIMIZED_DIR, `${name}.webp`)
    
    try {
      // Convert to PNG (full quality)
      if (ext.toLowerCase() !== '.png') {
        await sharp(inputPath)
          .png({ quality: 100 })
          .toFile(pngOutputPath)
        console.log(`✅ ${file} → ${name}.png`)
      } else {
        console.log(`⏭️  ${file} (already PNG)`)
      }
      
      // Create optimized WebP version (resized for web)
      await sharp(inputPath)
        .resize(400, 400, { 
          fit: 'cover',
          position: 'top'  // Focus on face/head area
        })
        .webp({ quality: 85 })
        .toFile(optimizedOutputPath)
      console.log(`   → optimized/${name}.webp (400x400, WebP)\n`)
      
    } catch (err) {
      console.error(`❌ Error processing ${file}:`, err.message)
    }
  }
  
  console.log('\n✨ Done! All images converted.')
  console.log(`\nOriginal PNGs: ${TEAM_DIR}`)
  console.log(`Optimized WebP: ${OPTIMIZED_DIR}`)
}

convertImages().catch(console.error)
