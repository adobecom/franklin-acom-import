import blockScripts from './rules/index.js';
import fileTypesBlockScript from './rules/creativecloud/file-types/index.js';
import toolsBlockScript from './rules/creativecloud/tools/index.js';

export default function fetchBlockScript(url) {
  let allScripts = {};
  switch (true) {
    case url.includes('/file-types/'):
      allScripts = {
        ...blockScripts,
        ...fileTypesBlockScript,
      };
      break;
    case url.includes('/creativecloud/'):
      allScripts = {
        ...blockScripts,
        ...toolsBlockScript,
      };
      break;
    default:
      allScripts = {
        ...blockScripts,
      };
  }
  return allScripts;
}
