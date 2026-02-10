/**
 * Convert all product/device/custom/material images to optimized WebP.
 * Picks the first supported image from each subfolder as the primary image.
 */
import sharp from 'sharp'
import { readdir, mkdir } from 'fs/promises'
import { join, parse, extname } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const IMAGES_DIR = join(__dirname, '../src/assets/images')

const SUPPORTED = ['.jpg', '.jpeg', '.png', '.webp', '.heic']

// Map: folder name in originals → output filename
const PRODUCTS_MAP = {
  'FlexElec Foam Electrode': { output: 'flexelec_foam', pick: 'FlexElecFoam.jpg' },
  'FlexElec Sheet Electrode': { output: 'flexelec_sheet', pick: 'flat electrode alone1.png' },
  'FlexElec Probe Electrode': { output: 'flexelec_probe', pick: 'FlexElec Probe Full.jpg' },
  'FlexElec Cuff': { output: 'flexelec_cuff', pick: 'CE cuff.png' },
  'FlexElec MEA': { output: 'flexelec_mea', pick: 'MEA zoom in.png' },
}

const DEVICES_MAP = {
  'SimplEEG': { output: 'simpleeg', pick: 'Picture 1headband.png' },
  'BabEEG': { output: 'babeeg', pick: 'BabEEG with kid.png' },
}

const CUSTOM_MAP = {
  'Wearable Systems': { output: 'wearable_systems', pick: 'IMG_2906.JPG' },
  'Wearable Garment Systems': { output: 'wearable_garments', pick: 'EEG textile wearables.png' },
  'Adhesive Monitoring Systems': { output: 'adhesive_monitoring', pick: 'FlexElecsheet electrode.png' },
  'Custom Implantable Electrode Arrays': { output: 'custom_implantable_arrays', pick: 'Hexa array noscale.png' },
}

const MATERIALS_MAP = {
  'FlexElec': { output: 'flexelec', pick: 'CE sheet (1).png' },
  'BionGel': { output: 'biongel', pick: 'BionGel.png' },
  'ElastiSolder': { output: 'elastisolder', pick: 'ElastiSolder.png' },
}

async function convertCategory(category, mapping) {
  const originalsDir = join(IMAGES_DIR, category, 'originals')
  const optimizedDir = join(IMAGES_DIR, category, 'optimized')
  await mkdir(optimizedDir, { recursive: true })

  console.log(`\n📁 ${category.toUpperCase()}`)

  for (const [folder, { output, pick }] of Object.entries(mapping)) {
    const folderPath = join(originalsDir, folder)
    
    if (!existsSync(folderPath)) {
      // Try as a direct file in originals
      const directFile = join(originalsDir, pick)
      if (existsSync(directFile)) {
        try {
          await sharp(directFile)
            .resize(800, 600, { fit: 'cover', position: 'centre' })
            .webp({ quality: 85 })
            .toFile(join(optimizedDir, `${output}.webp`))
          console.log(`  ✅ ${pick} → ${output}.webp`)
        } catch (e) {
          console.log(`  ❌ ${pick}: ${e.message}`)
        }
      } else {
        console.log(`  ⚠️  Folder not found: ${folder}`)
      }
      continue
    }

    const inputFile = join(folderPath, pick)
    if (!existsSync(inputFile)) {
      console.log(`  ⚠️  File not found: ${folder}/${pick}`)
      continue
    }

    try {
      await sharp(inputFile)
        .resize(800, 600, { fit: 'cover', position: 'centre' })
        .webp({ quality: 85 })
        .toFile(join(optimizedDir, `${output}.webp`))
      console.log(`  ✅ ${folder}/${pick} → ${output}.webp`)
    } catch (e) {
      console.log(`  ❌ ${folder}/${pick}: ${e.message}`)
    }

    // Also convert all other images in the folder as gallery images
    const files = await readdir(folderPath)
    let idx = 1
    for (const file of files) {
      if (file === pick) continue
      const ext = extname(file).toLowerCase()
      if (!SUPPORTED.includes(ext)) continue
      try {
        await sharp(join(folderPath, file))
          .resize(800, 600, { fit: 'cover', position: 'centre' })
          .webp({ quality: 85 })
          .toFile(join(optimizedDir, `${output}_${idx}.webp`))
        console.log(`  ✅ ${folder}/${file} → ${output}_${idx}.webp`)
        idx++
      } catch (e) {
        console.log(`  ❌ ${folder}/${file}: ${e.message}`)
      }
    }
  }
}

async function main() {
  console.log('🖼️  Converting all images to optimized WebP...')
  await convertCategory('products', PRODUCTS_MAP)
  await convertCategory('devices', DEVICES_MAP)
  await convertCategory('custom', CUSTOM_MAP)
  await convertCategory('materials', MATERIALS_MAP)
  console.log('\n✨ Done!')
}

main().catch(console.error)
