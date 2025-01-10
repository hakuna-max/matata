import { setupDocumentReady, initializeSvgAnimations } from 'js/animation/page-lost';
import { backToTop } from './utils/back-to-top';
import { initializeMermaid } from './utils/mermaid';
import { initProtectedContent } from './utils/protected-content';
import { initializeAllContainers } from './utils/d3';

import { setupMobileMenuToggle } from './utils/mobile-menu';

setupDocumentReady();
initializeSvgAnimations();
backToTop();
initializeMermaid();
initProtectedContent();
initializeAllContainers();
setupMobileMenuToggle();

