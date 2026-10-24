"use client";

import { useRef, useState } from "react";

type CircleKey = {
  major: string;
  minor: string;
  signature: string;
  signatureCount: number;
  root: number;
};

const keys: CircleKey[] = [
  { major: "C", minor: "Am", signature: "No sharps or flats", signatureCount: 0, root: 0 },
  { major: "G", minor: "Em", signature: "1 sharp", signatureCount: 1, root: 7 },
  { major: "D", minor: "Bm", signature: "2 sharps", signatureCount: 2, root: 2 },
  { major: "A", minor: "F♯m", signature: "3 sharps", signatureCount: 3, root: 9 },
  { major: "E", minor: "C♯m", signature: "4 sharps", signatureCount: 4, root: 4 },
  { major: "B", minor: "G♯m", signature: "5 sharps", signatureCount: 5, root: 11 },
  { major: "F♯", minor: "D♯m", signature: "6 sharps", signatureCount: 6, root: 6 },
  { major: "D♭", minor: "B♭m", signature: "5 flats", signatureCount: -5, root: 1 },
  { major: "A♭", minor: "Fm", signature: "4 flats", signatureCount: -4, root: 8 },
  { major: "E♭", minor: "Cm", signature: "3 flats", signatureCount: -3, root: 3 },
  { major: "B♭", minor: "Gm", signature: "2 flats", signatureCount: -2, root: 10 },
  { major: "F", minor: "Dm", signature: "1 flat", signatureCount: -1, root: 5 },
];

const majorScale = [0, 2, 4, 5, 7, 9, 11];
const minorScale = [0, 2, 3, 5, 7, 8, 10];
const majorQualities = ["major", "minor", "minor", "major", "major", "minor", "diminished"];
const minorQualities = ["minor", "diminished", "major", "minor", "minor", "major", "major"];
const majorNumerals = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];
const minorNumerals = ["i", "ii°", "III", "iv", "v", "VI", "VII"];
const majorFunctions = ["主音", "上主音", "中音", "下属音", "属音", "下中音", "导音"];
const minorFunctions = ["主音", "上主音", "中音", "下属音", "属音", "下中音", "导音"];
const sharpNotes = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
const flatNotes = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];
const sharpStaffPositions = [-14, -3.5, -17.5, -7, 3.5, -10.5, 0];
const flatStaffPositions = [0, -10.5, 3.5, -7, 7, -3.5, 10.5];

type Chord = {
  numeral: string;
  quality: string;
  notes: string[];
  pitches: number[];
};

function buildChords(key: CircleKey, isMinor: boolean): Chord[] {
  const root = (key.root + (isMinor ? 9 : 0)) % 12;
  const scale = isMinor ? minorScale : majorScale;
  const qualities = isMinor ? minorQualities : majorQualities;
  const numerals = isMinor ? minorNumerals : majorNumerals;
  const noteNames = key.signatureCount < 0 ? flatNotes : sharpNotes;

  return scale.map((degree, index) => {
    const pitches = [0, 2, 4].map(
      (offset) => (root + scale[(index + offset) % 7] + (index + offset >= 7 ? 12 : 0)) % 12,
    );
    return {
      numeral: numerals[index],
      quality: qualities[index],
      notes: pitches.map((pitch) => noteNames[pitch]),
      pitches,
    };
  });
}

const center = 260;
const segmentAngle = 360 / keys.length;

function pointAt(radius: number, angle: number): [number, number] {
  const radians = (angle * Math.PI) / 180;
  const roundCoordinate = (value: number) => Number(value.toFixed(3));
  return [
    roundCoordinate(center + radius * Math.sin(radians)),
    roundCoordinate(center - radius * Math.cos(radians)),
  ];
}

function segmentPath(outerRadius: number, innerRadius: number, index: number): string {
  const startAngle = index * segmentAngle - segmentAngle / 2 + 1;
  const endAngle = index * segmentAngle + segmentAngle / 2 - 1;
  const [outerStartX, outerStartY] = pointAt(outerRadius, startAngle);
  const [outerEndX, outerEndY] = pointAt(outerRadius, endAngle);
  const [innerEndX, innerEndY] = pointAt(innerRadius, endAngle);
  const [innerStartX, innerStartY] = pointAt(innerRadius, startAngle);

  return [
    `M ${outerStartX} ${outerStartY}`,
    `A ${outerRadius} ${outerRadius} 0 0 1 ${outerEndX} ${outerEndY}`,
    `L ${innerEndX} ${innerEndY}`,
    `A ${innerRadius} ${innerRadius} 0 0 0 ${innerStartX} ${innerStartY}`,
    "Z",
  ].join(" ");
}

function labelPoint(radius: number, index: number): [number, number] {
  return pointAt(radius, index * segmentAngle);
}

export default function CircleOfFifths() {
  const [selected, setSelected] = useState({ index: 0, isMinor: false });
  const [showSignatures, setShowSignatures] = useState(true);
  const [clef, setClef] = useState<"treble" | "bass">("treble");
  const audioContextRef = useRef<AudioContext | null>(null);
  const selectedKey = keys[selected.index];
  const selectedName = selected.isMinor ? selectedKey.minor : selectedKey.major;
  const relativeName = selected.isMinor ? selectedKey.major : selectedKey.minor;
  const chords = buildChords(selectedKey, selected.isMinor);
  const selectedPitch = (selectedKey.root + (selected.isMinor ? 9 : 0)) % 12;
  const parallelKey = selected.isMinor
    ? keys.find((key) => key.root === selectedPitch)
    : keys.find((key) => (key.root + 9) % 12 === selectedPitch);
  const parallelName = selected.isMinor ? parallelKey?.major : parallelKey?.minor;
  const degreeMarkers = chords.map((chord) => {
    const isMajorChord = chord.quality === "major";
    const keyIndex = isMajorChord
      ? keys.findIndex((key) => key.root === chord.pitches[0])
      : keys.findIndex((key) => (key.root + 9) % 12 === chord.pitches[0]);
    return {
      keyIndex,
      isMinor: !isMajorChord,
      numeral: chord.numeral,
    };
  });

  function playChord(chord: Chord) {
    const AudioContextConstructor = window.AudioContext;
    const audioContext = audioContextRef.current ?? new AudioContextConstructor();
    audioContextRef.current = audioContext;
    void audioContext.resume();

    for (const pitch of chord.pitches) {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const registerOffset = clef === "bass" ? -12 : 0;
      oscillator.frequency.value = 261.63 * 2 ** ((pitch + registerOffset) / 12);
      oscillator.type = "triangle";
      gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, audioContext.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1.1);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 1.12);
    }
  }

  return (
    <section aria-labelledby="circle-heading" className="mt-12 border-t border-gray-300 pt-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 id="circle-heading" className="text-2xl font-semibold">
            五度圈
          </h2>
          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <label className="sr-only" htmlFor="circle-clef">谱号</label>
            <select
              id="circle-clef"
              value={clef}
              onChange={(event) => setClef(event.target.value as "treble" | "bass")}
              className="border border-gray-300 bg-white px-2 py-1.5 text-sm"
            >
              <option value="treble">高音谱号</option>
              <option value="bass">低音谱号</option>
            </select>
            <button
              type="button"
              onClick={() => setShowSignatures((visible) => !visible)}
              aria-pressed={showSignatures}
              className="border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100"
            >
              {showSignatures ? "隐藏调号" : "显示调号"}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100"
            >
              保存为 PDF 文件
            </button>
          </div>
        </div>
        <p className="mb-6 text-sm text-gray-600">
          Major keys move clockwise by fifths; each inner key is its relative minor.
          Select a key to explore its diatonic chords.
        </p>
        <div className="mx-auto w-full max-w-xl">
          <svg
            viewBox="0 0 520 520"
            role="group"
            aria-label="Interactive circle of fifths"
            className="block h-auto w-full"
          >
            {showSignatures && keys.map((key, index) => (
              <path
                key={`signature-band-${key.major}`}
                d={segmentPath(246, 176, index)}
                fill="#f3f3f3"
                stroke="#ffffff"
                strokeWidth="2"
                aria-hidden="true"
              />
            ))}
            {showSignatures && keys.map((key, index) => {
              const accidentals = Math.abs(key.signatureCount);
              const isSharp = key.signatureCount > 0;
              const positions = isSharp ? sharpStaffPositions : flatStaffPositions;
              const [staffX, staffY] = labelPoint(211, index);

              return (
                <g
                  key={`staff-${key.major}`}
                  transform={`translate(${staffX} ${staffY})`}
                  aria-hidden="true"
                  className="pointer-events-none fill-gray-900"
                >
                  {[-14, -7, 0, 7, 14].map((y) => (
                    <line key={y} x1="-31" y1={y} x2="31" y2={y} stroke="#505050" strokeWidth="0.8" />
                  ))}
                  <text
                    x="-31"
                    y="5"
                    fontSize="37"
                    fontFamily="serif"
                    textAnchor="middle"
                  >
                    {clef === "treble" ? "𝄞" : "𝄢"}
                  </text>
                  {Array.from({ length: accidentals }, (_, accidentalIndex) => (
                    <text
                      key={accidentalIndex}
                      x={-12 + accidentalIndex * 6.4}
                      y={positions[accidentalIndex] + 4}
                      fontSize={isSharp ? "13" : "17"}
                      fontFamily="serif"
                      textAnchor="middle"
                    >
                      {isSharp ? "♯" : "♭"}
                    </text>
                  ))}
                </g>
              );
            })}
            {keys.map((key, index) => {
              const isSelected = selected.index === index && !selected.isMinor;
              const [labelX, labelY] = labelPoint(showSignatures ? 139 : 201, index);
              return (
                <g key={`major-${key.major}`}>
                  <path
                    d={showSignatures
                      ? segmentPath(176, 103, index)
                      : segmentPath(246, 157, index)}
                    fill={isSelected ? "#70a94f" : "#75aa52"}
                    stroke="#ffffff"
                    strokeWidth="2"
                    role="button"
                    tabIndex={0}
                    aria-label={`${key.major} major, ${key.signature}`}
                    aria-pressed={isSelected}
                    onClick={() => setSelected({ index, isMinor: false })}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelected({ index, isMinor: false });
                      }
                    }}
                    className="cursor-pointer outline-none focus:stroke-gray-900"
                  />
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="pointer-events-none fill-white text-[18px] font-semibold"
                  >
                    {key.major}
                  </text>
                </g>
              );
            })}
            {keys.map((key, index) => {
              const isSelected = selected.index === index && selected.isMinor;
              const [labelX, labelY] = labelPoint(showSignatures ? 78 : 113, index);
              return (
                <g key={`minor-${key.minor}`}>
                  <path
                    d={showSignatures
                      ? segmentPath(101, 60, index)
                      : segmentPath(151, 75, index)}
                    fill={isSelected ? "#c8ddae" : "#d8e8c6"}
                    stroke="#ffffff"
                    strokeWidth="2"
                    role="button"
                    tabIndex={0}
                    aria-label={`${key.minor} minor, relative to ${key.major} major`}
                    aria-pressed={isSelected}
                    onClick={() => setSelected({ index, isMinor: true })}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelected({ index, isMinor: true });
                      }
                    }}
                    className="cursor-pointer outline-none focus:stroke-gray-900"
                  />
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="pointer-events-none fill-gray-900 text-[15px] font-medium"
                  >
                    {key.minor}
                  </text>
                </g>
              );
            })}
            {degreeMarkers.map((marker) => {
              if (marker.keyIndex < 0) {
                return null;
              }
              const radius = marker.isMinor
                ? showSignatures ? 91 : 141
                : showSignatures ? 164 : 224;
              const [badgeX, badgeY] = labelPoint(radius, marker.keyIndex);

              return (
                <g key={`degree-${marker.numeral}`} aria-hidden="true" className="pointer-events-none">
                  <circle cx={badgeX} cy={badgeY} r="11" fill="#ffd66b" />
                  <text
                    x={badgeX}
                    y={badgeY + 0.5}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="fill-gray-800 text-[10px] font-medium"
                  >
                    {marker.numeral}
                  </text>
                </g>
              );
            })}
            <circle cx={center} cy={center} r={showSignatures ? 59 : 69} fill="#fff" />
          </svg>
        </div>
        <div className="mt-5 border border-gray-300 bg-gray-100 text-sm" aria-live="polite">
          <p className="border-b border-gray-300 px-3 py-2 font-semibold">
            大小调：{selectedName}{selected.isMinor ? "小调" : "大调"}
          </p>
          <p className="px-3 py-2">
            关系大小调：{relativeName}{selected.isMinor ? "大调" : "小调"}。平行大小调：
            {parallelName}{selected.isMinor ? "大调" : "小调"}。
          </p>
        </div>
        <div className="mt-4 overflow-x-auto border border-gray-300 bg-gray-100">
          <table className="w-full min-w-[560px] table-fixed border-collapse text-center text-sm">
            <caption className="border-b border-gray-300 px-3 py-2 text-left font-semibold">
              和弦：{selectedName}{selected.isMinor ? "小调" : "大调"}
            </caption>
            <tbody>
              <tr>
                {chords.map((chord) => (
                  <th key={chord.numeral} scope="col" className="border-r border-gray-300 px-2 py-2 font-medium">
                    {chord.numeral}
                  </th>
                ))}
              </tr>
              <tr>
                {(selected.isMinor ? minorFunctions : majorFunctions).map((name, index) => (
                  <td key={`${name}-${index}`} className="border-r border-t border-gray-300 px-2 py-2 text-xs">
                    {name}
                  </td>
                ))}
              </tr>
              <tr>
                {chords.map((chord) => {
                  const qualitySuffix = chord.quality === "minor" ? "m" : chord.quality === "diminished" ? "°" : "";
                  const chordName = `${chord.notes[0]}${qualitySuffix}`;
                  return (
                    <td key={chord.numeral} className="border-r border-t border-gray-300 px-2 py-2">
                      <button
                        type="button"
                        onClick={() => playChord(chord)}
                        aria-label={`Play ${chordName} chord in ${clef} register`}
                        className="font-medium text-teal-800 underline decoration-transparent underline-offset-2 hover:decoration-current focus:decoration-current print:hidden"
                      >
                        {chordName}
                      </button>
                      <span className="hidden font-medium print:inline">{chordName}</span>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
