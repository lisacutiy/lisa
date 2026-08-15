/* =========================================================
   PROPOSAL APP - SHARED PAGE LIFECYCLE
   Root-level file: /lifecycle.js

   Purpose:
   - Safely manage page-owned timers.
   - Cancel stale callbacks when mobile Back/Forward restores a page.
   - Avoid changing any visual behavior.
========================================================= */

(function (window) {
    "use strict";

    const timerIds = new Set();

    /*
     * IMPORTANT (mobile):
     * A scheduled timeout must RUN unless it was explicitly cleared.
     * The previous "skip when visibilityState === hidden" check silently
     * dropped navigation callbacks, because Android reports the page as
     * "hidden" during ordinary taps/transitions. That left pages frozen
     * (a queued page change simply never happened). Timers are cancelled
     * deterministically via clear()/clearAll() instead.
     */
    function timeout(callback, delay) {
        const id = window.setTimeout(function () {
            timerIds.delete(id);

            try {
                callback();
            } catch (error) {
                console.error("PageLifecycle timeout error:", error);
            }
        }, Math.max(0, Number(delay) || 0));

        timerIds.add(id);
        return id;
    }

    function interval(callback, delay) {
        const id = window.setInterval(function () {
            try {
                callback();
            } catch (error) {
                console.error("PageLifecycle interval error:", error);
            }
        }, Math.max(1, Number(delay) || 1));

        timerIds.add(id);
        return id;
    }

    function clear(id) {
        if (id == null) return;

        window.clearTimeout(id);
        window.clearInterval(id);
        timerIds.delete(id);
    }

    function clearAll() {
        timerIds.forEach(function (id) {
            window.clearTimeout(id);
            window.clearInterval(id);
        });

        timerIds.clear();
    }

    function isCurrent() {
        return document.visibilityState !== "hidden";
    }

    window.PageLifecycle = {
        timeout,
        interval,
        clear,
        clearAll,
        isCurrent
    };

    /*
     * pagehide is intentionally NOT used here to automatically
     * clear everything. Individual pages decide what should be
     * cancelled so normal browser navigation remains predictable.
     */
})(window);
