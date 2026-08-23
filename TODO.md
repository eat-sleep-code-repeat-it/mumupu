# TODO

## Current Unsolved Renderer Issues

- Finish parity for `public/jps-files/memory-from-cats.jps`; ordinary slurs, mixed-row beams, and long ties are implemented, but exact spacing still controls one path and five beam differences.
- Reserve oracle-compatible horizontal space for bar-attached temporary meter changes.
- Match spacing-dependent beam grouping, the remaining ordinary-slur path, and decoration definition/output ordering.
- Re-run `public/songs` parity after `memory-from-cats.jps` is clean, then cluster remaining failures by notation pattern.

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

- Replace full-width normalization with the spacing model used by `memory-from-cats.jps`, including temporary-meter width and beat-dependent gaps.
- Use the resulting note gaps to split isolated beams and render the two long ties with endpoint glyphs.
- Re-run songs parity and cluster remaining failures by notation pattern instead of file-by-file chasing.
