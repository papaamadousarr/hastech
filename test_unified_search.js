// Test de l'API de recherche unifiée
const API_BASE = 'http://localhost:3000/api';

// Fonction de test générique
async function testAPI(endpoint, params = {}) {
  const url = new URL(`${API_BASE}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  try {
    console.log(`\n🔍 Test: ${endpoint}`);
    console.log(`📡 URL: ${url}`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`📊 Résultats: ${data.total || data.length || 'N/A'}`);
    
    if (data.searchType) {
      console.log(`🎯 Type détecté: ${data.searchType}`);
    }
    
    if (data.products && data.products.length > 0) {
      console.log(`📦 Premier produit: ${data.products[0].name}`);
    }
    
    if (data.suggestions && data.suggestions.length > 0) {
      console.log(`💡 Suggestions: ${data.suggestions.slice(0, 3).join(', ')}...`);
    }
    
    return data;
  } catch (error) {
    console.error(`❌ Erreur: ${error.message}`);
    return null;
  }
}

// Tests de la recherche unifiée
async function runTests() {
  console.log('🚀 Tests de la Recherche Unifiée - Style Aloparca');
  console.log('================================================');

  // Test 1: Recherche par mot-clé
  await testAPI('/search/unified', { q: 'frein' });
  
  // Test 2: Recherche par numéro OEM (simulé)
  await testAPI('/search/unified', { q: '1234567890' });
  
  // Test 3: Recherche par code produit (simulé)
  await testAPI('/search/unified', { q: 'BSG123' });
  
  // Test 4: Recherche mixte
  await testAPI('/search/unified', { q: 'ABC123DEF' });
  
  // Test 5: Recherche avec filtres
  await testAPI('/search/unified', { 
    q: 'huile',
    brand: 'Total',
    minPrice: '10',
    maxPrice: '50'
  });
  
  // Test 6: Recherche par véhicule
  await testAPI('/search/unified', { 
    q: 'filtre',
    vehicleBrand: 'Audi',
    vehicleModel: 'A4'
  });

  // Test des suggestions
  console.log('\n🔮 Test des Suggestions');
  console.log('========================');
  await testAPI('/search/suggestions', { q: 'frei' });
  
  // Test de la recherche rapide
  console.log('\n⚡ Test Recherche Rapide');
  console.log('========================');
  await testAPI('/search/quick', { q: 'huile' });

  console.log('\n✨ Tests terminés!');
}

// Exécuter les tests
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  runTests();
} else {
  // Browser environment
  runTests();
}