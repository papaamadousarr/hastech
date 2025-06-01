const fs = require('fs');

// 1. Load categories_en.json
const categories = JSON.parse(fs.readFileSync('categories_en.json', 'utf8'));

// 2. Build subcategory slug -> English name map
const subcategorySlugToName = {};
categories.forEach(cat => {
  cat.subcategories.forEach(sub => {
    subcategorySlugToName[sub.slug] = sub.name;
  });
});

// 3. Load AllProducts.json
let products = JSON.parse(fs.readFileSync('AllProducts.json', 'utf8'));

// Remove products with name 'Unknown Product'
products = products.filter(product => product.name !== 'Unknown Product');

// 4. Set conversion rate (update as needed)
const TL_TO_CFA = 16;

// Build a list of all subcategories with their slug and image
const allSubcategories = [];
categories.forEach(cat => {
  cat.subcategories.forEach(sub => {
    allSubcategories.push({
      slug: sub.slug,
      name: sub.name,
      image: sub.image
    });
  });
});

const validSubcategorySlugs = new Set(allSubcategories.map(sub => sub.slug));

// 5. Update each product
const updatedProducts = products.map(product => {
  let brand = '';
  let id = '';
  let subcategorySlug = '';
  let name = '';

  if (product.link) {
    // Extract brand, id, and slug from the link
    const lastPart = product.link.split('/').pop();
    const match = lastPart.match(/^([a-zA-Z0-9]+)-(\d+)-([a-z0-9-]+)$/i);
    if (match) {
      brand = match[1].toUpperCase();
      id = match[2];
      subcategorySlug = match[3];
    }
  }

  // Find the subcategory in English categories
  let matchedSub = null;
  if (subcategorySlug) {
    matchedSub = allSubcategories.find(sub => sub.slug === subcategorySlug);
    if (matchedSub) {
      name = matchedSub.name;
      subcategorySlug = matchedSub.slug; // ensure it's the English slug
    }
  }
  if (!name) name = product.name;

  // If you have the English name but not a valid slug, generate it
  if (!subcategorySlug && name) {
    subcategorySlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  // Convert price to CFA (handle string with TL and comma)
  let priceTL = product.price;
  if (typeof priceTL === 'string') {
    priceTL = priceTL.replace(/[^\d.,]/g, '').replace(',', '.');
  }
  let price = Math.round(Number(priceTL) * TL_TO_CFA);

  // Generate slug from name
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  return {
    name,
    id,
    brand,
    availability: product.availability,
    link: product.link,
    image: product.image,
    price,
    slug
  };
});

// 6. Write to new file
fs.writeFileSync('AllProducts_withSlugs.json', JSON.stringify(updatedProducts, null, 2));
console.log('AllProducts_withSlugs.json created!');
