# TODO

## Current Unsolved Renderer Issues

- Replace the current full-width row normalization in `lib/translate.ts` with the oracle's compact dense-row spacing engine for slash-heavy exercise rows.
- Finish grouped-note cluster rendering so grouped rows match oracle geometry, including double-curve slur shapes and grouped-count glyph placement.
- Embed and emit grouped count glyph defs such as `lianyin_shuzi_3` and `lianyin_shuzi_4` in the same structure and ordering the oracle uses.
- Finish parity for `public/jps-files/example-002-sandumojin.jps`; grouped tuplets moved closer, but dense-row spacing and grouped decoration are still not exact.
- Finish parity for `public/jps-files/memory-from-cats.jps`; it remains the largest unresolved score and depends on the same dense-row and complex-notation layout gaps.
- Re-run repo parity after each dense-row/layout fix until `public/jps-files` is fully clean again.

## Oracle Cache

- Remote oracle SVG snapshots are now cached locally under `oracle-cache/jps-files/` and `oracle-cache/songs/`.
- Each cached file uses the original JPS filename plus `.svg`, for example `oracle-cache/songs/WaltzNo2.jps.svg`.
- Treat the cache as a convenience snapshot, not as the authoritative source of truth.

## Songs Folder Parity Mismatches

Status on 2026-08-19: checked 37 JPS files in `public/songs`; mismatches found in 37 of 37.

- 047-keketuodemuyangren.jps
- Haydn-Serenade-AlternativeKey.jps
- Haydn-Serenade-Original.jps
- Londonderry-hanshan.jps
- Londonderry.jps
- LondonderryAir.jps
- WaltzNo2.jps
- always-zhoushen.jps
- baihualin.jps
- ganlanshu-qiyu.jps
- ganlanshu.jps
- guang-hui-sui-yue.jps
- hejiayi-F-Swan-lake-alternativekeys.jps
- hejiayi-F-Swan-lake.jps
- hejiayi-G-string-alternativeKeys.jps
- hejiayi-G-string-alternativeKeys2.jps
- hejiayi-G-string-original.jps
- hejiayi-barcarolle.jps
- hejiayi-dream-AlternativeKey.jps
- hejiayi-dream.jps
- hejiayi-swan-shengsan.jps
- hongyan.jps
- huangwensheng-G-string.jps
- muge.jps
- ren-jian-gong-ming-bB.jps
- ren-jian-gong-ming.jps
- sometime-when-it-rains-FixedDo.jps
- sometime-when-it-rains-FixedDoH.jps
- sometime-when-it-rains-FixedDoHK.jps
- sometime-when-it-rains.jps
- swan.jps
- tianyi.jps
- tuerqi-jinxingqu-A.jps
- tuerqi-jinxingqu.jps
- xiyangyang.jps
- yidongdexin.jps
- yinjie-mojin-daokou.jps

## Next Fix Order

- Fix the dense-row spacing engine first, because it affects both `example-002-sandumojin.jps` and many `public/songs` mismatches.
- Then finish grouped-note decoration parity.
- Then re-run songs parity and cluster remaining failures by notation pattern instead of file-by-file chasing.
