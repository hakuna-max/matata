import { setupDocumentReady, initializeSvgAnimations } from 'js/animation/page-lost';
import { backToTop } from './utils/back-to-top';
import { initializeMermaid } from './utils/mermaid';
import { initProtectedContent } from './utils/protected-content';

setupDocumentReady();
initializeSvgAnimations();
backToTop();
initializeMermaid();
initProtectedContent();

