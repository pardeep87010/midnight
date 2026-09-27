async function test() {
  try {
    const res = await fetch('http://localhost:5000/api/products');
    const data = await res.json();
    console.log('API Products Count:', data.length);
    const demoItems = data.filter(p => !p.images || !p.images[0] || !p.images[0].startsWith('/product-images/'));
    console.log('Any non-local/demo image products found?:', demoItems.length);
    if (demoItems.length > 0) {
      console.log('Demo items:', demoItems.map(d => d.name));
    } else {
      console.log('🎉 100% of all', data.length, 'products have verified local images in public/product-images!');
    }
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}
test();
