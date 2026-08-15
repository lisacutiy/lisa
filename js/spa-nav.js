/* =========================================================
   PROPOSAL APP - SHARED SPA NAVIGATION HELPER
   File: /js/spa-nav.js

   When a page runs INSIDE the app.html shell (in an iframe),
   navigation is handled by the shell's router: a smooth
   crossfade with no white flash, no bfcache freeze, and proper
   Back/Forward-button support.

   When a page is opened on its own (standalone), it falls back
   to a normal page navigation, so every page still works alone.
========================================================= */

(function (window) {
    "use strict";

    /**
     * @param {number} screen      Target screen number (1-9).
     * @param {string} fallbackUrl URL to use when not running in the shell.
     */
    window.spaNav = function (screen, fallbackUrl) {
        try {
            if (
                window.top &&
                window.top !== window.self &&
                window.top.SPA &&
                typeof window.top.SPA.go === "function"
            ) {
                window.top.SPA.go(screen);
                return;
            }
        } catch (error) {
            /* Cross-origin or shell unavailable — fall through. */
        }

        window.location.assign(fallbackUrl);
    };

})(window);
