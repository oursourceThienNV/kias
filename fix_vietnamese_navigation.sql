-- Fix Vietnamese Navigation Widget Settings
-- This script fixes the corrupted Vietnamese characters in the basic_menu widget

UPDATE widget 
SET settings = '{
  "menus": [
    {
      "id": "hapas_main_menu",
      "name": "HAPAS FASHION ❤️",
      "url": "javascript:void(0)",
      "type": "custom",
      "uuid": "javascript:void(0)",
      "children": [
        {
          "id": "set_bo",
          "name": "Set Bộ",
          "url": "/set-bo",
          "type": "category",
          "uuid": "/set-bo"
        },
        {
          "id": "vay_dam", 
          "name": "Váy và Đầm",
          "url": "/vay-dam",
          "type": "category",
          "uuid": "/vay-dam"
        },
        {
          "id": "quan",
          "name": "Quần", 
          "url": "/quan",
          "type": "category",
          "uuid": "/quan"
        },
        {
          "id": "ao",
          "name": "Áo",
          "url": "/ao", 
          "type": "category",
          "uuid": "/ao"
        }
      ]
    },
    {
      "id": "about_hapas",
      "name": "Về HAPAS",
      "url": "/page/about-us",
      "type": "custom", 
      "uuid": "/page/about-us",
      "children": []
    }
  ],
  "isMain": "1",
  "className": "hapas-main-navigation"
}'::jsonb
WHERE type = 'basic_menu';
