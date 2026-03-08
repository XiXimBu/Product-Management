require('dotenv').config()
const database = require('../config/database')
const Product = require('../models/product-model')

async function run() {
  await database.connect()
  try {
    const cursor = Product.find({ $or: [ { 'createdBy': { $exists: false } }, { 'createdBy.name': { $in: [null, ''] } } ] }).cursor()
    let count = 0
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      const fallback = (doc.updatedBy && doc.updatedBy.name) ? doc.updatedBy : { id: null, name: 'unknown' }
      doc.createdBy = fallback
      await doc.save()
      count++
      console.log(`Updated product ${doc._id} -> createdBy: ${fallback.name}`)
    }
    console.log(`Backfill complete. Updated ${count} documents.`)
  } catch (err) {
    console.error('Backfill failed:', err)
  } finally {
    process.exit(0)
  }
}

run()
