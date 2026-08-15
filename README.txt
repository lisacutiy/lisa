PROPOSAL APP - PAGE 5/6 MOBILE FIX

Repository placement:

/
  page5.html
  page6.html
  lifecycle.js
  js/
    media.js
  css/
    style.css

Required script paths inside page5/page6:
  ./lifecycle.js
  ./js/media.js

Page 6 -> Page 7 fix:
- navigation does not wait for audio playback
- "kahibini" audio is fire-and-forget
- "no" advances to page7
- yes keeps the destruction/end behavior
- stale timers are cancelled on pagehide/pageshow
- visuals are kept in the same design family

Replace page5.html, page6.html, lifecycle.js and js/media.js together.
Do not move lifecycle.js into js/.
