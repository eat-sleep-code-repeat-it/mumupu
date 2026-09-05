# transpose

- https://bpmfinder.net/
- https://www.splitmysong.com/my-songs
- https://github.com/Anjok07/ultimatevocalremovergui?tab=readme-ov-file
- https://voice.ai/tools/stem-splitter
- https://www.bandlab.com/splitter
- https://www.cakewalk.com/
- How to Practice the Chromatic SOLFEGE Scale Descending: https://www.youtube.com/watch?v=LE_ygZys1iM


## versions

- zhipu-transpose_v1.py old version
- zhipu-transpose_v2.py old version
- zhipu-transpose.py    current version

```js
// C   D   E   F   G   A   B   C  D   E   F   G   A   B    C
//   2   2   1   2   2   2   1   2  2   1   2   2   2    1 

// adjust 2 half-note up: C => D
python zhipu-transpose.py -a 2 -i songs/LondonderryAir.jps

// adjust -5 half-note down: F <= C 
python zhipu-transpose.py -a -5 -i songs/LondonderryAir.jps

// adjust -5 half-note down: G <= C 
python zhipu-transpose.py -a -7 -i songs/LondonderryAir.jps

```

$$

- [bpm-finder](https://myedit.online/en/audio-editor/bpm-finder)
- [Free Song Key and BPM Finder](https://voice.ai/tools/bpm-finder)
- [Realtime BPM Analyzer](https://www.npmjs.com/package/realtime-bpm-analyzer)
- [tempocnn 0.0.6](https://pypi.org/project/tempocnn/)

- https://www.flutenotation.com/