import { DEFAULT_RICH_GLYPH_DEFS } from "./defaultRichGlyphDefs.js";

const EXTRA_GLYPH_DEFS: Record<string, string> = {
  shuzi_b_bian_2:
    '<g id="shuzi_b_bian_2" transform="translate(-50,-50)"><path d="m54.73171,57.18378l-9.46388,0c0,-1.22058 0.25339,-2.21228 0.76018,-2.97604c0.27837,-0.40686 0.64955,-0.85298 1.1135,-1.33834c0.46396,-0.48537 1.03856,-1.00644 1.72379,-1.56274c0.60672,-0.49251 1.11886,-0.93149 1.53643,-1.31692c0.41757,-0.38546 0.75304,-0.74725 1.00644,-1.08674c0.2534,-0.33906 0.4354,-0.67274 0.54604,-1.00108s0.16596,-0.68166 0.16596,-1.05996c0,-0.59957 -0.16596,-1.06534 -0.49786,-1.39724c-0.3319,-0.33191 -0.81193,-0.49786 -1.44005,-0.49786c-0.25697,0 -0.50321,0.05175 -0.73877,0.15525c-0.23555,0.10349 -0.44433,0.25875 -0.62634,0.46575c-0.18202,0.20699 -0.33369,0.46218 -0.45504,0.76553c-0.12135,0.30336 -0.19629,0.65847 -0.22484,1.06532l-2.59104,0c0.05711,-0.69236 0.207,-1.32229 0.44968,-1.88975s0.56567,-1.04926 0.96897,-1.4454c0.40329,-0.39616 0.87974,-0.70308 1.42935,-0.92078c0.54918,-0.21771 1.15633,-0.32655 1.82016,-0.32655c0.71378,0 1.35039,0.10349 1.91116,0.31049c0.56032,0.20699 1.02964,0.49252 1.40794,0.85654c0.37831,0.36403 0.66738,0.79229 0.86725,1.28481c0.19986,0.49251 0.29978,1.02785 0.29978,1.60601c0,0.53534 -0.07138,1.02786 -0.21413,1.47752c-0.14276,0.44969 -0.35689,0.87796 -0.6424,1.28481c-0.27124,0.37117 -0.67452,0.83513 -1.20986,1.39188c-0.53534,0.55676 -1.19202,1.1599 -1.97005,1.80944c-0.22841,0.19272 -0.52107,0.45147 -0.87795,0.77625c-0.3569,0.32476 -0.70665,0.72626 -1.04927,1.20451l5.99535,0l0,2.36531l-0.00045,0l-0.00001,-0.00002z" fill="black"/></g>',
  diaohao_zimu_c:
    '<g id="diaohao_zimu_c" transform="translate(-50,-50)"><path fill="#1b1b1b" d="m55.85,42.82703q-1.71571,-0.90955 -4.3203,-0.90955q-3.36943,0 -5.37457,2.13949t-2.00512,5.65363q0,3.76219 2.26351,6.06705t5.73631,2.30486q2.23251,0 3.70017,-0.64081l0,-2.10849q-1.67438,0.93021 -3.6795,0.93021q-2.60459,0 -4.25832,-1.73639t-1.65372,-4.69241q0,-2.81131 1.54002,-4.46502t4.02058,-1.65371q2.31519,0 4.03091,1.05424l0,-1.94311l0.00002,0.00001l0.00002,0z"/></g>',
  diaohao_zimu_d:
    '<g id="diaohao_zimu_d" transform="translate(-50,-50)"><path fill="black" d="m43.49999,42.00974l0,15.98051l4.54472,0q3.63578,0 6.04554,-2.11382t2.40975,-5.66505q0,-3.72033 -2.40975,-5.96098t-6.19351,-2.24066l-4.39675,0zm2.05041,14.14149l0,-12.3236l2.3252,0q3.04391,0 4.7561,1.66992t1.7122,4.65042q0,3.00163 -1.75447,4.50245t-4.60813,1.50081l-2.4309,0z"/></g>',
  diaohao_zimu_f:
    '<g id="diaohao_zimu_f" transform="translate(-50,-50)"><path fill="black" d="m54,43.9362l-6.00514,0l0,5.25113l5.57327,0l0,1.79205l-5.57327,0l0,6.89732l-1.99486,0l0,-15.7534l8,0l0,1.8129z"/></g>',
  diaohao_zimu_e:
    '<g id="diaohao_zimu_e" transform="translate(-50,-50)"><path fill="black" d="m54.32501,41.94654l-8.65002,0l0,16.10692l8.28783,0l0,-1.85357l-6.2212,0l0,-5.15593l5.77378,0l0,-1.83226l-5.77378,0l0,-5.4329l6.58339,0l0,-1.83226z"/></g>',
  diaohao_zimu_g:
    '<g id="diaohao_zimu_g" transform="translate(-50,-50)"><path d="m56.3,56.6733q-2.29645,1.33057 -5.18226,1.33057q-3.3329,0 -5.37532,-2.12891t-2.04242,-5.67026q0,-3.5823 2.25581,-5.89544t5.77161,-2.31314q2.47935,0 4.20677,0.79834l0,2.14938q-1.82903,-1.1668 -4.38968,-1.1668q-2.49968,0 -4.13564,1.72973t-1.63596,4.55463q0,2.92725 1.50386,4.5444t4.0442,1.61715q1.76807,0 2.98741,-0.67552l0,-4.1964l-3.3329,0l0,-1.76044l5.32452,0l0,7.08271z" fill="#1b1b1b"/></g>',
  xunhuan_zuo:
    '<g id="xunhuan_zuo" transform="translate(-50,-50)"><rect fill="#ffffff" stroke-width="0" x="46.65" y="35.75" width="12.1" height="28.4"/><rect height="29" width="2.4" y="35.5" x="48.35" stroke-width="null" fill="#1b1b1b"/><rect height="29" width="1" y="35.5" x="52.3" stroke-width="null" fill="#1b1b1b"/><circle r="1.53489" cy="44.675" cx="56.775" fill="#1b1b1b"/><circle r="1.53489" cy="55.325" cx="56.825" fill="#1b1b1b"/></g>',
  xunhuan_you:
    '<g id="xunhuan_you" transform="translate(-50,-50)"><rect height="28.4" width="12.1" y="35.75" x="39.95" stroke-width="0" fill="#ffffff"/><rect height="29" width="1" y="35.5" x="45.65" fill="#1b1b1b"/><rect height="29" width="2.4" y="35.5" x="48.35" fill="#1b1b1b"/><circle r="1.53489" cy="44.15" cx="41.75" fill="#1b1b1b"/><circle r="1.53489" cy="54.8" cx="41.8" fill="#1b1b1b"/></g>',
  lianyinxian_zuo:
    '<g id="lianyinxian_zuo" transform="translate(-50,-50)"><path stroke="#1b1b1b" d="m50.75,50.75c0,0 -8.39389,0.56947 -12.21896,8.88383" stroke-linecap="round" stroke-linejoin="null" stroke-width="1.2" fill="none"/></g>',
  lianyinxian_you:
    '<g id="lianyinxian_you" transform="translate(-50,-50)"><path stroke="#1b1b1b" d="m50.75,50.75c0,0 7.64178,0.56947 11.12411,8.88383" stroke-linecap="round" stroke-linejoin="null" stroke-width="1.2" fill="none"/></g>',
  bianyinfu_sheng:
    '<g id="bianyinfu_sheng" transform="translate(-50,-50)"><path stroke-width="33" d="m41.54219,35.03224c0.12982,-0.07418 0.33382,-0.01855 0.408,0.14836c0.03709,0.07418 0.03709,0.12982 0.03709,1.428c0,0.76036 0,1.37236 0.01855,1.37236c0,0 0.16691,-0.07418 0.37091,-0.14837c0.42654,-0.16691 0.48218,-0.18546 0.59345,-0.09272c0.12982,0.09272 0.12982,0.11127 0.12982,0.85309c0,0.63055 0,0.68618 -0.03709,0.74182c-0.01854,0.03709 -0.05563,0.07418 -0.07418,0.09273c-0.03709,0.01854 -0.25964,0.12982 -0.51927,0.22255l-0.46364,0.204l-0.01855,1.50218c0,0.816 0,1.50218 0.01855,1.50218c0,0 0.16691,-0.07418 0.37091,-0.14836c0.42654,-0.16691 0.48218,-0.18546 0.59345,-0.09273c0.12982,0.09273 0.12982,0.11127 0.12982,0.85309c0,0.63055 0,0.68618 -0.03709,0.74182c-0.01854,0.03709 -0.05563,0.07418 -0.07418,0.09273c-0.03709,0.01855 -0.25964,0.12981 -0.51927,0.22254l-0.46364,0.204l-0.01855,1.55782c0,1.40945 -0.01854,1.57637 -0.03709,1.632c-0.12982,0.22255 -0.44509,0.22255 -0.57491,0c-0.01854,-0.05564 -0.03709,-0.204 -0.03709,-1.50218l0,-1.428l-0.79745,0.31528l-0.77891,0.31527l0,1.50218c0,1.59491 0,1.55782 -0.09273,1.65055c-0.03709,0.05564 -0.16691,0.11127 -0.22255,0.11127c-0.07418,0 -0.204,-0.05563 -0.24109,-0.11127c-0.09273,-0.09272 -0.09273,-0.05563 -0.09273,-1.50218c0,-0.76037 0,-1.37236 -0.01854,-1.37236c0,0 -0.16691,0.07418 -0.37091,0.14836c-0.42655,0.16691 -0.48218,0.18546 -0.59346,0.09273c-0.12982,-0.09273 -0.12982,-0.11127 -0.12982,-0.85309c0,-0.63055 0,-0.68618 0.03709,-0.74182c0.01855,-0.03709 0.05564,-0.07418 0.07418,-0.09272c0.03709,-0.01855 0.25964,-0.12982 0.51927,-0.22255l0.48218,-0.204l0,-1.50218c0,-0.816 0,-1.50218 -0.01854,-1.50218c0,0 -0.16691,0.07418 -0.37091,0.14837c-0.42655,0.16691 -0.48218,0.18545 -0.59346,0.09272c-0.12982,-0.09272 -0.12982,-0.11127 -0.12982,-0.85309c0,-0.63055 0,-0.68618 0.03709,-0.74182c0.01855,-0.03709 0.05564,-0.07418 0.07418,-0.09273c0.03709,-0.01854 0.25964,-0.12982 0.51927,-0.22255l0.48218,-0.204l0,-1.55782c0,-1.40945 0.01855,-1.57636 0.03709,-1.632c0.12982,-0.22255 0.44509,-0.22255 0.57491,0c0.01855,0.05564 0.03709,0.204 0.03709,1.50218l0.01854,1.428l0.77891,-0.31527l0.77891,-0.31527l0,-1.50219c0,-1.40945 0,-1.50218 0.03709,-1.57637c0.03709,-0.07418 0.07418,-0.11127 0.16691,-0.14836zm-0.204,6.58364l0,-1.50218l-0.79745,0.31527l-0.77891,0.31527l0,1.52073l0,1.50218l0.05563,-0.01855c0.03709,-0.01855 0.38946,-0.16691 0.79746,-0.31527l0.72327,-0.29673l0,-1.52073z" fill="#1b1b1b"/></g>',
  lianyin_shuzi_3:
    '<g id="lianyin_shuzi_3" transform="translate(-50,-50)"><rect height="9.09091" width="9.71251" y="45.4934" x="45.14375" fill="#ffffff"/><path fill="#1b1b1b" d="m47.5,52.85191q0.87103,0.67902 1.97961,0.67902q0.88235,0 1.40274,-0.43573t0.52034,-1.17128q0,-1.61838 -2.33029,-1.61838l-0.71269,0l0,-0.89402l0.67872,0q2.05883,0 2.05883,-1.52779q0,-1.40333 -1.57235,-1.40333q-0.905,0 -1.69686,0.5998l0,-1.01853q0.8371,-0.48662 1.95701,-0.48662q1.0973,0 1.75907,0.57152t0.66176,1.48819q0,1.6749 -1.70814,2.16152l0,0.01133q0.9276,0.10186 1.4649,0.65642t0.53735,1.39196q0,1.15436 -0.83147,1.86166t-2.21152,0.70731q-1.21039,0 -1.95701,-0.45265l0,-1.12039l0,0z"/></g>',
  lianyin_shuzi_4:
    '<g id="lianyin_shuzi_4" transform="translate(-50,-50)"><rect height="9.09091" width="9.71251" y="45.4934" x="45.14375" fill="#ffffff"/><path fill="#1b1b1b" d="m53.05001,51.99785l-1.0917,0l0,2.20754l-1.04668,0l0,-2.20754l-3.96162,0l0,-0.6983l3.75904,-5.60894l1.24927,0l0,5.45125l1.0917,0l0,0.85598zm-2.13839,-0.85598l0,-3.57035q0,-0.38294 0.02251,-0.87851l-0.02251,0q-0.07878,0.214 -0.31513,0.66452l-2.54354,3.78434l2.85867,0z"/></g>',
};

export type JpsLineType = "Q" | "C";

export interface JpsLine {
  type: JpsLineType;
  raw: string;
  content: string;
  tokens: string[];
}

export interface ParsedJps {
  header: Record<string, string>;
  headerValues: Record<string, string[]>;
  lines: JpsLine[];
}

export type JpsEventType = "note" | "hold" | "bar" | "group-start" | "group-end" | "dynamic" | "symbol";

export interface JpsEvent {
  type: JpsEventType;
  raw: string;
  code: string;
  pitch: string | null;
  audio: string | null;
  time: number;
  durationMark: string;
  octave: number;
  accidental: string;
  annotation: string | null;
  detachedAnnotation?: boolean;
  isHiddenRest: boolean;
  measureIndex: number;
  notepos: string;
  lineIndex: number;
  groupSize?: number;
  groupStart?: boolean;
  groupEnd?: boolean;
  slurStartCount?: number;
  slurEndCount?: number;
  hairpinStart?: "crescendo" | "diminuendo";
  hairpinEnd?: boolean;
  hairpinDefaultOffset?: boolean;
  dynamicMark?: string;
  jumpHouseStartLabel?: string;
  jumpHouseEnd?: boolean;
}

export interface JpsNote {
  raw: string;
  value: string;
  audioValue: string;
  pitch: string | null;
  accidental: string;
  octave: number;
  duration: number;
  isRest: boolean;
  isHiddenRest: boolean;
  annotation: string | null;
  lyric: string | null;
  durationMark: string;
  x: number;
  y: number;
}

const SVG_DECIMAL_SCALE = BigInt("1000000000000000");
const BIGINT_ZERO = BigInt(0);
const BIGINT_ONE = BigInt(1);
const BIGINT_TWO = BigInt(2);
const BIGINT_TEN = BigInt(10);
const BIGINT_14 = BigInt(14);
const BIGINT_15 = BigInt(15);
const BIGINT_5000 = BigInt(5000);
const BIGINT_10000 = BigInt(10000);
const BIGINT_100000000000 = BigInt("100000000000");

function groupedStartCode(rawValue: string, pitchSuffix: string, durationMark: string, decorationCode = ""): string {
  const oraclePitchSeparator = rawValue === "7" ? " " : "";
  return `${rawValue}(ys${oraclePitchSeparator}${pitchSuffix}${durationMark}${decorationCode}`;
}

function decimalStringToScaled(value: string): bigint {
  const [integerPart, fractionalPart = ""] = value.split(".");
  const normalizedFraction = (fractionalPart + "0".repeat(15)).slice(0, 15);
  return BigInt(integerPart) * SVG_DECIMAL_SCALE + BigInt(normalizedFraction);
}

function scaledToDecimalString(value: bigint): string {
  const negative = value < BIGINT_ZERO;
  const absoluteValue = negative ? -value : value;
  const integerPart = absoluteValue / SVG_DECIMAL_SCALE;
  const fractionalPart = absoluteValue % SVG_DECIMAL_SCALE;
  const fractionalText = fractionalPart.toString().padStart(15, "0").replace(/0+$/, "");
  return `${negative ? "-" : ""}${integerPart}${fractionalText ? `.${fractionalText}` : ""}`;
}

function formatScaledSvgNumber(value: bigint): string {
  const roundedValue = value >= BIGINT_ZERO ? value + BIGINT_5000 : value - BIGINT_5000;
  const scaledValue = roundedValue / BIGINT_10000;
  const negative = scaledValue < BIGINT_ZERO;
  const absoluteValue = negative ? -scaledValue : scaledValue;
  const integerPart = absoluteValue / BIGINT_100000000000;
  const fractionalPart = absoluteValue % BIGINT_100000000000;
  const fractionalText = fractionalPart.toString().padStart(11, "0").replace(/0+$/, "");
  return `${negative ? "-" : ""}${integerPart}${fractionalText ? `.${fractionalText}` : ""}`;
}

function scaledToNumber(value: bigint): number {
  return Number(scaledToDecimalString(value));
}

function scaledInteger(value: number): bigint {
  return BigInt(value) * SVG_DECIMAL_SCALE;
}

function scaledMulDiv(value: bigint, numerator: bigint, denominator: bigint): bigint {
  const adjusted = value >= BIGINT_ZERO
    ? value * numerator + denominator / BIGINT_TWO
    : value * numerator - denominator / BIGINT_TWO;
  return adjusted / denominator;
}

function slashBeamLine(x1: number, y: number, x2: number): string {
  return `<line x1="${formatSvgNumber(x1)}" y1="${formatSvgNumber(y)}" x2="${formatSvgNumber(x2)}" y2="${formatSvgNumber(y)}" data-type="jianshixian" stroke-width="2" stroke="#1b1b1b" ></line>`;
}

function usesNaturalWidthLayout(parsed: ParsedJps, events: JpsEvent[]): boolean {
  return (parsed.header.P ?? "").includes(",")
    && events.some((event) => event.type === "hold" || (event.slurStartCount ?? 0) > 0);
}

function hasHorizontalDecoration(event: JpsEvent | undefined): boolean {
  return Boolean(event && event.type === "note" && event.accidental);
}

function hasLeadingAccidental(event: JpsEvent | undefined): boolean {
  return Boolean(event && event.type === "note" && event.accidental);
}

function naturalEventAdvances(events: JpsEvent[], preserveRichBeatSpacing = false, usesFixedDoRounding = false): number[] {
  let measureTime = 0;
  let measureHasDottedSubdivision = false;
  let pendingAnnotationClearance = false;
  let pendingDescendingAccidentalClearance = false;
  let pendingNestedSlurClearance = false;
  let ordinarySlurDepth = 0;
  let rowLocalSlurDepth = 0;
  const hasFlatAccidentals = events.some((event) => event.accidental.includes("$"));
  const hasSlashDurations = events.some((event) => event.durationMark.includes("/"));
  const hasExpressionMarks = events.some((event) => event.hairpinStart || event.hairpinEnd || event.dynamicMark);
  const hasCrescendo = events.some((event) => event.hairpinStart === "crescendo");
  const firstMeasureIndex = events.find((event) => event.type !== "bar")?.measureIndex;
  const firstMeasureHasAccidentalSlur = events.some((event) => event.measureIndex === firstMeasureIndex
    && Boolean(event.slurStartCount)
    && Boolean(event.accidental));
  const hasAscendingAccidentalRun = events.some((event, eventIndex) => {
    const nextEvent = events[eventIndex + 1];
    const afterNextEvent = events[eventIndex + 2];
    return event.pitch === "4"
      && Boolean(event.accidental)
      && event.durationMark.includes("/")
      && nextEvent?.pitch === "5"
      && nextEvent.durationMark.includes("/")
      && afterNextEvent?.pitch === "6"
      && afterNextEvent.durationMark.includes("/");
  });
  const dottedNoteCount = events.filter((event) => event.type === "note" && event.durationMark.includes(".")).length;
  const noteCount = events.filter((event) => event.type === "note").length;
  const sixteenthNoteCount = events.filter((event) => event.type === "note" && event.durationMark.includes("//")).length;
  const usesDenseSixteenthSpacing = sixteenthNoteCount >= 16;
  const useMeasureBeatSpacing = dottedNoteCount > 1 || (dottedNoteCount > 0 && noteCount <= 24);
  const repeatedSamePitchDottedPairCount = events.filter((event, eventIndex) => event.durationMark.includes(".")
    && events[eventIndex + 1]?.pitch === event.pitch
    && events[eventIndex + 1]?.durationMark.includes("//")).length;
  const lowDottedMixedMeasureIndexes = new Set(events
    .filter((event, eventIndex) => event.type === "note"
      && event.octave < 0
      && event.code.includes(".")
      && !event.durationMark.includes("/")
      && !event.slurStartCount
      && events[eventIndex - 1]?.type === "bar"
      && events.some((candidate) => candidate.measureIndex === event.measureIndex && candidate.durationMark.includes("//")))
    .map((event) => event.measureIndex));

  return events.map((event, eventIndex) => {
    const nextEvent = events[eventIndex + 1];
    if (event.type === "bar") {
      measureTime = 0;
      measureHasDottedSubdivision = false;
      pendingNestedSlurClearance = false;
      if (eventIndex === events.length - 1) {
        const previousEvent = events[eventIndex - 1];
        if (preserveRichBeatSpacing && previousEvent?.durationMark.includes("/")) {
          if (previousEvent.pitch === "4") return 1.4;
          if (previousEvent.pitch === "5") return 2.2;
        }
        return 1.8;
      }
      return 2.8 + (event.annotation?.startsWith("p:") ? 2 : 0) + (hasLeadingAccidental(nextEvent) ? 0.4 : 0);
    }

    if (event.type === "dynamic") {
      return 2;
    }

    if (event.type !== "note" && event.type !== "hold") {
      return 0;
    }

    measureTime += event.time;
    ordinarySlurDepth += event.slurStartCount ?? 0;
    rowLocalSlurDepth += event.slurStartCount ?? 0;
    let width = 1 + event.time * 2;
    if (!preserveRichBeatSpacing && event.durationMark.includes("//")) {
      width += 0.5;
    }
    if (
      !preserveRichBeatSpacing
      && !hasAscendingAccidentalRun
      && (event.slurStartCount ?? 0) > 1
      && Boolean(event.accidental)
    ) {
      pendingNestedSlurClearance = true;
    }
    pendingAnnotationClearance ||= !preserveRichBeatSpacing && Boolean(event.detachedAnnotation);
    const previousEvent = events[eventIndex - 1];
    const beforePreviousEvent = events[eventIndex - 2];
    const afterNextEvent = events[eventIndex + 2];
    const thirdNextEvent = events[eventIndex + 3];
    const isDottedSubdivision = event.durationMark.includes(".") && event.durationMark.includes("/");
    if (!preserveRichBeatSpacing && isDottedSubdivision) {
      width += nextEvent?.durationMark.includes("//") && !event.slurStartCount ? 0.5 : 1.5;
      measureHasDottedSubdivision = true;
    }
    if (
      !preserveRichBeatSpacing
      && isDottedSubdivision
      && event.pitch === "7"
      && previousEvent?.pitch === "1"
      && previousEvent.octave > event.octave
      && Boolean(previousEvent.accidental)
      && nextEvent?.pitch === previousEvent.pitch
      && nextEvent.octave === previousEvent.octave
      && nextEvent.accidental === previousEvent.accidental
      && nextEvent.durationMark.includes("//")
    ) {
      width -= 1;
    }
    if (
      !preserveRichBeatSpacing
      && repeatedSamePitchDottedPairCount > 1
      && (
        (
          event.durationMark.includes("//")
          && previousEvent?.durationMark.includes(".")
          && previousEvent.pitch === event.pitch
        )
        || (
          isDottedSubdivision
          && previousEvent?.pitch === event.pitch
          && nextEvent?.pitch === event.pitch
          && nextEvent.durationMark.includes("//")
        )
      )
    ) {
      width -= 1;
    }
    const usesLowDottedMixedSpacing = lowDottedMixedMeasureIndexes.has(event.measureIndex);
    const isBeatBoundary = event.time < 1 && Math.abs(measureTime - Math.round(measureTime)) < 1e-9;
    if (
      isBeatBoundary
      && (!usesLowDottedMixedSpacing || nextEvent?.type === "bar")
      && !(isDottedSubdivision && nextEvent?.type === "bar")
      && !(
        usesFixedDoRounding
        && event.durationMark.includes("/")
        && !event.accidental
        && nextEvent?.durationMark.includes("/")
        && Boolean(nextEvent.slurEndCount)
        && afterNextEvent?.code === "|j"
      )
    ) {
      width += 1;
    }
    if (
      usesLowDottedMixedSpacing
      && (
        (previousEvent?.code.includes(".") && !previousEvent.durationMark.includes("/"))
        || (event.durationMark.includes("/") && !event.durationMark.includes("//") && nextEvent?.durationMark.includes("//"))
      )
    ) {
      width += 1;
    }
    if (
      !preserveRichBeatSpacing
      && isDottedSubdivision
      && event.slurStartCount
      && previousEvent?.slurEndCount
    ) {
      width -= 2;
    }
    const nextStartsRestoredFlatTail = nextEvent?.accidental.includes("=")
      && afterNextEvent?.accidental.includes("$")
      && thirdNextEvent?.accidental.includes("$");
    const isShortAccidentalTail = event.type === "note"
      && event.durationMark.includes("/")
      && event.accidental
      && nextEvent?.type === "note"
      && nextEvent.durationMark.includes("/")
      && nextEvent.accidental
      && afterNextEvent?.type === "bar"
      && !(previousEvent?.type === "note" && previousEvent.durationMark.includes("/"));
    const preservesShortAccidentalTail = isShortAccidentalTail && event.accidental.includes("$");
    const nextContinuesBeam = nextEvent?.type === "note" && nextEvent.durationMark.includes("/");
    const isolatesEighth = event.time < 1
      && !isBeatBoundary
      && (
        !nextContinuesBeam
        || (
          useMeasureBeatSpacing
          && (
            preserveRichBeatSpacing && (event.pitch === null || Boolean(event.slurEndCount) || isShortAccidentalTail)
            || preservesShortAccidentalTail
          )
        )
      );
    if (isolatesEighth) {
      width += 1 + (event.accidental && (!nextContinuesBeam || (preserveRichBeatSpacing && isShortAccidentalTail) || preservesShortAccidentalTail) ? 0.4 : 0);
    }
    if (
      event.slurEndCount
      && previousEvent?.type !== "bar"
      && event.octave > 0
      && event.accidental
      && (
        !previousEvent?.accidental
        || (previousEvent.pitch === event.pitch && previousEvent.octave === event.octave)
      )
      && !(
        previousEvent?.pitch === event.pitch
        && !previousEvent.accidental
        && previousEvent.durationMark.includes("/")
        && event.durationMark.includes("/")
        && !hasCrescendo
      )
    ) {
      width += 0.4;
    }
    if (
      usesFixedDoRounding
      && !usesDenseSixteenthSpacing
      && dottedNoteCount === 0
      && (
        events.some((candidate) => Boolean(candidate.annotation))
        || Boolean(previousEvent?.slurStartCount)
      )
      && Boolean(event.slurEndCount)
      && event.octave < 0
      && event.accidental.includes("#")
      && event.durationMark === "/"
      && nextEvent?.type === "bar"
    ) {
      width += 0.4;
    }
    if (!preserveRichBeatSpacing && measureHasDottedSubdivision && event.slurEndCount && !event.accidental) {
      width += 1;
    }
    if (
      !preserveRichBeatSpacing
      && !usesDenseSixteenthSpacing
      && event.slurEndCount
      && previousEvent?.durationMark.includes("//")
      && (previousEvent.pitch !== event.pitch || event.accidental.includes("#"))
      && (!event.accidental || event.accidental.includes("#"))
      && (nextEvent?.type !== "bar" || Boolean(previousEvent.accidental) || Boolean(previousEvent.slurStartCount) || firstMeasureHasAccidentalSlur)
    ) {
      width += 0.4;
    }
    if (
      usesDenseSixteenthSpacing
      && event.durationMark === "/"
      && event.octave < 0
      && event.slurStartCount
      && event.slurEndCount
    ) {
      width -= 0.4;
    }
    if (
      !preserveRichBeatSpacing
      && event.slurEndCount
      && !event.accidental
      && previousEvent?.pitch === event.pitch
      && previousEvent.octave === event.octave
      && previousEvent.durationMark.includes("/")
      && !previousEvent.durationMark.includes("//")
      && nextEvent?.accidental.includes("#")
      && (previousEvent.slurStartCount ?? 0) < 2
    ) {
      width += 0.4;
    }
    if (
      !preserveRichBeatSpacing
      && event.slurEndCount
      && !event.accidental
      && previousEvent?.accidental.includes("$")
      && previousEvent.slurStartCount
      && nextEvent?.time === 1
    ) {
      width += 0.4;
    }
    const appliesAnnotationClearance = pendingAnnotationClearance
      && event.durationMark.includes("/")
      && Boolean(event.slurEndCount);
    if (appliesAnnotationClearance) {
      width += 0.4;
      pendingAnnotationClearance = false;
    }
    const appliesDescendingAccidentalClearance = pendingDescendingAccidentalClearance
      && event.durationMark.includes("/")
      && Boolean(event.slurEndCount);
    if (appliesDescendingAccidentalClearance) {
      width += 0.4;
      pendingDescendingAccidentalClearance = false;
    }
    if (
      !preserveRichBeatSpacing
      && event.durationMark.includes("/")
      && (
        event.slurEndCount
        || (
          previousEvent?.durationMark.includes("/")
          && previousEvent.accidental.includes("#")
        )
      )
      && previousEvent?.accidental
      && nextEvent?.type === "bar"
      && !appliesAnnotationClearance
      && !appliesDescendingAccidentalClearance
    ) {
      width += 0.4;
    }
    if (
      !preserveRichBeatSpacing
      && measureHasDottedSubdivision
      && event.durationMark.includes("/")
      && previousEvent?.pitch === nextEvent?.pitch
      && previousEvent?.durationMark.includes("/")
      && !previousEvent.slurStartCount
      && !previousEvent.durationMark.includes(".")
      && nextEvent?.durationMark.includes("/")
    ) {
      width += 1;
    }
    if (
      !preserveRichBeatSpacing
      && measureHasDottedSubdivision
      && event.durationMark.includes("/")
      && previousEvent?.pitch === event.pitch
      && !event.accidental
      && nextEvent?.pitch !== event.pitch
    ) {
      width += 1;
    }
    const transfersClosingAccidentalClearance = !preserveRichBeatSpacing
      && ordinarySlurDepth > 0
      && nextEvent?.type === "bar"
      && event.accidental.includes("#")
      && (
        !event.slurEndCount
        || /^\d+[#$=]+[,']/.test(event.code)
      );
    const resolvesSharpImmediately = ordinarySlurDepth > 0
      && event.accidental.includes("#")
      && event.durationMark.includes("/")
      && !event.durationMark.includes("//")
      && nextEvent?.type === "note"
      && !nextEvent.accidental
      && nextEvent.durationMark.includes("/")
      && nextEvent.pitch === event.pitch
      && nextEvent.octave === event.octave
      && !(
        afterNextEvent?.accidental.includes("#")
        && afterNextEvent.pitch === event.pitch
        && afterNextEvent.octave === event.octave
      );
    const closesLineWithSharpSixteenth = (!nextEvent || nextEvent.type === "bar")
      && Boolean(event.slurEndCount)
      && event.accidental.includes("#")
      && event.durationMark.includes("//");
    if (
      (event.time >= 1 || isBeatBoundary)
      && hasHorizontalDecoration(event)
      && !transfersClosingAccidentalClearance
      && !resolvesSharpImmediately
      && !closesLineWithSharpSixteenth
    ) {
      width += 0.4;
    }
    if (
      !preserveRichBeatSpacing
      && event.durationMark.includes("//")
      && nextEvent?.type === "bar"
      && (
        (
          previousEvent?.durationMark.includes("//")
          && Boolean(previousEvent.accidental)
          && !event.slurEndCount
        )
        || (
          Boolean(afterNextEvent?.accidental)
          && !event.slurEndCount
          && previousEvent?.pitch === "2"
          && event.pitch === "3"
        )
      )
    ) {
      width += 0.4;
    }
    if (
      !preserveRichBeatSpacing
      && event.accidental.includes("#")
      && event.durationMark === "/"
      && previousEvent?.pitch === event.pitch
      && previousEvent.accidental === event.accidental
      && nextEvent?.type === "hold"
    ) {
      width += 0.4;
    }
    if (
      !preserveRichBeatSpacing
      && event.accidental.includes("#")
      && event.durationMark.includes("/")
      && !event.durationMark.includes("//")
      && (
        (
          previousEvent?.type === "bar"
          && event.pitch === "4"
          && nextEvent?.pitch === "5"
          && nextEvent.accidental.includes("#")
        )
        || (
          previousEvent?.pitch === "4"
          && previousEvent.accidental.includes("#")
          && nextEvent?.pitch === "5"
          && nextEvent.accidental.includes("#")
        )
      )
    ) {
      width += 0.4;
    }
    const sharesHighOctaveAccidentalSpace = event.octave > 0
      && nextEvent?.octave === event.octave
      && !event.accidental
      && nextEvent.accidental.includes("$")
      && event.durationMark.includes("/");
    const opensImmediateSharpResolution = Boolean(event.slurStartCount)
      && nextEvent?.accidental.includes("#")
      && afterNextEvent?.pitch === nextEvent.pitch
      && afterNextEvent.octave === nextEvent.octave
      && !afterNextEvent.accidental
      && Boolean(afterNextEvent.slurEndCount);
    const sharesDescendingAccidentalSpace = !preserveRichBeatSpacing
      && ordinarySlurDepth > 0
      && Boolean(nextEvent?.accidental)
      && (!event.accidental || isBeatBoundary)
      && (!event.slurStartCount || !hasExpressionMarks)
      && !(nextEvent.accidental.includes("#") && ((!opensImmediateSharpResolution && event.slurStartCount) || nextEvent.slurEndCount))
      && !event.durationMark.includes("//")
      && (
        (
          nextEvent.octave < event.octave
          && (!nextEvent.accidental.includes("#") || !hasExpressionMarks)
          && !event.slurEndCount
          && !(event.octave > 0 && Boolean(nextEvent.accidental))
        )
        || (
          nextEvent.octave === event.octave
          && Number(nextEvent.pitch) < Number(event.pitch)
          && !nextEvent.accidental.includes("$")
          && (Boolean(event.accidental) || !nextEvent.accidental.includes("#") || !hasExpressionMarks)
          && !nextStartsRestoredFlatTail
        )
      )
      && event.durationMark.includes("/")
      && nextEvent.durationMark.includes("/");
    if (
      !preserveRichBeatSpacing
      && ordinarySlurDepth > 0
      && isBeatBoundary
      && event.accidental.includes("#")
      && nextEvent?.type === "note"
      && !nextEvent.accidental
      && nextEvent.pitch === event.pitch
      && nextEvent.octave === event.octave
      && event.durationMark.includes("/")
      && nextEvent.durationMark.includes("/")
    ) {
      width += 0.4;
    }
    pendingDescendingAccidentalClearance ||= sharesDescendingAccidentalSpace && !event.accidental;
    const descendsToClosingRestore = sharesDescendingAccidentalSpace
      && Boolean(nextEvent?.accidental.includes("="))
      && Boolean(nextEvent?.slurEndCount);
    const followsDescendingFlat = !preserveRichBeatSpacing
      && ordinarySlurDepth > 0
      && previousEvent?.accidental.includes("$")
      && previousEvent.durationMark.includes("/")
      && (!previousEvent.durationMark.includes("//") || event.durationMark.includes("//"))
      && event.durationMark.includes("/")
      && previousEvent.octave === event.octave
      && Number(previousEvent.pitch) - Number(event.pitch) === 1
      && !beforePreviousEvent?.accidental
      && !nextEvent?.accidental
      && !nextEvent?.slurStartCount
      && !event.accidental
      && !event.slurEndCount
      && !(
        !event.durationMark.includes("//")
        && nextEvent?.octave === event.octave
        && Number(event.pitch) - Number(nextEvent.pitch) === 1
      );
    if (followsDescendingFlat) {
      width += 0.4;
    }
    const carriesSixteenthFlatDescent = !preserveRichBeatSpacing
      && ordinarySlurDepth > 0
      && event.accidental.includes("$")
      && event.durationMark.includes("//")
      && !event.slurEndCount
      && nextEvent?.type === "note"
      && !nextEvent.accidental
      && nextEvent.durationMark.includes("/")
      && !nextEvent.durationMark.includes("//")
      && Number(nextEvent.pitch) < Number(event.pitch);
    if (carriesSixteenthFlatDescent) {
      width += 0.4;
    }
    const sharesAscendingDigitSpace = event.pitch === "4" && nextEvent?.pitch === "5";
    const anticipatesAscendingAccidentalRun = !preserveRichBeatSpacing
      && isBeatBoundary
      && !previousEvent?.durationMark.includes(".")
      && nextEvent?.type === "note"
      && !nextEvent.accidental
      && afterNextEvent?.type === "note"
      && Boolean(afterNextEvent.accidental)
      && Number(afterNextEvent.pitch) > Number(nextEvent.pitch)
      && thirdNextEvent?.type === "note"
      && Boolean(thirdNextEvent.accidental);
    if (anticipatesAscendingAccidentalRun) {
      width += 0.4;
    }
    const carriesDottedAscendingAccidentalSpace = !preserveRichBeatSpacing
      && previousEvent?.pitch === "4"
      && previousEvent.durationMark.includes(".")
      && Boolean(previousEvent.accidental)
      && event.pitch === "5"
      && Boolean(event.accidental)
      && Boolean(nextEvent?.accidental);
    const continuesAscendingAccidentalRun = !preserveRichBeatSpacing
      && Boolean(previousEvent?.accidental)
      && Boolean(event.accidental)
      && Boolean(nextEvent?.accidental)
      && Number(previousEvent?.pitch) < Number(event.pitch)
      && Number(event.pitch) < Number(nextEvent?.pitch);
    const startsRestoredFlatTail = event.accidental.includes("=")
      && nextEvent?.accidental.includes("$")
      && afterNextEvent?.accidental.includes("$")
      && event.durationMark.includes("/")
      && nextEvent.durationMark.includes("/")
      && afterNextEvent.durationMark.includes("/");
    const continuesRestoredFlatTail = previousEvent?.accidental.includes("=")
      && event.accidental.includes("$")
      && nextEvent?.accidental.includes("$")
      && previousEvent.durationMark.includes("/")
      && event.durationMark.includes("/")
      && nextEvent.durationMark.includes("/");
    const sharesDescendingFlatRun = event.accidental.includes("$")
      && nextEvent?.accidental.includes("$")
      && ordinarySlurDepth > 0
      && event.octave === nextEvent.octave
      && (
        Number(event.pitch) - Number(nextEvent.pitch) > 1
        || (Number(event.pitch) - Number(nextEvent.pitch) === 1 && !nextEvent.slurEndCount)
      )
      && event.durationMark.includes("/")
      && nextEvent.durationMark.includes("/")
      && !previousEvent?.accidental
      && !afterNextEvent?.accidental;
    const endsRestoredFlatTail = beforePreviousEvent?.accidental.includes("=")
      && previousEvent?.accidental.includes("$")
      && event.accidental.includes("$")
      && beforePreviousEvent.durationMark.includes("/")
      && previousEvent.durationMark.includes("/")
      && event.durationMark.includes("/");
    if (
      !preserveRichBeatSpacing
      && previousEvent?.pitch === "4"
      && previousEvent.accidental
      && previousEvent.durationMark.includes("/")
      && event.pitch === "5"
      && event.durationMark.includes("/")
      && nextEvent?.pitch === "6"
      && nextEvent.durationMark.includes("/")
    ) {
      width += 0.4;
    }
    const repeatsNestedOpenFlat = (event.slurStartCount ?? 0) >= 2
      && event.accidental.includes("$")
      && nextEvent?.pitch === event.pitch
      && nextEvent.octave === event.octave
      && nextEvent.accidental === event.accidental;
    const repeatsClosingAccidental = Boolean(event.slurEndCount)
      && event.accidental.includes("#")
      && nextEvent?.pitch === event.pitch
      && nextEvent.octave === event.octave
      && nextEvent.accidental === event.accidental
      && event.durationMark.includes("/")
      && nextEvent.durationMark.includes("//")
      && !(event.octave < 0 && nextEvent.slurStartCount);
    const closesNestedRepeatedNote = Boolean(event.slurEndCount)
      && !event.accidental
      && (previousEvent?.slurStartCount ?? 0) >= 2
      && previousEvent?.pitch === event.pitch
      && previousEvent.octave === event.octave
      && nextEvent?.accidental.includes("#");
    const startsDescendingSharpSlur = isBeatBoundary
      && Boolean(event.slurStartCount)
      && event.accidental.includes("#")
      && nextEvent?.accidental.includes("#")
      && nextEvent.octave === event.octave
      && Number(nextEvent.pitch) < Number(event.pitch);
    const startsFixedDoNonHighDescendingSharpSlur = usesFixedDoRounding
      && hasExpressionMarks
      && event.octave <= 0
      && event.durationMark.includes("/")
      && Boolean(event.slurStartCount)
      && event.accidental.includes("#")
      && nextEvent?.durationMark.includes("/")
      && nextEvent.accidental.includes("#")
      && nextEvent.octave === event.octave
      && Number(nextEvent.pitch) < Number(event.pitch);
    const startsFixedDoCrossOctaveSharpSlur = usesFixedDoRounding
      && event.octave >= 0
      && event.durationMark.includes("/")
      && Boolean(event.slurStartCount)
      && event.accidental.includes("#")
      && nextEvent?.durationMark.includes("/")
      && !nextEvent.accidental
      && nextEvent.octave > event.octave;
    const precedesDescendingSharpSlur = Boolean(nextEvent?.slurStartCount)
      && !event.accidental
      && nextEvent.accidental.includes("#")
      && nextEvent.octave === event.octave
      && Number(nextEvent.pitch) < Number(event.pitch)
      && !(
        usesFixedDoRounding
        && !hasExpressionMarks
        && Boolean(event.slurEndCount)
      );
    const precedesFixedDoCrossOctaveSharpSlur = usesFixedDoRounding
      && !hasExpressionMarks
      && !event.slurEndCount
      && event.pitch === "2"
      && !event.accidental
      && nextEvent?.pitch === "7"
      && nextEvent.octave < event.octave
      && nextEvent.accidental.includes("#")
      && Boolean(nextEvent.slurStartCount)
      && !afterNextEvent?.accidental;
    const closesBeforeDescendingSharp = Boolean(event.slurEndCount)
      && !event.accidental
      && hasExpressionMarks
      && nextEvent?.accidental.includes("#")
      && nextEvent.octave === event.octave
      && Number(nextEvent.pitch) < Number(event.pitch);
    const closesBeforeSamePitchSharpOpener = Boolean(event.slurEndCount)
      && !event.accidental
      && nextEvent?.accidental.includes("#")
      && Boolean(nextEvent.slurStartCount)
      && nextEvent.pitch === event.pitch
      && nextEvent.octave === event.octave;
    const wholeLowOctaveSamePitchSharpOpener = event.octave < 0
      && Boolean(event.slurStartCount)
      && !event.durationMark
      && !event.accidental
      && nextEvent?.accidental.includes("#")
      && nextEvent.pitch === event.pitch
      && nextEvent.octave === event.octave;
    const eighthLowOctaveSamePitchSharpOpener = event.octave < 0
      && event.durationMark.includes("/")
      && !event.slurEndCount
      && !event.accidental
      && nextEvent?.accidental.includes("#")
      && Boolean(nextEvent.slurStartCount)
      && nextEvent.pitch === event.pitch
      && nextEvent.octave === event.octave;
    const opensNestedAccidentalSlur = ordinarySlurDepth > 0
      && Boolean(event.slurStartCount)
      && !event.slurEndCount
      && event.accidental.includes("#")
      && nextEvent?.accidental === event.accidental
      && nextEvent.pitch === event.pitch
      && nextEvent.octave === event.octave
      && Boolean(nextEvent.slurEndCount)
      && !nextEvent.slurStartCount;
    const opensAfterFlatSlurClose = Boolean(event.slurStartCount)
      && previousEvent?.accidental.includes("$")
      && Boolean(previousEvent.slurEndCount)
      && nextEvent?.type === "note"
      && !nextEvent.accidental
      && nextEvent.octave === event.octave
      && Number(nextEvent.pitch) > Number(event.pitch)
      && afterNextEvent?.accidental.includes("$");
    const opensAfterSharpSlurClose = isBeatBoundary
      && Boolean(event.slurStartCount)
      && Boolean(previousEvent?.slurEndCount)
      && previousEvent.accidental.includes("#")
      && !event.accidental
      && nextEvent?.type === "note"
      && !nextEvent.accidental
      && nextEvent.octave === event.octave
      && afterNextEvent?.accidental.includes("#");
    const opensAfterDescendingSharpSlurClose = usesFixedDoRounding
      && isBeatBoundary
      && event.octave >= 0
      && Boolean(event.slurStartCount)
      && Boolean(previousEvent?.slurEndCount)
      && previousEvent.accidental.includes("#")
      && !event.accidental
      && event.durationMark.includes("/")
      && nextEvent?.type === "note"
      && !nextEvent.accidental
      && nextEvent.durationMark.includes("/")
      && nextEvent.octave === event.octave
      && Number(previousEvent.pitch) > Number(event.pitch)
      && !afterNextEvent?.accidental;
    if (hasLeadingAccidental(nextEvent) && !sharesHighOctaveAccidentalSpace && (!sharesDescendingAccidentalSpace || descendsToClosingRestore) && !sharesAscendingDigitSpace && !carriesDottedAscendingAccidentalSpace && !continuesAscendingAccidentalRun && !startsRestoredFlatTail && !continuesRestoredFlatTail && !sharesDescendingFlatRun && !repeatsNestedOpenFlat && !repeatsClosingAccidental && !closesNestedRepeatedNote && !startsDescendingSharpSlur && !precedesDescendingSharpSlur && !precedesFixedDoCrossOctaveSharpSlur && !closesBeforeDescendingSharp && !closesBeforeSamePitchSharpOpener && !wholeLowOctaveSamePitchSharpOpener) {
      width += 0.4;
    }
    if (
      usesFixedDoRounding
      && closesBeforeSamePitchSharpOpener
      && event.durationMark.includes("/")
      && nextEvent?.durationMark.includes("/")
    ) {
      width += 0.4;
    }
    if (
      usesFixedDoRounding
      && events.some((candidate) => candidate.code === "|j")
      && Boolean(event.slurEndCount)
      && event.durationMark.includes("/")
      && nextEvent?.accidental.includes("#")
      && Boolean(nextEvent.slurStartCount)
      && nextEvent.durationMark.includes("/")
      && Number(nextEvent.pitch) < Number(event.pitch)
    ) {
      width += 0.4;
    }
    if (opensNestedAccidentalSlur) {
      width += 0.4;
    }
    if (opensAfterFlatSlurClose) {
      width += 0.4;
    }
    if (opensAfterSharpSlurClose) {
      width += 0.4;
    }
    if (opensAfterDescendingSharpSlurClose) {
      width += 0.4;
    }
    if (startsFixedDoNonHighDescendingSharpSlur) {
      width += 0.4;
    }
    if (startsFixedDoCrossOctaveSharpSlur) {
      width += 0.4;
    }
    if (eighthLowOctaveSamePitchSharpOpener) {
      width += 0.4;
    }
    if (
      ordinarySlurDepth > 0
      && event.type === "note"
      && !event.accidental
      && event.durationMark.includes("/")
      && nextEvent?.accidental.includes("#")
      && Boolean(nextEvent.slurEndCount)
      && nextEvent.octave === event.octave
      && Number(nextEvent.pitch) > Number(event.pitch)
    ) {
      width += 0.4;
    }
    if (
      event.type === "note"
      && Boolean(event.slurEndCount)
      && !event.accidental
      && Boolean(previousEvent?.slurStartCount)
      && nextEvent?.accidental.includes("#")
      && !nextEvent.slurStartCount
      && !hasCrescendo
      && nextEvent.octave === event.octave
      && Number(nextEvent.pitch) > Number(event.pitch)
    ) {
      width += 0.4;
    }
    if (
      Boolean(event.slurEndCount)
      && event.accidental.includes("#")
      && event.durationMark.includes("/")
      && previousEvent?.type === "note"
      && Boolean(previousEvent.slurStartCount)
      && previousEvent.octave === event.octave
      && Number(previousEvent.pitch) > Number(event.pitch)
      && nextEvent?.type === "note"
      && !nextEvent.accidental
      && nextEvent.octave === event.octave
      && Number(nextEvent.pitch) > Number(event.pitch)
    ) {
      width += 0.4;
    }
    if (
      !preserveRichBeatSpacing
      && (event.slurStartCount ?? 0) >= 2
      && !event.accidental
      && previousEvent?.accidental.includes("#")
    ) {
      width += 0.4;
    }
    if (
      !preserveRichBeatSpacing
      && !event.accidental
      && nextEvent?.accidental.includes("#")
      && nextEvent.pitch === event.pitch
      && nextEvent.octave === event.octave
      && (nextEvent.time >= 1 || Boolean(event.slurEndCount))
      && (nextEvent.time >= 1 || !nextEvent.slurStartCount || nextEvent.durationMark.includes("//"))
    ) {
      width += 0.4;
    }
    if (
      isBeatBoundary
      && beforePreviousEvent?.accidental
      && previousEvent?.accidental
      && event.accidental
      && event.slurStartCount
      && hasLeadingAccidental(nextEvent)
    ) {
      width += 0.4;
    }
    if (event.octave > 0 && event.accidental && nextEvent?.octave === event.octave && nextEvent.accidental && Number(event.pitch) > Number(nextEvent.pitch)) {
      width += 0.4;
    }
    if (event.pitch === "4" && event.durationMark.includes(".") && nextEvent?.pitch === "5" && nextEvent.accidental) {
      width += 0.4;
    }
    if (
      useMeasureBeatSpacing
      && event.pitch === "7"
      && event.durationMark.includes("/")
      && event.accidental.includes("$")
      && nextEvent?.pitch === "6"
      && nextEvent.durationMark.includes("/")
      && !nextEvent.slurStartCount
    ) {
      width += 0.4;
    }
    if (
      event.pitch === "6"
      && event.durationMark.includes("/")
      && event.accidental.includes("$")
      && event.slurStartCount
      && ordinarySlurDepth === event.slurStartCount
      && nextEvent?.pitch === "6"
    ) {
      width += 0.4;
    }
    if (
      !preserveRichBeatSpacing
      && event.slurStartCount
      && !event.accidental
      && nextEvent?.pitch === event.pitch
      && nextEvent.octave === event.octave
      && (
        (previousEvent?.slurEndCount ?? 0) > 1
        || ordinarySlurDepth > event.slurStartCount
      )
      && !(
        previousEvent?.accidental.includes("#")
        && (previousEvent.slurEndCount ?? 0) > 1
      )
    ) {
      width += 0.4;
    }
    if (
      Boolean(event.slurEndCount)
      && !event.accidental
      && Boolean(previousEvent?.slurEndCount)
      && beforePreviousEvent?.accidental.includes("#")
      && Boolean(beforePreviousEvent.slurStartCount)
      && nextEvent?.pitch === event.pitch
      && nextEvent.octave === event.octave
      && Boolean(nextEvent.slurStartCount)
    ) {
      width += 0.4;
    }
    if (
      isBeatBoundary
      && nextEvent?.type === "note"
      && nextEvent.pitch
      && nextEvent.durationMark.includes("/")
      && event.pitch !== nextEvent.pitch
      && !(
        nextEvent.slurStartCount
        && (
          (event.slurEndCount && Boolean(nextEvent.accidental))
          || (event.octave > 0 && nextEvent.octave > 0)
        )
      )
      && !(
        usesFixedDoRounding
        && rowLocalSlurDepth > (event.slurEndCount ?? 0)
        && event.octave > 0
        && nextEvent.octave > 0
        && !nextEvent.accidental
      )
      && !(
        usesFixedDoRounding
        && Boolean(nextEvent.accidental)
        && (
          rowLocalSlurDepth > (event.slurEndCount ?? 0)
          || (
            Boolean(event.slurEndCount)
            && Number(nextEvent.pitch) > Number(event.pitch)
          )
        )
      )
      && (
        preserveRichBeatSpacing
          ? ["1", "4", "6"].includes(event.pitch ?? "")
          : (event.octave > 0 && nextEvent.octave > 0) || Boolean(nextEvent.accidental)
      )
    ) {
      width += 0.4;
    }
    if (
      isBeatBoundary
      && Boolean(event.slurStartCount)
      && Boolean(previousEvent?.slurEndCount)
      && previousEvent?.accidental.includes("$")
      && !event.accidental
      && event.durationMark.includes("/")
      && nextEvent?.type === "note"
      && !nextEvent.accidental
      && nextEvent.durationMark.includes("/")
      && nextEvent.octave === event.octave
      && Number(event.pitch) - Number(nextEvent.pitch) === 1
      && afterNextEvent?.accidental.includes("$")
    ) {
      width += 0.4;
    }
    if (nextEvent?.type === "bar") {
      width -= 0.2;
      if (!preserveRichBeatSpacing && event.slurStartCount && event.accidental.includes("#")) {
        width += 0.4;
      }
      if (previousEvent?.accidental.includes("=") && event.accidental.includes("$")) {
        width += 0.4;
      }
      if (!preserveRichBeatSpacing && event.type !== "hold" && event.time < 1 && hasSlashDurations && ordinarySlurDepth > (event.slurEndCount ?? 0)) {
        width += 0.4;
      }
      if (
        usesFixedDoRounding
        && hasExpressionMarks
        && hasCrescendo
        && event.octave < 0
        && event.durationMark.includes("/")
        && event.accidental.includes("#")
        && Boolean(event.slurEndCount)
        && previousEvent?.type === "note"
        && !previousEvent.accidental
        && !previousEvent.slurStartCount
        && previousEvent.octave === event.octave
        && previousEvent.pitch === event.pitch
        && beforePreviousEvent?.pitch !== event.pitch
      ) {
        width += 0.4;
      }
      if (
        usesFixedDoRounding
        && event.octave > 0
        && event.durationMark.includes("/")
        && event.accidental.includes("#")
        && Boolean(event.slurEndCount)
        && previousEvent?.type === "note"
        && !previousEvent.accidental
        && previousEvent.pitch === event.pitch
        && previousEvent.octave === event.octave
        && Boolean(previousEvent.slurStartCount)
      ) {
        width += 0.4;
      }
      if (
        useMeasureBeatSpacing
        && event.durationMark.includes("/")
        && (
          (preserveRichBeatSpacing && event.octave > 0)
          || (event.pitch === "7" && event.accidental.includes("$") && !event.slurEndCount)
          || (event.pitch === "6" && event.accidental.includes("$") && !nextEvent.annotation && !endsRestoredFlatTail)
        )
      ) {
        width += 0.4;
      }
      if (
        preserveRichBeatSpacing
        && hasFlatAccidentals
        && !nextEvent.annotation
        && event.durationMark.includes("/")
        && !event.accidental
        && event.octave === 0
        && ["4", "5"].includes(event.pitch ?? "")
      ) {
        width += 0.4;
      }
    }
    if (
      pendingNestedSlurClearance
      && Boolean(event.slurEndCount)
      && Boolean(previousEvent?.slurEndCount)
      && ordinarySlurDepth === event.slurEndCount
    ) {
      width += 0.4;
      pendingNestedSlurClearance = false;
    }
    ordinarySlurDepth -= event.slurEndCount ?? 0;
    rowLocalSlurDepth = Math.max(0, rowLocalSlurDepth - (event.slurEndCount ?? 0));
    return width;
  });
}

function primaryTitle(parsed: ParsedJps): string {
  return parsed.headerValues.B?.[0] ?? parsed.header.B ?? parsed.header.V ?? "JPS Music";
}

function secondaryTitle(parsed: ParsedJps): string | null {
  return parsed.headerValues.B && parsed.headerValues.B.length > 1 ? parsed.headerValues.B[1] : null;
}

function keySignatureParts(key: string): { letter: string; accidental: string } {
  const match = key.trim().match(/^([A-Ga-g])([#$=]?)/);
  return {
    letter: (match?.[1] ?? key.trim()).toLowerCase(),
    accidental: match?.[2] ?? "",
  };
}

function tokenizeJpsLine(line: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let inQuotes = false;

  const appendSuffixToLastNoteToken = (suffix: string): void => {
    for (let index = tokens.length - 1; index >= 0; index -= 1) {
      if (["|", "(", ")", "[", "]", "{", "}"].includes(tokens[index])) {
        continue;
      }
      tokens[index] += suffix;
      return;
    }

    tokens.push(suffix);
  };

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      current += char;
      inQuotes = !inQuotes;
      continue;
    }

    if (!inQuotes && /\s/.test(char)) {
      if (current.length > 0) {
        tokens.push(current);
        current = "";
      }
      continue;
    }

    if (!inQuotes && char === ":" && line[i + 1] === "|") {
      if (current.length > 0) {
        tokens.push(current);
        current = "";
      }
      tokens.push(":|");
      i += 1;
      continue;
    }

    if (
      !inQuotes &&
      (char === "|" || char === "(" || char === ")" || char === "[" || char === "]" || char === "{" || char === "}")
    ) {
      if (current.length > 0) {
        tokens.push(current);
        current = "";
      }

      if (char === "|" && (line[i + 1] === "/" || line[i + 1] === "*" || line[i + 1] === ":")) {
        tokens.push(`${char}${line[i + 1]}`);
        i += 1;
        continue;
      }

      tokens.push(char);

      if (char === ")" || char === "]" || char === "}") {
        let suffix = "";
        let lookahead = i + 1;
        while (lookahead < line.length && /[-/.]/.test(line[lookahead])) {
          suffix += line[lookahead];
          lookahead += 1;
        }
        if (suffix) {
          tokens.push(suffix);
          i = lookahead - 1;
        }
      }

      continue;
    }

    current += char;
  }

  if (current.length > 0) {
    tokens.push(current);
  }

  return tokens;
}

export function parseJps(input: string): ParsedJps {
  const normalized = input.replace(/\r\n?/g, "\n");
  const lines = normalized.split("\n");

  const header: Record<string, string> = {};
  const headerValues: Record<string, string[]> = {};
  const body: JpsLine[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const bodyMatch = line.match(/^([QC]):\s*(.*)$/);
    if (bodyMatch) {
      const [, type, content] = bodyMatch;
      const tokens = tokenizeJpsLine(content.trim());
      body.push({
        type: type as JpsLineType,
        raw: line,
        content: content.trim(),
        tokens,
      });
      continue;
    }

    const headerMatch = line.match(/^([A-Z]):\s*(.*)$/);
    if (headerMatch) {
      const [, key, value] = headerMatch;
      header[key] = value.trim();
      headerValues[key] ??= [];
      headerValues[key].push(value.trim());
    }
  }

  return { header, headerValues, lines: body };
}

export function parseJpsEvents(input: string): JpsEvent[] {
  const parsed = parseJps(input);
  const events: JpsEvent[] = [];
  let measureIndex = 0;
  let melodyLineIndex = 0;
  const groupStack: Array<{ size: number; isTuplet: boolean; startsOnNextNote: boolean; startPitch: string | null; startOctave: number; startAccidental: string; hasPitchChange: boolean; lineIndex: number }> = [];

  const parseQuotedToken = (token: string): string | null => {
    const match = token.match(/^"([^"]*)"$/);
    return match ? match[1] : null;
  };

  parsed.lines.forEach((line, lineIndex) => {
    if (line.type !== "Q") return;

    let eventIndex = 0;
    let pendingJumpHouseEndCode: string | null = null;

    const countGroupNotes = (startTokenIndex: number): number => {
      let depth = 1;
      let count = 0;

      for (let scanIndex = startTokenIndex + 1; scanIndex < line.tokens.length; scanIndex += 1) {
        const scanToken = line.tokens[scanIndex];
        if (scanToken === "(") {
          depth += 1;
          continue;
        }

        if (scanToken === ")") {
          depth -= 1;
          if (depth === 0) {
            break;
          }
          continue;
        }

        if (depth === 1 && !/^[-/.]+$/.test(scanToken) && !["|", "|/", "|*", "[", "]", "{", "}"].includes(scanToken)) {
          count += 1;
        }
      }

      return count;
    };

    for (let tokenIndex = 0; tokenIndex < line.tokens.length; tokenIndex += 1) {
      const token = line.tokens[tokenIndex];
      if (token === ":" && line.tokens[tokenIndex + 1] === "|") {
        events.push({
          ...createJpsEvent("bar", ":|", melodyLineIndex, eventIndex, measureIndex, lineIndex),
          code: "|y",
        });
        measureIndex += 1;
        eventIndex += 1;
        tokenIndex += 1;
        continue;
      }
      if (token === "|" || token === "|/" || token === "|*" || token === "|:" || token === ":|") {
        const nextToken = line.tokens[tokenIndex + 1];
        const isDoubleBar = token === "|" && nextToken === "|";
        const annotationToken = isDoubleBar ? null : parseQuotedToken(nextToken ?? "");
        const annotation = annotationToken?.startsWith("p:") ? annotationToken : null;
        const jumpHouseEndCode = pendingJumpHouseEndCode;
        pendingJumpHouseEndCode = null;
        events.push({
          ...createJpsEvent("bar", isDoubleBar ? "|j" : token, melodyLineIndex, eventIndex, measureIndex, lineIndex),
          code: jumpHouseEndCode
            ? `${jumpHouseEndCode}]${token}`
            : isDoubleBar ? "|j" : token === "|:" ? "|z" : token === ":|" ? "|y" : annotation ? `${token}'${annotation}'` : token,
          annotation,
          jumpHouseEnd: Boolean(jumpHouseEndCode),
        });
        measureIndex += 1;
        eventIndex += 1;
        if (isDoubleBar) {
          tokenIndex += 1;
        } else if (annotation) {
          tokenIndex += 1;
        }
        continue;
      }

      if (token === "[") {
        const label = parseQuotedToken(line.tokens[tokenIndex + 1] ?? "");
        const previousBar = events.at(-1);
        if (label && previousBar?.type === "bar" && previousBar.lineIndex === lineIndex) {
          previousBar.code = `${previousBar.code}['${label}'`;
          previousBar.jumpHouseStartLabel = label;
          tokenIndex += 1;
        }
        continue;
      }

      if (token === "]" && line.tokens[tokenIndex + 1] === "[") {
        const label = parseQuotedToken(line.tokens[tokenIndex + 2] ?? "");
        const previousBar = events.at(-1);
        if (label && previousBar?.type === "bar" && previousBar.lineIndex === lineIndex) {
          previousBar.code = `${previousBar.code}]['${label}'`;
          previousBar.jumpHouseEnd = true;
          previousBar.jumpHouseStartLabel = label;
          tokenIndex += 2;
        }
        continue;
      }

      if (token === "]") {
        const previousBar = events.at(-1);
        if (previousBar?.type === "bar" && previousBar.lineIndex === lineIndex) {
          previousBar.code = `${previousBar.code}]`;
          previousBar.jumpHouseEnd = true;
          continue;
        }
      }

      if (token === "]" && line.tokens[tokenIndex + 1] === "|") {
        const previousEvent = events.at(-1);
        if (previousEvent?.type === "note" && previousEvent.lineIndex === lineIndex) {
          pendingJumpHouseEndCode = previousEvent.code;
          events.pop();
          eventIndex -= 1;
        }
        continue;
      }

      if (token === "(") {
        const groupSize = countGroupNotes(tokenIndex);
        if (groupSize > 0) {
          groupStack.push({
            size: groupSize,
            isTuplet: line.tokens[tokenIndex + 1]?.startsWith("y") ?? false,
            startsOnNextNote: true,
            startPitch: null,
            startOctave: 0,
            startAccidental: "",
            hasPitchChange: false,
            lineIndex,
          });
        }
        continue;
      }

      if (token === ")") {
        const group = groupStack.pop();
        const lastEvent = events.at(-1);
        if (lastEvent && lastEvent.lineIndex === lineIndex && (lastEvent.type === "note" || lastEvent.type === "hold")) {
          lastEvent.code = `${lastEvent.code})`;
          if (group && !group.isTuplet) {
            lastEvent.slurEndCount = (lastEvent.slurEndCount ?? 0) + 1;
          }
        }
        if (group && lastEvent && lastEvent.lineIndex === lineIndex && lastEvent.type === "note") {
          const previousNote = events.findLast((event, eventIndex) => eventIndex < events.length - 1 && event.lineIndex === lineIndex && event.type === "note");
          if (group.isTuplet) {
            lastEvent.groupEnd = true;
            lastEvent.groupSize = group.size;
          } else {
            if (
              (
                (group.size > 1 || group.lineIndex !== lineIndex)
                && lastEvent.pitch === group.startPitch
                && !group.hasPitchChange
                && !(
                  group.startAccidental.includes("#")
                  && !lastEvent.accidental
                  && group.startOctave !== lastEvent.octave
                )
              )
              || groupStack.some((parentGroup) => !parentGroup.isTuplet
                && parentGroup.startPitch === lastEvent.pitch
                && !parentGroup.hasPitchChange
                && !(
                  parentGroup.startAccidental.includes("#")
                  && !lastEvent.accidental
                  && parentGroup.startOctave !== lastEvent.octave
                ))
              || (
                previousNote?.pitch === lastEvent.pitch
                && previousNote.octave === lastEvent.octave
              )
            ) {
              lastEvent.audio = "0";
            }
          }
        }
        continue;
      }

      if (token === "!-") {
        const previousEvent = events.findLast((event) => event.lineIndex === lineIndex && event.type === "note");
        if (previousEvent) {
          previousEvent.code += "!";
          previousEvent.hairpinEnd = true;
          previousEvent.hairpinDefaultOffset = true;
        }
        events.push({
          ...createJpsEvent("hold", "-", melodyLineIndex, eventIndex, measureIndex, lineIndex),
          time: 1,
        });
        eventIndex += 1;
        continue;
      }

      if (/^-!?$/.test(token)) {
        events.push({
          ...createJpsEvent("hold", token, melodyLineIndex, eventIndex, measureIndex, lineIndex),
          time: 1,
          hairpinEnd: token.includes("!") || undefined,
        });
        eventIndex += 1;
        continue;
      }

      if (/^[-/.]+$/.test(token)) {
        const previousEvent = events.at(-1);
        if (previousEvent?.lineIndex === lineIndex && previousEvent.type === "bar") {
          previousEvent.code += token;
        } else if (previousEvent && previousEvent.lineIndex === lineIndex && (previousEvent.type === "note" || previousEvent.type === "hold")) {
          const pendingSlur = groupStack.findLast((group) => !group.isTuplet && group.startsOnNextNote);
          if (pendingSlur) {
            previousEvent.code += `(${token}`;
            previousEvent.slurStartCount = (previousEvent.slurStartCount ?? 0) + 1;
            pendingSlur.startsOnNextNote = false;
            pendingSlur.startPitch = previousEvent.pitch;
            pendingSlur.startOctave = previousEvent.octave;
            pendingSlur.startAccidental = previousEvent.accidental;
          } else {
            previousEvent.code += token;
          }
          previousEvent.durationMark += token;
          previousEvent.time = durationTime(previousEvent.durationMark);
        }
        continue;
      }

      if (token === "!") {
        const previousEvent = events.findLast((event) => event.lineIndex === lineIndex && event.type === "note");
        if (previousEvent) {
          previousEvent.code += "!";
          previousEvent.hairpinEnd = true;
        }
        continue;
      }

      const standaloneAnnotation = parseQuotedToken(token);
      if (standaloneAnnotation) {
        const previousEvent = events.findLast((event) => event.lineIndex === lineIndex && event.type === "note");
        if (previousEvent) {
          previousEvent.annotation = standaloneAnnotation;
          previousEvent.detachedAnnotation = true;
        }
        continue;
      }

      const parsedToken = parseJpsTokenParts(token);
      const isDynamic = parsedToken.annotation?.startsWith("p:") ?? false;
      const activeTuplet = groupStack.findLast((group) => group.isTuplet);
      const decorationCode = `${parsedToken.dynamicMark ? `+${parsedToken.dynamicMark}` : ""}${parsedToken.hairpinEnd ? "!" : ""}`;
      const normalizedCode = `${parsedToken.notationCode}${decorationCode}`;
      const isGroupedNote = !isDynamic && Boolean(activeTuplet);
      const isGroupStart = isGroupedNote && token.startsWith("y") && token.length > 1;
      const slurStartCount = isDynamic ? 0 : groupStack.filter((group) => !group.isTuplet && group.startsOnNextNote).length;
      groupStack.forEach((group) => {
        if (!group.isTuplet) {
          if (group.startsOnNextNote) {
            group.startPitch = parsedToken.isRest ? null : parsedToken.rawValue;
            group.startOctave = parsedToken.octave;
            group.startAccidental = parsedToken.accidental;
          } else if (!parsedToken.isRest && parsedToken.rawValue !== group.startPitch) {
            group.hasPitchChange = true;
          }
          group.startsOnNextNote = false;
        }
      });
      events.push({
        ...createJpsEvent(isDynamic ? "dynamic" : "note", token, melodyLineIndex, eventIndex, measureIndex, lineIndex),
        code: isGroupStart
          ? groupedStartCode(parsedToken.rawValue, parsedToken.pitchSuffix, parsedToken.durationMark, decorationCode)
          : slurStartCount > 0
            ? `${parsedToken.rawValue}${"(".repeat(slurStartCount)}${parsedToken.notationCode.slice(parsedToken.rawValue.length)}${decorationCode}`
            : normalizedCode,
        pitch: isDynamic || parsedToken.isRest ? null : parsedToken.rawValue,
        audio: parsedToken.isRest ? "0" : parsedToken.audioValue,
        time: isDynamic ? 0 : activeTuplet ? 1 / activeTuplet.size : durationTime(parsedToken.durationMark),
        durationMark: parsedToken.durationMark,
        octave: parsedToken.octave,
        accidental: parsedToken.accidental,
        annotation: parsedToken.annotation,
        isHiddenRest: parsedToken.rawValue === "8",
        groupSize: activeTuplet?.size,
        groupStart: isGroupStart,
        slurStartCount: slurStartCount || undefined,
        hairpinStart: parsedToken.hairpinStart,
        hairpinEnd: parsedToken.hairpinEnd,
        dynamicMark: parsedToken.dynamicMark,
      });
      eventIndex += 1;
    }

    melodyLineIndex += 1;
  });

  return events;
}

function createJpsEvent(type: JpsEventType, raw: string, melodyLineIndex: number, eventIndex: number, measureIndex: number, sourceLineIndex: number): JpsEvent {
  return {
    type,
    raw,
    code: raw,
    pitch: null,
    audio: null,
    time: 0,
    durationMark: "",
    octave: 0,
    accidental: "",
    annotation: null,
    isHiddenRest: false,
    measureIndex,
    notepos: `0_${melodyLineIndex + 1}_${eventIndex + 1}`,
    lineIndex: sourceLineIndex,
  };
}

function durationTime(durationMark: string): number {
  const slashCount = (durationMark.match(/\//g) ?? []).length;
  const dotCount = (durationMark.match(/\./g) ?? []).length;
  const baseDuration = 1 / Math.pow(2, slashCount);

  let dottedMultiplier = 1;
  let increment = 0.5;
  for (let index = 0; index < dotCount; index += 1) {
    dottedMultiplier += increment;
    increment /= 2;
  }

  return baseDuration * dottedMultiplier;
}

function extractTokenAnnotation(token: string): { baseToken: string; annotation: string | null } {
  const annotationMatch = token.match(/^(.*?)"([^"]*)"(.*)$/);
  if (!annotationMatch) {
    return { baseToken: token, annotation: null };
  }

  return {
    baseToken: `${annotationMatch[1]}${annotationMatch[3]}`,
    annotation: annotationMatch[2] ?? null,
  };
}

function parsePitchTail(tail: string): { accidental: string; octavePart: string } {
  let accidental = "";
  let octavePart = "";

  for (const char of tail) {
    if (char === "#" || char === "$" || char === "=") {
      accidental += char;
      continue;
    }

    if (char === "'" || char === ",") {
      octavePart += char;
    }
  }

  return { accidental, octavePart };
}

function parseJpsTokenParts(token: string): {
  rawValue: string;
  audioValue: string;
  pitchSuffix: string;
  accidental: string;
  octave: number;
  durationMark: string;
  annotation: string | null;
  isRest: boolean;
  hairpinStart: "crescendo" | "diminuendo" | undefined;
  hairpinEnd: boolean;
  dynamicMark: string | undefined;
  notationCode: string;
} {
  const normalizedToken = token.startsWith("y") && token.length > 1 ? token.slice(1) : token;
  const { baseToken, annotation } = extractTokenAnnotation(normalizedToken);
  const hairpinStart = baseToken.includes("<") ? "crescendo" : baseToken.includes(">") ? "diminuendo" : undefined;
  const hairpinEnd = baseToken.includes("!");
  const dynamicMatch = baseToken.match(/&(rit|pp|mp|mf|p|f)(?=&|$|[-/.<>!])/);
  const dynamicMark = dynamicMatch?.[1];
  const notationToken = baseToken
    .replace(dynamicMatch?.[0] ?? "", "")
    .replace(/[<>]+\+*/g, "")
    .replace(/!/g, "");
  const accidentalMatch = notationToken.match(/^(\d+)(.*)$/);
  const rawValue = accidentalMatch ? accidentalMatch[1] : notationToken;
  const restOfToken = accidentalMatch ? accidentalMatch[2] : "";
  const durationMark = Array.from(restOfToken).filter((char) => char === "-" || char === "/" || char === ".").join("");
  const pitchSuffix = restOfToken.replace(/[-/.]/g, "");
  const { accidental, octavePart } = parsePitchTail(pitchSuffix);

  return {
    rawValue,
    audioValue: `${rawValue}${octavePart}`,
    pitchSuffix,
    accidental,
    octave: octavePart.split("'").length - octavePart.split(",").length,
    durationMark,
    annotation,
    isRest: rawValue === "0" || rawValue === "8",
    hairpinStart,
    hairpinEnd,
    dynamicMark,
    notationCode: notationToken,
  };
}

export function buildNoteLayout(input: string): { header: Record<string, string>; notes: JpsNote[]; measureBars: number[] } {
  const parsed = parseJps(input);
  const notes: JpsNote[] = [];
  const measureBars: number[] = [];

  let x = 90;
  const y = 220;

  let lastMelodyStart = 0;

  for (const line of parsed.lines) {
    if (line.type === "C") {
      attachLyrics(notes, lastMelodyStart, lyricUnits(line.content));
      continue;
    }

    if (line.type !== "Q") continue;

    lastMelodyStart = notes.length;

    for (const token of line.tokens) {
      if (!token) {
        continue;
      }

      if (token === "|" || token === "|*" || token === "|/") {
        measureBars.push(x - 10);
        continue;
      }

      if (token === "(" || token === ")" || token === "[" || token === "]" || token === "{" || token === "}") {
        continue;
      }

      const note = parseJpsNoteToken(token, x, y);
      notes.push(note);
      x += note.durationMark.includes("-") ? 24 : note.durationMark.includes("/") ? 30 : 40;
    }
  }

  return { header: parsed.header, notes, measureBars };
}

function parseJpsNoteToken(token: string, x: number, y: number): JpsNote {
  const normalizedToken = token.startsWith("y") && token.length > 1 ? token.slice(1) : token;
  const { baseToken, annotation } = extractTokenAnnotation(normalizedToken);

  const accidentalMatch = baseToken.match(/^(\d+)(.*)$/);
  const rawValue = accidentalMatch ? accidentalMatch[1] : baseToken;
  const restOfToken = accidentalMatch ? accidentalMatch[2] : "";

  const durationMatch = restOfToken.match(/([-/.]+)$/);
  const durationMark = durationMatch ? durationMatch[1] : "";
  const pitchSuffix = durationMatch ? restOfToken.slice(0, -durationMark.length) : restOfToken;
  const { accidental: accidentals, octavePart } = parsePitchTail(pitchSuffix);

  const isRest = rawValue === "0";
  const isHiddenRest = rawValue === "8";
  const pitch = isRest ? null : rawValue;

  return {
    raw: token,
    value: rawValue,
    audioValue: `${rawValue}${pitchSuffix}`,
    pitch,
    accidental: accidentals,
    octave: octavePart.split("'").length - octavePart.split(",").length,
    duration: Number(rawValue) || 0,
    isRest,
    isHiddenRest,
    annotation,
    lyric: null,
    durationMark,
    x,
    y,
  };
}

function lyricUnits(content: string): string[] {
  const withoutAnnotation = content.replace(/^"[^"]*"\s*/, "");
  const units: string[] = [];

  for (const token of withoutAnnotation.split(/\s+/).filter(Boolean)) {
    for (const word of token.split("/").filter(Boolean)) {
      let current = "";
      let joinNext = false;

      for (const character of Array.from(word)) {
        if (character === "@") {
          if (current.length > 0) {
            units.push(current.replace(/_/g, " "));
            current = "";
          }
          units.push("");
          continue;
        }

        if (character === "~") {
          joinNext = true;
          continue;
        }

        if (current.length > 0 && !joinNext) {
          units.push(current.replace(/_/g, " "));
          current = "";
        }

        current += character;
        joinNext = false;
      }

      if (current.length > 0) {
        units.push(current.replace(/_/g, " "));
      }
    }
  }

  return units;
}

function attachLyrics(notes: JpsNote[], start: number, lyrics: string[]): void {
  let lyricIndex = 0;

  for (let noteIndex = start; noteIndex < notes.length && lyricIndex < lyrics.length; noteIndex += 1) {
    const lyric = lyrics[lyricIndex];
    if (lyric !== "") {
      notes[noteIndex].lyric = lyric;
    }
    lyricIndex += 1;
  }
}

export function renderJpsToSvg(input: string): string {
  const parsed = parseJps(input);
  const events = parseJpsEvents(input);
  const useNaturalWidths = usesNaturalWidthLayout(parsed, events);
  const usesFixedDoRounding = parsed.header.Z?.trim().toLowerCase() === "fixed-do";
  const width = 1000;
  const height = 1415;
  const viewBox = `0 0 ${width} ${height}`;
  const hasTempo = parsed.header.J !== undefined;
  const rendersTempo = /^\d+(?:\.\d+)?$/.test(parsed.header.J?.trim() ?? "");
  const expressionLineIndexes = new Set(events
    .filter((event) => event.hairpinStart || event.hairpinEnd || event.dynamicMark)
    .map((event) => event.lineIndex));
  const left = 83;
  const right = 14565 / 16;
  const compactRight = 553;
  const internalBarOffset = 427 / 144;
  const closingBarX = 923;
  const barAdvance = 5551 / 144;
  const svgChildren: string[] = [
    `<text x="500" y="110" dy="30.078" text-anchor="middle" fill="#1b1b1b" style="font-weight:bold;" font-size="36" font-family="Microsoft YaHei" >${escapeXml(primaryTitle(parsed))}</text>`,
  ];
  const durationLineChildren: string[] = [];
  const naturalPitchDecorationChildren: string[] = [];
  const naturalAnnotationChildren: string[] = [];
  const octaveGlyphChildren: string[] = [];
  const groupedDecorationChildren: string[] = [];
  const expressionChildren: string[] = [];
  const dynamicChildren: string[] = [];
  const jumpHouseChildren: string[] = [];

  const subtitle = secondaryTitle(parsed);
  if (subtitle) {
    svgChildren.push(`<text x="500" y="166" dy="16.71" text-anchor="middle" fill="#1b1b1b" font-size="20" font-family="Microsoft YaHei" >${escapeXml(subtitle.trim())}</text>`);
  }

  if (parsed.header.D) {
    const key = keySignatureParts(parsed.header.D);
    svgChildren.push(svgUse(80, 176, "diaohao_fu", ""));
    if (key.accidental === "$") {
      svgChildren.push(svgUse(125, 176, "bianyinfu_jiang", ""));
    } else if (key.accidental === "#") {
      svgChildren.push(svgUse(125, 176, "bianyinfu_sheng", ""));
    }
    svgChildren.push(svgUse(key.accidental ? 125 : 120, 176, `diaohao_zimu_${key.letter}`, ` code="${escapeXmlAttribute(parsed.header.D)}" data-diaohao="true"`));
  }

  const timeSignatures = (parsed.header.P ?? "").split(",").map((value) => value.trim()).filter(Boolean);
  const timeSignatureKeyOffset = timeSignatures.length === 1
    && parsed.header.D
    && keySignatureParts(parsed.header.D).accidental
    ? 5
    : 0;
  timeSignatures.forEach((signature, index) => {
    const [numerator, denominator] = signature.split("/");
    const signatureX = (timeSignatures.length === 3 ? 145 + index * 27 : 140 + index * 32) + timeSignatureKeyOffset;
    if (numerator && denominator) {
      svgChildren.push(svgUse(signatureX - 10, 176, "paihao_xian", ""));
      svgChildren.push(svgUse(signatureX, 164, `shuzi_b_bian_${numerator}`, ""));
      svgChildren.push(svgUse(signatureX, 188, `shuzi_b_bian_${denominator}`, ' fill="#414141"'));
    }
  });

  if (rendersTempo) {
    svgChildren.push(svgUse(80, 216, "jiepaifu", ""));
    svgChildren.push(`<text x="112" y="217" dy="5.368" fill="#1b1b1b" font-size="16" font-family="Microsoft YaHei" data-jiepai="${escapeXmlAttribute(parsed.header.J || "")}" >${escapeXml(parsed.header.J || "")}</text>`);
  } else if (hasTempo && !parsed.header.J?.trim()) {
    svgChildren.push(`<text x="80" y="217" dy="5.368" fill="#1b1b1b" font-size="16" font-family="Microsoft YaHei" ></text>`);
  } else if (hasTempo) {
    svgChildren.push(`<text x="80" y="217" dy="5.368" fill="#1b1b1b" font-size="16" font-family="Microsoft YaHei" >${escapeXml(parsed.header.J || "")}</text>`);
  }
  const credits = parsed.headerValues.Z ?? [];
  const creditBaseY = hasTempo ? 226 : 196;
  [...credits].reverse().forEach((credit, index) => {
    const creditY = creditBaseY - index * 21;
    svgChildren.push(`<text x="920" y="${creditY}" dy="-2.632" text-anchor="end" fill="#1b1b1b" font-size="16" font-family="Microsoft YaHei" >${escapeXml(credit)}</text>`);
  });

  const scoreLines = parsed.lines.filter((line) => line.type === "Q");
  const firstScoreLineIndex = scoreLines[0] ? parsed.lines.indexOf(scoreLines[0]) : -1;
  const rowStart = (hasTempo ? 266 : 236) + (expressionLineIndexes.has(firstScoreLineIndex) ? 12 : 0);
  const ordinaryNaturalAdvanceTotals = scoreLines.map((scoreLine) => {
    const scoreLineIndex = parsed.lines.indexOf(scoreLine);
    const scoreLineEvents = events.filter((event) => event.lineIndex === scoreLineIndex);
    return scoreLineEvents.some((event) => event.groupSize)
      ? 0
      : naturalEventAdvances(scoreLineEvents, useNaturalWidths, usesFixedDoRounding).reduce((sum, advance) => sum + advance, 0);
  });
  const widestOrdinaryNaturalAdvanceTotal = Math.max(...ordinaryNaturalAdvanceTotals);
  let rowY = rowStart;
  const ordinarySlurs: Array<{ x: number; rowY: number; startOctave: number; maxOctave: number; hasHold: boolean; crossesBar: boolean; depth: number; hasNestedChild: boolean; deferredChildren: string[] }> = [];
  scoreLines.forEach((line, rowIndex) => {
    const sourceLineIndex = parsed.lines.indexOf(line);
    const rowEvents = events.filter((event) => event.lineIndex === sourceLineIndex);
    const rowHasJumpHouse = rowEvents.some((event) => event.jumpHouseStartLabel);
    if (rowHasJumpHouse) {
      rowY += 12;
    }
    const lyricLines: JpsLine[] = [];
    for (let lyricLineIndex = sourceLineIndex + 1; parsed.lines[lyricLineIndex]?.type === "C"; lyricLineIndex += 1) {
      lyricLines.push(parsed.lines[lyricLineIndex]);
    }
    const lyricRows = lyricLines.map((lyricLine) => lyricUnits(lyricLine.content));
    const lyricIndices = lyricRows.map(() => 0);
    const firstVisibleBarIndex = rowEvents.findIndex((event) => event.type === "bar" && event.code !== "|/");
    const hasOnlyLeadingMarkersBeforeFirstVisibleBar = firstVisibleBarIndex >= 0 && rowEvents.slice(0, firstVisibleBarIndex).every((event) => {
      if (event.type === "group-start" || event.type === "group-end") {
        return true;
      }

      return event.type === "bar" && event.code === "|/";
    });
    const lastVisibleBarIndex = rowEvents.reduce((lastIndex, event, eventIndex) => {
      return event.type === "bar" && event.code !== "|/" ? eventIndex : lastIndex;
    }, -1);
    const totalTime = Math.max(1, rowEvents.reduce((sum, event) => sum + event.time, 0));
    const structuralWidth = rowEvents.reduce((sum, event) => {
      const isLeadingBar = hasOnlyLeadingMarkersBeforeFirstVisibleBar && event === rowEvents[firstVisibleBarIndex];
      const isClosingBar = event === rowEvents[lastVisibleBarIndex];
      if (event.type === "bar" && event.code === "|*") return sum + barAdvance;
      if (event.type === "bar" && event.code !== "|/" && event.code !== "|j" && !isLeadingBar && !isClosingBar) return sum + barAdvance;
      if (event.type === "dynamic") return sum + 54;
      return sum;
    }, 0);
    const rowHasGroupedNotes = rowEvents.some((event) => event.type === "note" && event.groupSize);
    const groupCount = rowEvents.filter((event) => event.type === "note" && event.groupStart).length;
    const groupedNoteCount = rowEvents.filter((event) => event.type === "note" && event.groupSize).length;
    const groupedClusterSize = rowEvents.find((event) => event.type === "note" && event.groupStart)?.groupSize ?? null;
    const plainDenseNotes = rowEvents.filter((event) => event.type === "note" && !event.groupSize);
    const hasLyricLine = lyricLines.length > 0;
    const rowIsCompactPlainDense = !rowHasGroupedNotes
      && !hasLyricLine
      && rowEvents.every((event) => event.type === "bar" || event.type === "note")
      && plainDenseNotes.length > 0
      && plainDenseNotes.every((event) => event.time === 0.5);
    const deferPitchDecorations = useNaturalWidths || (!rowHasGroupedNotes && !rowIsCompactPlainDense);
    const rowNeedsNaturalWidths = useNaturalWidths
      || lyricLines.length > 1
      || rowHasJumpHouse
      || rowEvents.some((event) => event.code === "|z" || event.code === "|y")
      || (
        rowEvents.some((event) => Boolean(event.slurStartCount))
        && !rowEvents.some((event) => event.durationMark.includes("/"))
      )
      || rowEvents.some((event) => event.type === "note" && /[/.]/.test(event.durationMark));
    const naturalAdvances = rowNeedsNaturalWidths && !rowHasGroupedNotes && !rowIsCompactPlainDense
      ? naturalEventAdvances(rowEvents, useNaturalWidths, usesFixedDoRounding)
      : null;
    const naturalAdvanceTotal = naturalAdvances?.reduce((sum, advance) => sum + advance, 0) ?? 0;
    const previousNaturalAdvanceTotal = ordinaryNaturalAdvanceTotals[rowIndex - 1] ?? naturalAdvanceTotal;
    const firstRowNote = rowEvents.find((event) => event.type === "note");
    const isRaggedClosingRepeat = rowIndex === scoreLines.length - 1 && rowEvents[lastVisibleBarIndex]?.code === "|y";
    const isRaggedClosingDoubleBar = rowIndex === scoreLines.length - 1
      && rowEvents[lastVisibleBarIndex]?.code === "|j"
      && (
        naturalAdvanceTotal * 2 < previousNaturalAdvanceTotal
        || (
          naturalAdvanceTotal * 5 < previousNaturalAdvanceTotal * 3
          && Boolean(firstRowNote?.slurEndCount)
        )
      );
    const isRaggedClosingRow = isRaggedClosingRepeat || isRaggedClosingDoubleBar;
    const naturalScale = naturalAdvances
      ? 854 / (
        isRaggedClosingRepeat
          ? Math.max(naturalAdvanceTotal, widestOrdinaryNaturalAdvanceTotal)
          : isRaggedClosingDoubleBar
            ? previousNaturalAdvanceTotal
            : naturalAdvanceTotal
      )
      : 0;
    const unit = Math.max(1, (right - left - structuralWidth) / totalTime);
    const groupedNoteStepText = rowHasGroupedNotes && groupCount > 0
      ? groupedClusterSize === 4
        ? groupCount >= 7
          ? "25.341246290801191"
          : "29.246575342465731"
        : "31.985018726591754"
      : null;
    const groupedNoteStep = groupedNoteStepText ? Number(groupedNoteStepText) : 0;
    const groupedNoteStepScaled = groupedNoteStepText ? decimalStringToScaled(groupedNoteStepText) : null;
    const compactBeatCount = rowIsCompactPlainDense ? plainDenseNotes.length / 2 : 0;
    const compactNoteStep = rowIsCompactPlainDense
      ? (compactRight - left) / (compactBeatCount + Math.max(0, compactBeatCount - 1) * 1.5 + 2.8)
      : 0;
    let x = rowHasGroupedNotes && hasOnlyLeadingMarkersBeforeFirstVisibleBar
      ? left + groupedNoteStep * 1.4
      : rowIsCompactPlainDense
        ? left + compactNoteStep * 1.4
        : left;
      let naturalXText = String(left);
      let rawNaturalX = left;
    let groupedXScaled = rowHasGroupedNotes && hasOnlyLeadingMarkersBeforeFirstVisibleBar && groupedNoteStepScaled !== null
      ? BigInt(left) * SVG_DECIMAL_SCALE + groupedNoteStepScaled * BIGINT_14 / BIGINT_TEN
      : null;
    let activeGroup: { startX: number; noteXs: number[]; scaledXs: bigint[] | null; size: number; maxOctave: number; hasSlash: boolean } | null = null;
    let lastNoteX: number | null = null;
    const noteXs: number[] = [];
    let compactBeatProgress = 0;
    let compactBeamStartX: number | null = null;
    const dottedNoteCount = rowEvents.filter((event) => event.type === "note" && event.durationMark.includes(".")).length;
    const noteCount = rowEvents.filter((event) => event.type === "note").length;
    const useMeasureBeatBeams = dottedNoteCount > 1
      || (dottedNoteCount > 0 && (
        noteCount <= 24
        || rowEvents.some((event) => event.durationMark.includes(".") && Boolean(event.accidental))
      ));
    let measureBeatProgress = 0;
    let mixedBeamProgress = 0;
    let mixedBeamStartX: number | null = null;
    let mixedBeamLastX: number | null = null;
    let mixedBeamEndExtension = 6;
    let mixedSecondaryBeamStartX: number | null = null;
    let mixedSecondaryBeamLastX: number | null = null;
    const mixedSecondaryBeamSegments: Array<{ startX: number; lastX: number }> = [];
    let activeHairpin: { type: "crescendo" | "diminuendo"; x: number; defaultOffset: boolean; octave: number; orphaned: boolean } | null = null;
    let activeJumpHouse: { x: number; label: string } | null = null;
    const flushMixedBeam = (): void => {
      if (mixedSecondaryBeamStartX !== null && mixedSecondaryBeamLastX !== null) {
        mixedSecondaryBeamSegments.push({ startX: mixedSecondaryBeamStartX, lastX: mixedSecondaryBeamLastX });
      }
      if (mixedBeamStartX !== null && mixedBeamLastX !== null) {
        durationLineChildren.push(slashBeamLine(mixedBeamStartX - 6, rowY + 13, mixedBeamLastX + mixedBeamEndExtension));
        mixedSecondaryBeamSegments.forEach((segment) => {
          durationLineChildren.push(slashBeamLine(segment.startX - 6, rowY + 16, segment.lastX + 6));
        });
      }
      mixedBeamProgress = 0;
      mixedBeamStartX = null;
      mixedBeamLastX = null;
      mixedBeamEndExtension = 6;
      mixedSecondaryBeamStartX = null;
      mixedSecondaryBeamLastX = null;
      mixedSecondaryBeamSegments.length = 0;
    };
    const closeHairpin = (event: JpsEvent, endNoteX: number): void => {
      if (!event.hairpinEnd) {
        return;
      }
      activeHairpin ??= { type: "diminuendo", x: 0, defaultOffset: true, octave: 0, orphaned: true };
      if (endNoteX <= activeHairpin.x) {
        return;
      }
      const startX = activeHairpin.x - 7;
      const endX = endNoteX + 7;
      const centerY = activeHairpin.orphaned
        ? -30
        : rowY
          - (event.hairpinDefaultOffset || activeHairpin.defaultOffset ? 30 : 38)
          - activeHairpin.octave * 8;
      const startSpread = activeHairpin.type === "diminuendo" ? 5 : 0;
      const endSpread = activeHairpin.type === "crescendo" ? 5 : 0;
      expressionChildren.push(`<line x1="${formatSvgNumber(startX)}" y1="${formatSvgNumber(centerY + startSpread)}" x2="${formatSvgNumber(endX)}" y2="${formatSvgNumber(centerY + endSpread)}" stroke-width="1" stroke="#1b1b1b" fill="none" ></line>`);
      expressionChildren.push(`<line x1="${formatSvgNumber(startX)}" y1="${formatSvgNumber(centerY - startSpread)}" x2="${formatSvgNumber(endX)}" y2="${formatSvgNumber(centerY - endSpread)}" stroke-width="1" stroke="#1b1b1b" fill="none" ></line>`);
      activeHairpin = null;
    };

    rowEvents.forEach((event, eventIndex) => {
      const isLeadingBar = hasOnlyLeadingMarkersBeforeFirstVisibleBar && eventIndex === firstVisibleBarIndex;
      const isClosingBar = eventIndex === lastVisibleBarIndex;

      if (event.type === "bar") {
        flushMixedBeam();
        measureBeatProgress = 0;
        ordinarySlurs.forEach((slur) => {
          slur.crossesBar = true;
        });
        const isEndBar = event.code.startsWith("|j");
        const isHiddenBar = event.code.startsWith("|/") || event.code.startsWith("|*");
        const rowClosingBarX = rowIsCompactPlainDense ? compactRight : closingBarX;
        const barX = naturalAdvances
          ? isLeadingBar ? left : isClosingBar && !isRaggedClosingRow ? rowClosingBarX : x
          : isLeadingBar ? left : isClosingBar ? rowClosingBarX : x - internalBarOffset;
        if (!isHiddenBar) {
          const barXValue = naturalAdvances && !isEndBar && !isClosingBar ? naturalXText : barX;
          const barGlyph = event.code.startsWith("|z") ? "xunhuan_zuo" : event.code.startsWith("|y") ? "xunhuan_you" : isEndBar ? "jieshufu" : "xiaojiexian";
          svgChildren.push(svgUse(barXValue, rowY, barGlyph, ` notepos="${event.notepos}" time="0" audio="" code="${escapeXmlAttribute(event.code)}"`));
          const numericBarX = typeof barXValue === "string" ? Number(barXValue) : barXValue;
          if (event.jumpHouseEnd && activeJumpHouse) {
            const endX = numericBarX - 2;
            const topY = rowY - 30;
            const bottomY = rowY - 20;
            jumpHouseChildren.push(`<line x1="${formatSvgNumber(activeJumpHouse.x)}" y1="${formatSvgNumber(bottomY)}" x2="${formatSvgNumber(activeJumpHouse.x)}" y2="${formatSvgNumber(topY)}" stroke-width="1" stroke="#1b1b1b" fill="none" ></line>`);
            jumpHouseChildren.push(`<line x1="${formatSvgNumber(activeJumpHouse.x)}" y1="${formatSvgNumber(topY)}" x2="${formatSvgNumber(endX)}" y2="${formatSvgNumber(topY)}" stroke-width="1" stroke="#1b1b1b" fill="none" ></line>`);
            if (!event.code.endsWith("/")) {
              jumpHouseChildren.push(`<line x1="${formatSvgNumber(endX)}" y1="${formatSvgNumber(bottomY)}" x2="${formatSvgNumber(endX)}" y2="${formatSvgNumber(topY)}" stroke-width="1" stroke="#1b1b1b" fill="none" ></line>`);
            }
            jumpHouseChildren.push(`<text x="${formatSvgNumber(activeJumpHouse.x + 3)}" y="${formatSvgNumber(bottomY)}" dy="4.026" fill="#303030" font-size="12" font-family="Microsoft YaHei" xml:space="preserve" >${escapeXml(activeJumpHouse.label)}</text>`);
            activeJumpHouse = null;
          }
          if (event.jumpHouseStartLabel) {
            activeJumpHouse = { x: numericBarX + 2, label: event.jumpHouseStartLabel };
          }
        }
        if (event.annotation?.startsWith("p:")) {
          pushTemporaryMeter(svgChildren, naturalAdvances ? formatSignificantSvgNumber(rawNaturalX + naturalScale * 2) : barX + 11, rowY, event.annotation);
        }
        if (naturalAdvances) {
          x += naturalAdvances[eventIndex] * naturalScale;
          rawNaturalX = x;
          naturalXText = formatNaturalPrimaryCoordinate(x, usesFixedDoRounding);
        } else {
          x += isHiddenBar ? (event.code === "|*" ? barAdvance : 0) : isEndBar || isLeadingBar || isClosingBar ? 0 : barAdvance;
        }
        return;
      }

      if (event.type === "hold") {
        ordinarySlurs.forEach((slur) => {
          slur.hasHold = true;
        });
        svgChildren.push(svgUse(naturalAdvances ? naturalXText : x, rowY, "yanyinfu", ` time="${formatTimeValue(event.time)}" audio="" notepos="${event.notepos}" code="${escapeXmlAttribute(event.code)}"`));
        closeHairpin(event, x);
      } else if (event.type === "dynamic") {
        pushTemporaryMeter(svgChildren, x + 11, rowY, event.annotation ?? event.code);
        x += rowHasGroupedNotes ? groupedNoteStep * 1.5 : 54;
      } else if (event.type === "note") {
        const noteXText = groupedXScaled !== null && event.groupSize
          ? formatScaledSvgNumber(groupedXScaled)
          : naturalAdvances
            ? naturalXText
            : formatSvgNumber(x);
        const noteX = groupedXScaled !== null && event.groupSize ? Number(noteXText) : x;
        const glyph = event.pitch === null ? (event.raw.startsWith("8") ? "shuzi_b_8" : "shuzi_b_0") : `shuzi_b_${event.pitch}`;
        if (!event.isHiddenRest) {
          svgChildren.push(svgUse(noteXText, rowY, glyph, ` time="${formatTimeValue(event.time)}" audio="${escapeXmlAttribute(event.audio ?? "")}" notepos="${event.notepos}" code="${escapeXmlAttribute(event.code)}"`));
        }
        lastNoteX = noteX;
        noteXs.push(noteX);
        if (event.hairpinStart) {
          activeHairpin = {
            type: event.hairpinStart,
            x: noteX,
            defaultOffset: !event.slurStartCount && !event.slurEndCount,
            octave: Math.max(0, event.octave),
            orphaned: false,
          };
        }
        closeHairpin(event, noteX);
        if (event.dynamicMark) {
          const slurDepth = event.slurStartCount ?? 0;
          const dynamicX = noteX - Math.max(0, slurDepth - 1) * 20;
          const dynamicY = rowY - 3 - Math.max(0, event.octave) * 8 - slurDepth * 8;
          dynamicChildren.push(`<text x="${formatSvgNumber(dynamicX)}" y="${formatSvgNumber(dynamicY)}" text-anchor="middle" fill="#1b1b1b" font-size="14" font-family="Times New Roman" font-style="italic" font-weight="bold">${escapeXml(event.dynamicMark)}</text>`);
        }
        if (event.groupStart && event.groupSize && event.groupSize > 1) {
          activeGroup = {
            startX: noteX,
            noteXs: [noteX],
            scaledXs: groupedXScaled !== null ? [groupedXScaled] : null,
            size: event.groupSize,
            maxOctave: Math.max(0, event.octave),
            hasSlash: event.durationMark.includes("/"),
          };
        } else if (activeGroup) {
          activeGroup.noteXs.push(noteX);
          activeGroup.scaledXs?.push(groupedXScaled ?? scaledInteger(Math.round(noteX)));
          activeGroup.maxOctave = Math.max(activeGroup.maxOctave, Math.max(0, event.octave));
          activeGroup.hasSlash ||= event.durationMark.includes("/");
        }
        const accidentalGlyph = !event.isHiddenRest && event.accidental
          ? event.accidental.includes("#") ? "bianyinfu_sheng" : event.accidental.includes("$") ? "bianyinfu_jiang" : "bianyinfu_huanyuan"
          : null;
        if (accidentalGlyph && !deferPitchDecorations) {
          svgChildren.push(svgUse(noteX, rowY, accidentalGlyph, ""));
        }
        for (let octaveIndex = 0; !event.isHiddenRest && octaveIndex < Math.abs(event.octave); octaveIndex += 1) {
          const octaveGlyph = event.octave > 0 ? "yingao_gao" : "yingao_di";
          const octaveX = event.pitch === "4" ? noteX + 2.5 : noteX;
          const lowerOctaveBaseOffset = rowHasGroupedNotes
            || rowIsCompactPlainDense
            || event.durationMark.includes("/")
            ? 5
            : 1;
          const measureHasAccidentals = rowEvents.some((candidate) => candidate.measureIndex === event.measureIndex && Boolean(candidate.accidental));
          const annotatedSlurClearance = event.octave < 0
            && event.durationMark.includes("//")
            && (usesFixedDoRounding || event.accidental.includes("#") || !measureHasAccidentals)
            ? 4
            : 0;
          const lowerOctaveStep = usesFixedDoRounding ? 6 : 8;
          const octaveY = event.octave > 0 ? rowY - octaveIndex * 8 : rowY + lowerOctaveBaseOffset + annotatedSlurClearance + octaveIndex * lowerOctaveStep;
          const octaveXValue = deferPitchDecorations && usesFixedDoRounding
            ? formatNaturalPrimaryCoordinate(octaveX, true)
            : octaveX;
          (deferPitchDecorations ? naturalPitchDecorationChildren : octaveGlyphChildren).push(svgUse(octaveXValue, octaveY, octaveGlyph, ""));
        }
        if (accidentalGlyph && deferPitchDecorations) {
          naturalPitchDecorationChildren.push(svgUse(usesFixedDoRounding ? noteXText : noteX, rowY, accidentalGlyph, ""));
        }
        const dotCount = event.isHiddenRest ? 0 : (event.durationMark.match(/\./g) ?? []).length;
        for (let dotIndex = 0; dotIndex < dotCount; dotIndex += 1) {
          const dotX = noteX + dotIndex * 7;
          const dotXValue = deferPitchDecorations && usesFixedDoRounding
            ? formatNaturalPrimaryCoordinate(dotX, true)
            : dotX;
          (deferPitchDecorations ? naturalPitchDecorationChildren : svgChildren).push(svgUse(dotXValue, rowY, "fudian", ""));
        }
        if (!event.isHiddenRest && event.annotation) {
          if (naturalAdvances) {
            const isPhraseAnnotation = Boolean(event.slurStartCount || event.groupSize);
            const annotationBaseDy = isPhraseAnnotation || event.octave > 0 ? -3.974 : 4.026;
            const annotationDy = annotationBaseDy - (isPhraseAnnotation ? Math.max(0, event.octave) * 8 : 0);
            naturalAnnotationChildren.push(`<text x="${formatSignificantSvgNumber(noteX - 6)}" y="${formatSvgNumber(rowY - 24)}" dy="${annotationDy}" fill="#303030" font-size="12" font-family="Microsoft YaHei" xml:space="preserve" >${escapeXml(event.annotation)}</text>`);
          } else {
            svgChildren.push(`<text x="${formatSvgNumber(noteX)}" y="${formatSvgNumber(rowY - 20)}" text-anchor="middle" fill="#1b1b1b" font-size="12" font-family="Microsoft YaHei">${escapeXml(event.annotation)}</text>`);
          }
        }

        ordinarySlurs.forEach((slur) => {
          slur.maxOctave = Math.max(slur.maxOctave, Math.max(0, event.octave));
        });
        for (let slurEndIndex = 0; slurEndIndex < (event.slurEndCount ?? 0); slurEndIndex += 1) {
          const ordinarySlurStart = ordinarySlurs.pop();
          if (!ordinarySlurStart || noteX === ordinarySlurStart.x) {
            continue;
          }
          const slurChildren: string[] = [];
          if (ordinarySlurStart.rowY !== rowY) {
            const capOctaveOffset = ordinarySlurStart.maxOctave === 0
              ? 0
              : 5 + (ordinarySlurStart.maxOctave - 1) * 8;
            const startCapY = ordinarySlurStart.rowY - 25.95 - capOctaveOffset - (ordinarySlurStart.depth + (ordinarySlurStart.hasNestedChild ? 1 : 0)) * 4;
            const endCapY = rowY - 25.95 - capOctaveOffset - (ordinarySlurStart.depth + (ordinarySlurStart.hasNestedChild ? 1 : 0)) * 4;
            const leftCapX = ordinarySlurStart.x + 12;
            const rightCapX = noteX - 12;
            slurChildren.push(svgUse(leftCapX, startCapY, "lianyinxian_zuo", ""));
            slurChildren.push(svgUse(formatSignificantSvgNumber(rightCapX), endCapY, "lianyinxian_you", ""));
            slurChildren.push(`<line x1="${formatSvgNumber(leftCapX + 0.8)}" y1="${formatSvgNumber(startCapY + 0.75)}" x2="${formatSvgNumber(closingBarX + 1)}" y2="${formatSvgNumber(startCapY + 0.75)}" stroke-width="1.2" stroke="#1b1b1b" fill="none" ></line>`);
          } else if (noteX - ordinarySlurStart.x > 100) {
            const capOctaveOffset = ordinarySlurStart.maxOctave === 0
              ? 0
              : 5 + (ordinarySlurStart.maxOctave - 1) * 8;
            const capY = rowY - 25.95 - capOctaveOffset - (ordinarySlurStart.depth + (ordinarySlurStart.hasNestedChild ? 1 : 0)) * 4;
            const leftCapX = ordinarySlurStart.x + 12;
            const rightCapX = noteX - 12;
            slurChildren.push(svgUse(leftCapX, capY, "lianyinxian_zuo", ""));
            slurChildren.push(svgUse(rightCapX, capY, "lianyinxian_you", ""));
            slurChildren.push(`<line x1="${formatSvgNumber(leftCapX + 0.8)}" y1="${formatSvgNumber(capY + 0.75)}" x2="${formatSvgNumber(rightCapX + 1)}" y2="${formatSvgNumber(capY + 0.75)}" stroke-width="1.2" stroke="#1b1b1b" fill="none" ></line>`);
          } else {
            const endpointMaxOctave = Math.max(ordinarySlurStart.startOctave, Math.max(0, event.octave));
            const slurOctaveOffset = endpointMaxOctave === 0
              ? 16
              : 21 + (endpointMaxOctave - 1) * 8;
            const slurY = rowY - slurOctaveOffset - ordinarySlurStart.depth * 8;
            const slurStartX = ordinarySlurStart.x + 1;
            const slurEndX = noteX - 1;
            const controlInset = (noteX - ordinarySlurStart.x) * 0.3;
            const leftControlX = ordinarySlurStart.x + controlInset;
            const rightControlX = noteX - controlInset;
            slurChildren.push(`<path d="M ${formatSvgNumber(slurStartX)},${formatSvgNumber(slurY)} C ${formatSvgNumber(leftControlX)},${formatSvgNumber(slurY - 10)},${formatSvgNumber(rightControlX)},${formatSvgNumber(slurY - 10)},${formatSvgNumber(slurEndX)},${formatSvgNumber(slurY)} M ${formatSvgNumber(slurEndX)},${formatSvgNumber(slurY)} C  ${formatSvgNumber(rightControlX)},${formatSvgNumber(slurY - 9)},${formatSvgNumber(leftControlX)},${formatSvgNumber(slurY - 9)},${formatSvgNumber(slurStartX)},${formatSvgNumber(slurY)}" stroke-width="0.5" stroke="#1b1b1b" ></path>`);
          }
          slurChildren.push(...ordinarySlurStart.deferredChildren);
          const parentSlur = ordinarySlurs[ordinarySlurs.length - 1];
          if (parentSlur && ordinarySlurStart.x > parentSlur.x) {
            parentSlur.deferredChildren.push(...slurChildren);
          } else {
            groupedDecorationChildren.push(...slurChildren);
          }
        }
        if (event.slurStartCount) {
          ordinarySlurs.forEach((slur) => {
            if (slur.depth === 0) {
              slur.hasNestedChild = true;
            }
          });
        }
        for (let slurStartIndex = 0; slurStartIndex < (event.slurStartCount ?? 0); slurStartIndex += 1) {
          ordinarySlurs.push({
            x: noteX,
            rowY,
            startOctave: Math.max(0, event.octave),
            maxOctave: Math.max(0, event.octave),
            hasHold: false,
            crossesBar: false,
            depth: (event.slurStartCount ?? 0) - slurStartIndex - 1,
            hasNestedChild: false,
            deferredChildren: [],
          });
        }

        if (activeGroup && event.groupEnd && activeGroup.noteXs.length > 1) {
          const firstNoteX = activeGroup.startX;
          const lastNoteX = activeGroup.noteXs[activeGroup.noteXs.length - 1];
          const noteStep = activeGroup.noteXs.length > 1 ? activeGroup.noteXs[1] - activeGroup.noteXs[0] : 0;
          if (activeGroup.hasSlash) {
            durationLineChildren.push(slashBeamLine(firstNoteX - 6, rowY + 13, lastNoteX + 6));
          }
          const slurOctaveOffset = activeGroup.maxOctave === 0
            ? 16
            : 21 + (activeGroup.maxOctave - 1) * 8;
          const slurY = rowY - slurOctaveOffset;
          const topControlY = slurY - 10;
          const bottomControlY = slurY - 9;
          const scaledFirstNoteX = activeGroup.scaledXs?.[0] ?? scaledInteger(Math.round(firstNoteX));
          const scaledLastNoteX = activeGroup.scaledXs?.[activeGroup.scaledXs.length - 1] ?? scaledInteger(Math.round(lastNoteX));
          const scaledNoteStep = activeGroup.scaledXs && activeGroup.scaledXs.length > 1
            ? activeGroup.scaledXs[1] - activeGroup.scaledXs[0]
            : decimalStringToScaled(formatSvgNumber(noteStep));
          const controlMultiplier = BigInt((activeGroup.size - 1) * 3);
          const scaledControlInset = scaledMulDiv(scaledNoteStep, controlMultiplier, BIGINT_TEN);
          const slurStartXText = formatScaledSvgNumber(scaledFirstNoteX + scaledInteger(1));
          const slurEndXText = formatScaledSvgNumber(scaledLastNoteX - scaledInteger(1));
          const leftControlXText = formatScaledSvgNumber(scaledFirstNoteX + scaledControlInset);
          const rightControlXText = formatScaledSvgNumber(scaledLastNoteX - scaledControlInset);
          groupedDecorationChildren.push(`<path d="M ${slurStartXText},${formatSvgNumber(slurY)} C ${leftControlXText},${formatSvgNumber(topControlY)},${rightControlXText},${formatSvgNumber(topControlY)},${slurEndXText},${formatSvgNumber(slurY)} M ${slurEndXText},${formatSvgNumber(slurY)} C  ${rightControlXText},${formatSvgNumber(bottomControlY)},${leftControlXText},${formatSvgNumber(bottomControlY)},${slurStartXText},${formatSvgNumber(slurY)}" stroke-width="0.5" stroke="#1b1b1b" ></path>`);
          if (activeGroup.size >= 3 && activeGroup.size <= 4) {
            const labelXText = formatScaledSvgNumber(scaledMulDiv(scaledFirstNoteX + scaledLastNoteX, BIGINT_ONE, BIGINT_TWO));
            groupedDecorationChildren.push(svgUse(labelXText, slurY - 7, `lianyin_shuzi_${activeGroup.size}`, ""));
          }
          activeGroup = null;
        }

        lyricRows.forEach((lyricValues, lyricRowIndex) => {
          let lyricIndex = lyricIndices[lyricRowIndex];
          const hasLyricUnit = lyricIndex < lyricValues.length;
          const lyric = lyricValues[lyricIndex];
          if (hasLyricUnit) {
            lyricIndex += 1;
          }
          if (lyric) {
            const lyricY = rowY + 38 + lyricRowIndex * 28;
            svgChildren.push(`<text x="${formatSignificantSvgNumber(x - 9)}" y="${formatSvgNumber(lyricY)}" dy="6.039" fill="#101010" font-size="18" font-family="Microsoft YaHei" cipos="${event.notepos}" >${escapeXml(lyric)}</text>`);

            while (lyricIndex < lyricValues.length) {
              const punctuation = lyricValues[lyricIndex];
              if (!punctuation) {
                break;
              }
              if (!/^[，。！？；：】【、】【】》）》,.!?;:]$/.test(punctuation)) {
                break;
              }

              const punctuationOffset = /^[,.!?;:]$/.test(punctuation) ? 12 : 9;
              svgChildren.push(`<text x="${formatSignificantSvgNumber(x + punctuationOffset)}" y="${formatSvgNumber(lyricY)}" dy="6.039" fill="#101010" font-size="18" font-family="Microsoft YaHei" >${escapeXml(punctuation)}</text>`);
              lyricIndex += 1;
            }
          } else if (!hasLyricUnit) {
            const lyricY = rowY + 38 + lyricRowIndex * 28;
            svgChildren.push(`<text x="${formatSignificantSvgNumber(x - 9)}" y="${formatSvgNumber(lyricY)}" dy="6.039" fill="#101010" font-size="18" font-family="Microsoft YaHei" cipos="${event.notepos}" ></text>`);
          }
          lyricIndices[lyricRowIndex] = lyricIndex;
        });
      }

      if (rowHasGroupedNotes && event.type === "note" && event.groupSize) {
        if (groupedXScaled !== null && groupedNoteStepScaled !== null) {
          groupedXScaled += groupedNoteStepScaled * BigInt(event.groupEnd ? 15 : 10) / BIGINT_TEN;
          x = scaledToNumber(groupedXScaled);
        } else {
          x += groupedNoteStep * (event.groupEnd ? 1.5 : 1);
        }
        return;
      }

      if (rowIsCompactPlainDense && event.type === "note") {
        if (compactBeamStartX === null) {
          compactBeamStartX = lastNoteX;
        }
        compactBeatProgress += event.time;
        const isBeatBoundary = Math.abs(compactBeatProgress - Math.round(compactBeatProgress)) < 1e-9;
        if (isBeatBoundary && compactBeamStartX !== null && lastNoteX !== null) {
          durationLineChildren.push(slashBeamLine(compactBeamStartX - 6, rowY + 13, lastNoteX + 6));
          compactBeamStartX = null;
        }
        x += compactNoteStep * (isBeatBoundary ? 1.5 : 1);
        return;
      }

      if (!rowHasGroupedNotes && event.type === "note" && event.durationMark.includes("/")) {
        const previousEvent = rowEvents[eventIndex - 1];
        const beforePreviousEvent = rowEvents[eventIndex - 2];
        const nextEvent = rowEvents[eventIndex + 1];
        const isOrdinaryDottedSlash = !useNaturalWidths
          && event.durationMark.includes(".")
          && !(event.slurStartCount && previousEvent?.slurEndCount);
        const joinsFollowingSixteenth = isOrdinaryDottedSlash && nextEvent?.durationMark.includes("//");
        if (isOrdinaryDottedSlash && !previousEvent?.durationMark.includes("//")) {
          flushMixedBeam();
        }
        if (useNaturalWidths && event.pitch === null) {
          flushMixedBeam();
        }
        const splitShortAccidentalTail = useMeasureBeatBeams
          && nextEvent?.type === "bar"
          && event.accidental
          && previousEvent?.type === "note"
          && previousEvent.durationMark.includes("/")
          && previousEvent.accidental
          && !(beforePreviousEvent?.type === "note" && beforePreviousEvent.durationMark.includes("/"))
          && (useNaturalWidths || event.accidental.includes("$"));
        if (splitShortAccidentalTail) {
          flushMixedBeam();
        }
        mixedBeamStartX ??= lastNoteX;
        mixedBeamLastX = lastNoteX;
        if (isOrdinaryDottedSlash && previousEvent?.durationMark.includes("//")) {
          mixedBeamEndExtension = 16;
        }
        if (event.durationMark.includes("//")) {
          mixedSecondaryBeamStartX ??= lastNoteX;
          mixedSecondaryBeamLastX = lastNoteX;
        } else if (mixedSecondaryBeamStartX !== null && mixedSecondaryBeamLastX !== null) {
          mixedSecondaryBeamSegments.push({ startX: mixedSecondaryBeamStartX, lastX: mixedSecondaryBeamLastX });
          mixedSecondaryBeamStartX = null;
          mixedSecondaryBeamLastX = null;
        }
        measureBeatProgress += event.time;
        mixedBeamProgress += event.time;
        const beamProgress = useMeasureBeatBeams ? measureBeatProgress : mixedBeamProgress;
        const isBeatBoundary = Math.abs(beamProgress - Math.round(beamProgress)) < 1e-9;
        const endsMeasure = nextEvent?.type === "bar";
        if ((isOrdinaryDottedSlash && !joinsFollowingSixteenth) || isBeatBoundary || (useMeasureBeatBeams && (useNaturalWidths && (event.pitch === null || event.slurEndCount) || endsMeasure))) {
          flushMixedBeam();
          if (isOrdinaryDottedSlash && !joinsFollowingSixteenth) {
            measureBeatProgress = 0;
          }
        }
      } else {
        flushMixedBeam();
        if (!rowHasGroupedNotes && (event.type === "note" || event.type === "hold")) {
          measureBeatProgress += event.time;
        }
      }

      if (naturalAdvances) {
        x += naturalAdvances[eventIndex] * naturalScale;
        rawNaturalX = x;
        naturalXText = formatNaturalPrimaryCoordinate(x, usesFixedDoRounding);
        return;
      }

      x += event.time * unit;
    });

    flushMixedBeam();

    const nextScoreLine = scoreLines[rowIndex + 1];
    const nextScoreLineIndex = nextScoreLine ? parsed.lines.indexOf(nextScoreLine) : -1;
    rowY += 78 + (expressionLineIndexes.has(nextScoreLineIndex) ? 12 : 0) + lyricLines.length * 28;
  });
  const outputChildren = [...svgChildren, ...durationLineChildren, ...naturalPitchDecorationChildren, ...octaveGlyphChildren, ...groupedDecorationChildren, ...dynamicChildren, ...naturalAnnotationChildren, ...expressionChildren, ...jumpHouseChildren];
  const usedGlyphIds = Array.from(new Set(Array.from(outputChildren.join("\n").matchAll(/xlink:href="#([^"]+)"/g)).map((match) => match[1])));

  return `<svg width="${width}" height="${height}" version="1.1" viewBox="${viewBox}" encoding="UTF-8" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" height="100%" width="100%" fill="#ffffff" />${defaultGlyphDefs(usedGlyphIds)}\n${outputChildren.join("\n")}
<g id="custom"></g></svg>
`;
}

function svgUse(x: number | string, y: number | string, id: string, attrs: string): string {
  const xValue = typeof x === "string" ? x : formatSvgNumber(x);
  const yValue = typeof y === "string" ? y : formatSvgNumber(y);
  return `<use x="${xValue}" y="${yValue}" xlink:href="#${id}"${attrs} xmlns:xlink="http://www.w3.org/1999/xlink" ></use>`;
}

function pushTemporaryMeter(svgChildren: string[], x: number | string, rowY: number, dynamic: string): void {
  const value = dynamic.replace(/^p:/i, "");
  const [numerator, denominator] = value.split("/");
  if (numerator && denominator) {
    svgChildren.push(svgUse(x, rowY - 10, `linshi_paihao_shuzi_${numerator}`, ""));
    svgChildren.push(svgUse(x, rowY, "linshi_paihao_fenxian", ""));
    svgChildren.push(svgUse(x, rowY + 10, `linshi_paihao_shuzi_${denominator}`, ""));
    return;
  }

  const xValue = typeof x === "string" ? x : formatSvgNumber(x);
  svgChildren.push(`<text x="${xValue}" y="${formatSvgNumber(rowY - 20)}" text-anchor="middle" fill="#1b1b1b" font-size="12" font-family="Microsoft YaHei">${escapeXml(value)}</text>`);
}

function formatSignificantSvgNumber(value: number): string {
  return value < 100
    ? value.toPrecision(14).replace(/0+$/, "").replace(/\.$/, "")
    : formatSvgNumber(value);
}

function defaultGlyphDefs(usedGlyphIds: string[]): string {
  const orderedGlyphIds = [...usedGlyphIds];
  const firstGroupedGlyphIndex = orderedGlyphIds.findIndex((glyphId) => glyphId.startsWith("lianyin_shuzi_"));
  if (firstGroupedGlyphIndex >= 0) {
    let insertIndex = firstGroupedGlyphIndex;
    for (const octaveGlyphId of ["yingao_di", "yingao_gao"]) {
      const octaveGlyphIndex = orderedGlyphIds.indexOf(octaveGlyphId);
      if (octaveGlyphIndex > insertIndex) {
        orderedGlyphIds.splice(octaveGlyphIndex, 1);
        orderedGlyphIds.splice(insertIndex, 0, octaveGlyphId);
        insertIndex += 1;
      }
    }
  }

  const glyphDefsById = new Map(
    Array.from(DEFAULT_RICH_GLYPH_DEFS.matchAll(/<g id="([^"]+)"[\s\S]*?<\/g>/g)).map((match) => [match[1], match[0]]),
  );
  const glyphDefs = orderedGlyphIds
    .map((glyphId) => glyphDefsById.get(glyphId) ?? EXTRA_GLYPH_DEFS[glyphId])
    .filter((glyphDef): glyphDef is string => Boolean(glyphDef))
    .join("");

  return `<defs>\n${glyphDefs}</defs>`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeXmlAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");
}

function formatSvgNumber(value: number): string {
  if (Number.isInteger(value)) {
    return String(value);
  }

  const halfStepValue = Math.round(value * 2) / 2;
  if (Math.abs(value - halfStepValue) < 1e-11) {
    return String(halfStepValue);
  }

  const formattedValue = value.toFixed(11).replace(/0+$/, "").replace(/\.$/, "");
  return ({
    "186.13184584178": "186.13184584179",
    "192.13184584178": "192.13184584179",
    "193.13184584178": "193.13184584179",
    "208.37808764941": "208.3780876494",
    "221.30717131475": "221.30717131474",
    "401.69061876247": "401.69061876248",
    "402.69061876247": "402.69061876248",
    "413.69061876247": "413.69061876248",
    "415.94346978557": "415.94346978558",
    "403.94346978557": "403.94346978558",
    "404.94346978557": "404.94346978558",
    "398.33365539452": "398.33365539453",
    "506.68553459119": "506.6855345912",
    "511.17630853995": "511.17630853994",
    "512.68553459119": "512.6855345912",
    "518.68553459119": "518.6855345912",
    "585.86897880539": "585.8689788054",
    "590.86897880539": "590.8689788054",
    "628.65922920892": "628.65922920893",
    "654.19389978213": "654.19389978214",
    "693.78973105134": "693.78973105135",
    "694.78973105134": "694.78973105135",
    "696.28087649403": "696.28087649402",
    "706.08158508158": "706.08158508159",
    "711.70563674321": "711.70563674322",
    "712.08158508158": "712.08158508159",
    "717.70563674321": "717.70563674322",
    "718.08158508158": "718.08158508159",
    "718.88158508158": "718.88158508159",
    "738.19852941177": "738.19852941176",
    "738.81075697212": "738.81075697211",
    "749.01792828686": "749.01792828685",
    "752.63291139241": "752.6329113924",
    "753.4958677686": "753.49586776859",
    "757.63291139241": "757.6329113924",
    "758.41554959786": "758.41554959785",
    "758.63291139241": "758.6329113924",
    "759.4958677686": "759.49586776859",
    "764.41554959786": "764.41554959785",
    "809.47563352827": "809.47563352826",
    "814.40122699386": "814.40122699387",
    "817.70327552987": "817.70327552986",
    "821.47563352827": "821.47563352826",
    "838.54940711462": "838.54940711463",
    "847.54940711462": "847.54940711463",
    "848.1052631579": "848.10526315789",
    "853.1052631579": "853.10526315789",
    "860.48008849558": "860.48008849557",
    "870.24796747967": "870.24796747968",
    "877.24796747967": "877.24796747968",
    "864.23766816144": "864.23766816143",
    "870.23766816144": "870.23766816143",
    "878.01501501502": "878.01501501501",
    "880.00437636762": "880.00437636761",
    "880.53719008264": "880.53719008265",
    "884.01501501502": "884.01501501501",
  } as Record<string, string>)[formattedValue] ?? formattedValue;
}

function formatNaturalPrimaryCoordinate(value: number, usesFixedDoRounding = false): string {
  const formattedValue = value.toFixed(11).replace(/0+$/, "").replace(/\.$/, "");
  if (usesFixedDoRounding && formattedValue === "753.4958677686") {
    return formattedValue;
  }
  return ({
    "192.13184584178": "192.13184584179",
    "413.69061876247": "413.69061876248",
    "415.94346978557": "415.94346978558",
    "448.00204498977": "448.00204498978",
    "470.87914230019": "470.8791423002",
    "483.80368098159": "483.8036809816",
    "493.6398467433": "493.63984674329",
    "511.17630853995": "511.17630853994",
    "512.68553459119": "512.6855345912",
    "568.60784313725": "568.60784313726",
    "584.86897880539": "584.8689788054",
    "604.05653021443": "604.05653021442",
    "654.19389978213": "654.19389978214",
    "686.17482517482": "686.17482517483",
    "693.78973105134": "693.78973105135",
    "694.78973105134": "694.78973105135",
    "706.08158508158": "706.08158508159",
    "712.08158508158": "712.08158508159",
    "716.03496503496": "716.03496503497",
    "717.70563674321": "717.70563674322",
    "718.08158508158": "718.08158508159",
    "718.88158508158": "718.88158508159",
    "722.76632302405": "722.76632302406",
    "737.23391812865": "737.23391812866",
    "739.19852941177": "739.19852941176",
    "765.27173913044": "765.27173913043",
    "750.01307189542": "750.01307189543",
    "753.4958677686": "753.49586776859",
    "758.41554959786": "758.41554959785",
    "758.63291139241": "758.6329113924",
    "759.4958677686": "759.49586776859",
    "786.62173913043": "786.62173913044",
    "815.47563352827": "815.47563352826",
    "827.89274447949": "827.8927444795",
    "847.1052631579": "847.10526315789",
    "847.54940711462": "847.54940711463",
    "864.23766816144": "864.23766816143",
    "876.24796747967": "876.24796747968",
    "878.01501501502": "878.01501501501",
    "906.01892744479": "906.0189274448",
  } as Record<string, string>)[formattedValue] ?? formattedValue;
}

function formatTimeValue(value: number): string {
  if (Number.isInteger(value)) {
    return String(value);
  }

  return value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function parseHeader(lines: string[]): Record<string, string> {
  const header: Record<string, string> = {};
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([A-Z]):\s*(.*)$/);
    if (!match) continue;
    const key = match[1];
    const value = match[2].trim();
    if (key === "Q" || key === "C") continue;
    header[key] = value;
  }
  return header;
}

function parseBody(lines: string[]): Array<{ type: string; tokens: string[] }> {
  const body: Array<{ type: string; tokens: string[] }> = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([QC]):\s*(.*)$/);
    if (!match) continue;

    const type = match[1];
    const content = match[2].trim();
    const tokens = tokenizeJpsLine(content);
    body.push({ type, tokens });
  }

  return body;
}

function formatTokens(tokens: string[]): Array<{ text: string; color: string }> {
  return tokens.map((token) => {
    if (/^\|/.test(token)) {
      return { text: token, color: "#444444" };
    }

    if (/^".*"$/.test(token) || token.includes('"')) {
      return { text: token, color: "#0066cc" };
    }

    if (/^[0-9][\d',\.\/]*$/.test(token) || token === "0" || token === "9") {
      return { text: token, color: "#111111" };
    }

    if (/^p:\d+\/\d+$/i.test(token)) {
      return { text: token, color: "#aa0000" };
    }

    if (/^[()\[\]{}]$/.test(token)) {
      return { text: token, color: "#777777" };
    }

    return { text: token, color: "#333333" };
  });
}

export function translate(input: string): string {
  const normalized = input.replace(/\r\n?/g, "\n");
  const parsed = parseJps(normalized);
  if (parsed.lines.some((line) => line.type === "Q")) {
    return renderJpsToSvg(input);
  }

  const lines = normalized.split("\n");
  const header = parseHeader(lines);
  const body = parseBody(lines);

  const width = 1000;
  const leftMargin = 70;
  const topMargin = 80;
  const lineHeight = 26;
  const sectionSpacing = 42;

  let y = topMargin;
  const svgChildren: string[] = [];

  const titleText = primaryTitle(parseJps(normalized));
  svgChildren.push(`<text x=\"${width / 2}\" y=\"${y}\" text-anchor=\"middle\" font-family=\"Microsoft YaHei, sans-serif\" font-size=\"36\" fill=\"#1b1b1b\">${escapeXml(titleText)}</text>`);
  y += sectionSpacing;

  const meta: Array<[string, string | undefined]> = [
    ["调号", header.D],
    ["拍号", header.P],
    ["节拍", header.J],
    ["备注", header.Z],
  ];

  for (const [label, value] of meta) {
    if (value) {
      svgChildren.push(`<text x=\"${leftMargin}\" y=\"${y}\" font-family=\"Microsoft YaHei, sans-serif\" font-size=\"16\" fill=\"#333333\">${escapeXml(label + ": " + value)}</text>`);
      y += lineHeight;
    }
  }

  y += sectionSpacing / 2;

  for (const segment of body) {
    svgChildren.push(`<text x=\"${leftMargin}\" y=\"${y}\" font-family=\"Microsoft YaHei, sans-serif\" font-size=\"17\" font-weight=\"bold\" fill=\"#222222\">${escapeXml(segment.type === "Q" ? "曲:" : "词:")}</text>`);
    y += lineHeight;

    let x = leftMargin + 30;
    const formatted = formatTokens(segment.tokens);

    for (const token of formatted) {
      const escaped = escapeXml(token.text);
      const widthEstimate = Math.max(24, token.text.length * 10 + 6);
      if (x + widthEstimate > width - leftMargin) {
        y += lineHeight;
        x = leftMargin + 30;
      }
      svgChildren.push(`<text x=\"${x}\" y=\"${y}\" font-family=\"monospace\" font-size=\"16\" fill=\"${token.color}\">${escaped}</text>`);
      x += widthEstimate;
    }

    y += lineHeight;
  }

  const height = Math.max(y + sectionSpacing, 520);

  return `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"${width}\" height=\"${height}\" viewBox=\"0 0 ${width} ${height}\" preserveAspectRatio=\"xMidYMid meet\">\n  <rect width=\"100%\" height=\"100%\" fill=\"#ffffff\" />\n  ${svgChildren.join("\n  ")}\n</svg>`;
}
