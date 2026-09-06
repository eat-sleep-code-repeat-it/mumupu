音乐：glyph = 音乐符号的图形，例如 ♩、♪、♯ 等

tuplet = 连音（组）
Triplet（三连音） = 三连音
在原本 2 个音符的时间里演奏 3 个音符。
Duplet（二连音） = 二连音
Quintuplet（五连音） = 五连音
Sextuplet（六连音） = 六连音

The bug is now clear: notes overlap at identical x-coordinates (239.73 appears twice, 351.67 appears twice), and bar1's width is ~44px too wide. This points to a stepping/cache bug in the grouped-note width calculation. Let me find that logic.