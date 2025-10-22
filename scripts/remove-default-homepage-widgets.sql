-- Remove default homepage widgets created by Version-1.1.1 migration
-- Run this script to clean up unwanted widgets on homepage

BEGIN;

-- Show widgets before deletion
SELECT widget_id, name, type, route, area, status 
FROM widget 
WHERE name IN ('Featured categories', 'Featured Products', 'Main banner')
ORDER BY name;

-- Delete the unwanted homepage widgets
DELETE FROM widget 
WHERE name IN (
  'Featured categories',  -- TextBlock widget with kids/women/men shoes
  'Featured Products',    -- Collection products widget
  'Main banner'           -- Banner widget (if exists)
);

-- Show remaining widgets
SELECT widget_id, name, type, route, area, status 
FROM widget 
ORDER BY sort_order;

COMMIT;

-- Note: Main menu widget is kept as it's needed for navigation in header area

