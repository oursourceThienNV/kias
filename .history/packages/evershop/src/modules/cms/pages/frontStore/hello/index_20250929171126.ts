import { setPageMetaInfo } from '../../../cms/services/pageMetaInfo.js';

export default async (request, response, next) => {
  setPageMetaInfo(request, {
    title: 'Hello',
    description: 'Simple demo page'
  });
  next();
};
