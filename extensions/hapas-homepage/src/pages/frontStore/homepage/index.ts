/**
 * Homepage Middleware - HAPAS Theme
 * Sets context for HAPAS theme components
 */

import { readFile } from 'fs/promises';
import { join } from 'path';

export default async function homepageMiddleware(request, response, next) {
  try {
    // Default mapping config in case file doesn't exist
    let mappingConfig = {
      homepage: {
        hero: {
          slides: []
        }
      },
      categoryMapping: []
    };
    
    try {
      // Try to load KIAS-HAPAS mapping config
      const configPath = join(process.cwd(), 'config', 'kias-hapas-mapping.json');
      const configContent = await readFile(configPath, 'utf-8');
      mappingConfig = JSON.parse(configContent);
    } catch (configError) {
      // Config file doesn't exist or is invalid, use defaults
      console.log('[HAPAS Homepage Middleware]: Using default config - kias-hapas-mapping.json not found');
    }
    
    // Set context values for theme components using direct assignment
    request.locals = request.locals || {};
    request.locals.context = request.locals.context || {};
    request.locals.context.slides = mappingConfig.homepage?.hero?.slides || [];
    request.locals.context.categoryTiles = mappingConfig.categoryMapping || [];
    
    next();
  } catch (e) {
    console.error('[HAPAS Homepage Middleware Error]:', e);
    next();
  }
}
