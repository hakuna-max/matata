import {
  setupDocumentReady,
  initializeSvgAnimations,
} from "js/animation/page-lost";
import { backToTop } from "./utils/back-to-top";
import { initializeMermaid } from "./utils/mermaid";

import { initProtectedContent } from "./shortcodes/protected-content";

import { setupMobileMenuToggle } from "./utils/mobile-menu";

import { initAuthorPhoto } from "./utils/draw-author-photo.js";

document.addEventListener("DOMContentLoaded", () => {
  setupDocumentReady();
  initializeSvgAnimations();
  backToTop();
  setupMobileMenuToggle();

  initializeMermaid();
  initProtectedContent();

  initAuthorPhoto();
});
