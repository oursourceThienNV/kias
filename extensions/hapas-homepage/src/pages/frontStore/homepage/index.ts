/**
 * Homepage Middleware - HAPAS Theme
 * Sets context for HAPAS theme components
 */

import { readFile } from 'fs/promises';
import { join } from 'path';
import { pathToFileURL } from 'url';

export default async function homepageMiddleware(request, response, next) {
  try {
    // Convert path to file URL for cross-platform ES module compatibility (Windows fix)
    const contextHelperPath = join(process.cwd(), 'packages/evershop/dist/modules/graphql/services/contextHelper.js');
    const { setContextValue } = await import(pathToFileURL(contextHelperPath).href);
    
    // Load KIAS-HAPAS mapping config
    const configPath = join(process.cwd(), 'config', 'kias-hapas-mapping.json');
    const configContent = await readFile(configPath, 'utf-8');
    const mappingConfig = JSON.parse(configContent);
    
    // Set context values for theme components
    //setContextValue(request, 'kiasHapasMapping', mappingConfig);
    setContextValue(request, 'slides', mappingConfig.homepage?.hero?.slides || []);
    setContextValue(request, 'categoryTiles', mappingConfig.categoryMapping || []);
    
    next();
  } catch (e) {
    console.error('[HAPAS Homepage Middleware Error]:', e);
    next();
  }
}
