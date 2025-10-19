-- Update EverShop navigation widget to use HAPAS Vietnamese categories
UPDATE widget 
SET settings = '{"menus": [{"id": "hapas_main_menu", "url": "javascript:void(0)", "name": "HAPAS FASHION ❤️", "type": "custom", "uuid": "javascript:void(0)", "children": [{"id": "set_bo", "url": "/set-bo", "name": "Set Bộ", "type": "category", "uuid": "/set-bo"}, {"id": "vay_dam", "url": "/vay-dam", "name": "Váy và Đầm", "type": "category", "uuid": "/vay-dam"}, {"id": "quan", "url": "/quan", "name": "Quần", "type": "category", "uuid": "/quan"}, {"id": "ao", "url": "/ao", "name": "Áo", "type": "category", "uuid": "/ao"}]}, {"id": "about_hapas", "url": "/page/about-us", "name": "Về HAPAS", "type": "custom", "uuid": "/page/about-us", "children": []}], "isMain": "1", "className": "hapas-main-navigation"}'
WHERE type = 'basic_menu';

-- Verify the update
SELECT name, settings FROM widget WHERE type = 'basic_menu';
