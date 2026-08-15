/* =========================================================
   PROPOSAL APP - SHARED MEDIA MANAGER
   File: /js/media.js

   Timer audio is intended for Pages 2-7 only.
   Page 8/9 do not start the timer through this manager.
========================================================= */

(function (window) {
    "use strict";

    const TIMER_DURATION = 7000;
    const TIMER_AUDIO_SRC = "./assets/audio/idle-question.mp3";

    let timerId = null;
    let timerStartedAt = 0;
    let timerPlayed = false;
    let timerEnabled = false;
    let currentAudio = null;

    let unlockPromise = null;

    function getAudio() {
        if (!currentAudio) {
            currentAudio = new Audio();
            currentAudio.preload = "auto";
            currentAudio.playsInline = true;
        }

        if (currentAudio.src !== new URL(TIMER_AUDIO_SRC, window.location.href).href) {
            currentAudio.src = TIMER_AUDIO_SRC;
        }

        return currentAudio;
    }

    function stopTimer() {
        if (timerId !== null) {
            window.clearTimeout(timerId);
            timerId = null;
        }

        timerStartedAt = 0;
    }

    function stopAudio() {
        if (!currentAudio) return;

        try {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        } catch (error) {
            console.warn("MediaManager stopAudio:", error);
        }
    }

    function stop() {
        stopTimer();
        stopAudio();
    }

    function unlock() {
        if (unlockPromise) return unlockPromise;

        unlockPromise = new Promise(function (resolve) {
            let finished = false;

            function done() {
                if (finished) return;
                finished = true;
                resolve(true);
            }

            const audio = getAudio();

            try {
                audio.muted = true;

                const playPromise = audio.play();

                if (playPromise && typeof playPromise.then === "function") {
                    playPromise.then(function () {
                        audio.pause();
                        audio.currentTime = 0;
                        audio.muted = false;
                        done();
                    }).catch(function () {
                        audio.muted = false;
                        done();
                    });
                } else {
                    audio.pause();
                    audio.currentTime = 0;
                    audio.muted = false;
                    done();
                }
            } catch (error) {
                audio.muted = false;
                done();
            }

            /*
             * Never allow unlock to block page navigation.
             */
            window.setTimeout(done, 350);
        });

        return unlockPromise;
    }

    function playTimerAudio() {
        if (!timerEnabled || timerPlayed) return;

        timerPlayed = true;

        const audio = getAudio();

        try {
            audio.currentTime = 0;
            audio.muted = false;

            const promise = audio.play();

            if (promise && typeof promise.catch === "function") {
                promise.catch(function (error) {
                    console.warn("Timer audio could not autoplay:", error);
                });
            }
        } catch (error) {
            console.warn("Timer audio error:", error);
        }
    }

    function startTimer(options) {
        options = options || {};

        const enabled = options.enabled !== false;
        const duration = Number(options.duration) > 0
            ? Number(options.duration)
            : TIMER_DURATION;

        stopTimer();

        timerEnabled = enabled;
        timerPlayed = false;

        if (!enabled) return;

        timerStartedAt = Date.now();

        timerId = window.setTimeout(function () {
            timerId = null;

            if (document.visibilityState === "hidden") {
                return;
            }

            playTimerAudio();
        }, duration);
    }

    function resetForNewQuestion(options) {
        stopTimer();
        stopAudio();

        timerPlayed = false;
        timerStartedAt = 0;

        options = options || {};

        if (options.enabled === false) {
            timerEnabled = false;
            return;
        }

        startTimer(options);
    }

    function pauseForHiddenPage() {
        /*
         * Do not consume the timer. It is restarted by the page's
         * pageshow handler, which is safer with mobile bfcache.
         */
        stopTimer();
        stopAudio();
    }

    /*
     * Backward-compatible aliases for the older page API.
     * Pages 2/3/4/7/8 call MediaManager.init(...) and MediaManager.reset().
     * Without these, init() throws "MediaManager.init is not a function",
     * which aborts the page script before its click listeners are attached.
     */
    function init(options) {
        options = options || {};

        startTimer({
            enabled: true,
            duration: Number(options.idleTime) > 0
                ? Number(options.idleTime)
                : TIMER_DURATION
        });
    }

    function reset() {
        resetForNewQuestion();
    }

    window.MediaManager = {
        TIMER_DURATION,
        init,
        reset,
        unlock,
        startTimer,
        resetForNewQuestion,
        stopTimer,
        stopAudio,
        pauseForHiddenPage,
        stop
    };

})(window);
