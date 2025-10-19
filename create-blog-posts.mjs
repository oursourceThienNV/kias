import pg from 'pg';

const client = new pg.Client({
  host: 'localhost',
  port: 5433,
  database: 'hapas_ecommerce',
  user: 'hapas',
  password: 'hapasdev123'
});

const samplePosts = [
  {
    name: 'Xu hướng thời trang Xuân Hè 2025',
    url_key: 'xu-huong-thoi-trang-xuan-he-2025',
    meta_title: 'Xu hướng thời trang Xuân Hè 2025 - HAPAS',
    meta_description: 'Khám phá những xu hướng thời trang nổi bật nhất cho mùa Xuân Hè 2025',
    status: 1
  },
  {
    name: 'Bí quyết phối đồ công sở thanh lịch',
    url_key: 'bi-quyet-phoi-do-cong-so',
    meta_title: 'Bí quyết phối đồ công sở thanh lịch',
    meta_description: 'Cẩm nang phối đồ công sở chuyên nghiệp cho phụ nữ hiện đại',
    status: 1
  },
  {
    name: 'BST Set Bộ Cao Cấp 2025',
    url_key: 'bst-set-bo-cao-cap-2025',
    meta_title: 'BST Set Bộ Cao Cấp - Tinh Tế Từng Chi Tiết',
    meta_description: 'Bộ sưu tập Set Bộ cao cấp với thiết kế tinh tế',
    status: 1
  }
];

(async () => {
  try {
    await client.connect();
    
    for (const post of samplePosts) {
      const insertPage = await client.query(
        `INSERT INTO cms_page (uuid, status, created_at, updated_at) 
         VALUES (gen_random_uuid(), $1, NOW(), NOW()) 
         RETURNING cms_page_id`,
        [post.status]
      );
      
      const pageId = insertPage.rows[0].cms_page_id;
      
      await client.query(
        `INSERT INTO cms_page_description 
         (cms_page_description_cms_page_id, url_key, name, content, meta_title, meta_description, meta_keywords) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          pageId,
          post.url_key,
          post.name,
          JSON.stringify([{id: 'row-1', size: 12, columns: [{id: 'col-1', size: 12, data: {type: 'html', content: `<p>${post.meta_description}</p>`}}]}]),
          post.meta_title,
          post.meta_description,
          ''
        ]
      );
      
      console.log('✅ Created:', post.name);
    }
    
    console.log(`\n✅ Successfully created ${samplePosts.length} blog posts`);
    await client.end();
  } catch (e) {
    console.error('❌ Error:', e.message);
    await client.end();
    process.exit(1);
  }
})();
