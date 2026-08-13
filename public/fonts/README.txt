Self-hosted webfonts
====================

Inter and Inter Tight, both variable ("wght" axis), latin and latin-ext
subsets, in WOFF2. Served from this repository rather than a font CDN so the
site has no third-party dependency on the critical rendering path and the
typography is identical on every device.

  inter-latin.woff2            Inter, latin        wght 300-800
  inter-latin-ext.woff2        Inter, latin-ext    wght 300-800
  inter-tight-latin.woff2      Inter Tight, latin      wght 400-900
  inter-tight-latin-ext.woff2  Inter Tight, latin-ext  wght 400-900

The latin-ext files carry the accented characters and extra currency signs,
including the rupee sign. They are only downloaded when a page actually uses
one of those characters, because each @font-face declares a unicode-range.

Both families are (c) The Inter Project Authors and are licensed under the
SIL Open Font License, Version 1.1 — see LICENSE.txt. Files were taken from
Google Fonts, which distributes them under the same licence.

The @font-face rules live at the top of /public/css/site.css.
