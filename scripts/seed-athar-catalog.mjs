const API = 'https://api.salla.dev/admin/v2';
const token = process.env.SALLA_ACCESS_TOKEN;

if (!token) {
  console.error('Missing SALLA_ACCESS_TOKEN. Set it in this terminal session, then run again.');
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API}${path}`, {...options, headers: {...headers, ...options.headers}});
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === false) {
    throw new Error(`${options.method || 'GET'} ${path}: ${response.status} ${JSON.stringify(payload)}`);
  }
  return payload.data;
};

const imageRoot = 'https://raw.githubusercontent.com/mgeed500100-cpu/athar-fragrance/refs/heads/design/athar-v1/public/images/athar';

const catalog = [
  {
    category: 'العود',
    name: 'عطر أثر العود – 100 مل',
    price: 299,
    sku: 'ATH-OUD-100',
    subtitle: 'عود دافئ · زعفران · مسك',
    description: '<p>تركيبة شرقية عميقة تبدأ بلمسة زعفران، يتوسطها العود الدافئ، وتستقر على قاعدة ناعمة من المسك.</p>',
    image: `${imageRoot}/hero.webp`,
  },
  {
    category: 'العطور الزهرية',
    name: 'قلب زهري – 100 مل',
    price: 269,
    sku: 'ATH-FLR-100',
    subtitle: 'ورد · فاوانيا · مسك أبيض',
    description: '<p>باقة زهرية هادئة بحضور أنيق؛ ورد ناعم وفاوانيا مضيئة فوق قاعدة من المسك الأبيض.</p>',
    image: `${imageRoot}/bottles.webp`,
  },
  {
    category: 'العطور العنبرية',
    name: 'دفء عنبري – 100 مل',
    price: 279,
    sku: 'ATH-AMB-100',
    subtitle: 'عنبر · فانيلا · أخشاب',
    description: '<p>دفء عنبري متوازن يجمع الفانيلا المخملية مع أخشاب هادئة ويترك أثرًا غنيًا يدوم.</p>',
    image: `${imageRoot}/gift.webp`,
  },
  {
    category: 'العطور المنعشة',
    name: 'انفجار منعش – 100 مل',
    price: 249,
    sku: 'ATH-FRS-100',
    subtitle: 'برغموت · حمضيات · مسك',
    description: '<p>افتتاحية حمضية مشرقة يقودها البرغموت، ثم تنساب إلى قلب نظيف وقاعدة مسكية خفيفة.</p>',
    image: `${imageRoot}/bottles.webp`,
  },
  {
    category: 'العطور المسائية',
    name: 'سكون الليل – 100 مل',
    price: 319,
    sku: 'ATH-NGT-100',
    subtitle: 'مسك · توابل · أخشاب داكنة',
    description: '<p>عطر مسائي واثق بتوابل ناعمة وأخشاب داكنة، ينتهي بأثر مسكي هادئ وطويل.</p>',
    image: `${imageRoot}/hero.webp`,
  },
];

const categoryNames = ['العطور', ...new Set(catalog.map(item => item.category)), 'الهدايا'];
const existingCategories = await request('/categories?per_page=100');
const categoryIds = new Map(existingCategories.map(category => [category.name.trim(), category.id]));

for (const name of categoryNames) {
  if (categoryIds.has(name)) {
    console.log(`Category exists: ${name}`);
    continue;
  }
  const category = await request('/categories', {
    method: 'POST',
    body: JSON.stringify({
      name,
      status: 'active',
      metadata_title: `${name} | أثر للعطور`,
      metadata_description: `اكتشف ${name} المختارة من أثر للعطور.`,
      show_in: {app: true},
    }),
  });
  categoryIds.set(name, category.id);
  console.log(`Created category: ${name}`);
}

const existingProducts = await request('/products?per_page=100&format=light');
const productsByName = new Map(existingProducts.map(product => [product.name.trim(), product]));

for (const item of catalog) {
  const categories = [categoryIds.get('العطور'), categoryIds.get(item.category)].filter(Boolean);
  const existing = productsByName.get(item.name);
  if (existing) {
    await request(`/products/${existing.id}`, {
      method: 'PUT',
      body: JSON.stringify({categories}),
    });
    console.log(`Updated categories: ${item.name}`);
    continue;
  }

  await request('/products', {
    method: 'POST',
    body: JSON.stringify({
      name: item.name,
      price: item.price,
      status: 'sale',
      product_type: 'product',
      quantity: 20,
      description: item.description,
      categories,
      require_shipping: true,
      weight: 0.5,
      weight_type: 'kg',
      sku: item.sku,
      subtitle: item.subtitle,
      metadata_title: `${item.name} | أثر للعطور`,
      metadata_description: item.subtitle,
      images: [{original: item.image, thumbnail: item.image, alt: item.name, default: true, sort: 1}],
    }),
  });
  console.log(`Created product: ${item.name}`);
}

console.log('Athar catalog is ready.');
