import type { ReactNode } from "react";

// רקע ה-Hero: מחסן לוגיסטי שעובד — מדפים, תאורה תלויה, מסילה עילית ושני
// מסועים שקופסאות נעות עליהם מצד הטקסט אל הצ'אט (המידע זורם אל המוח).
//
// - איור בקוד ולא וידאו: כמה קילובייטים במקום מגה-בייטים, חד בכל רזולוציה.
// - במה בגודל קבוע (2400×900px) שמעוגנת לתחתית ולמרכז ונחתכת לפי המסך, כך
//   שבטלפון הקופסאות בגודל טבעי ולא מתכווצות.
// - החלקים הזזים הם div-ים שזזים ב-transform, לא אלמנטים בתוך ה-SVG: כך
//   ההנפשה רצה על כרטיס המסך, וה-SVG הסטטי מצויר פעם אחת בלבד.
// - כל רצועה מכילה את אותה תבנית פעמיים וזזה בדיוק אורך תבנית אחד — לולאה בלי תפר.
// - reduced-motion: הכלל הגלובלי ב-globals.css עוצר את ההנפשות והכול נשאר במקום.
// - Server Component: אפס JavaScript בדפדפן. המיקומים "אקראיים" אבל קבועים (seed).

const W = 2400;
const H = 900;
const LOOP = 2400; // אורך תבנית ברצועה נעה; חייב להיות לפחות רוחב הבמה

// גוונים: מהרחוק (כמעט נבלע ברקע) לקרוב.
const RACK = "#363b43";
const RACK_BOX_FILL = "#25292f";
const RACK_BOX_LINE = "#3a4049";
const FAR_FRAME = "#3f454e";
const FAR_BOX = { fill: "#282c32", line: "#4a515b" };
const NEAR_FRAME = "#4b525c";
const NEAR_BOX = { fill: "#2c3037", line: "#5f6773" };

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

type BoxSpec = { x: number; w: number; h: number; hi: boolean };

// קופסאות לאורך רצועה באורך LOOP, עם רווחים לא אחידים.
function belt(seed: number, size: [number, number], height: [number, number], gap: [number, number], hiEvery: number) {
  const r = seeded(seed);
  const boxes: BoxSpec[] = [];
  let x = gap[0] / 2;
  let i = 0;
  for (;;) {
    const w = Math.round(size[0] + r() * (size[1] - size[0]));
    if (x + w > LOOP - gap[0] / 2) break;
    const h = Math.round(height[0] + r() * (height[1] - height[0]));
    boxes.push({ x: Math.round(x), w, h, hi: hiEvery > 0 && i % hiEvery === 2 });
    x += w + gap[0] + r() * (gap[1] - gap[0]);
    i++;
  }
  return boxes;
}

function Box({ x, bottom, w, h, hi, palette }: BoxSpec & { bottom: number; palette: { fill: string; line: string } }) {
  const top = bottom - h;
  const stroke = hi ? undefined : palette.line;
  const cls = hi ? "fill-accent/15 stroke-accent/80" : undefined;
  return (
    <g>
      <rect x={x} y={top} width={w} height={h} rx={2} fill={hi ? undefined : palette.fill} stroke={stroke} strokeWidth={1.5} className={cls} />
      {/* סרט הדבקה וחצי מדבקה — מספיק כדי שהעין תקרא "קרטון" */}
      <line x1={x + w / 2} y1={top} x2={x + w / 2} y2={top + h * 0.38} stroke={stroke} strokeWidth={1.5} className={cls} />
      <rect x={x + w * 0.12} y={bottom - h * 0.34} width={w * 0.3} height={h * 0.18} fill="none" stroke={stroke} strokeWidth={1} className={cls} />
    </g>
  );
}

// רצועה נעה: div ברוחב שתי תבניות, שזז שמאלה בדיוק אורך תבנית אחד.
function MovingStrip({
  top,
  height,
  seconds,
  children,
}: {
  top: number;
  height: number;
  seconds: number;
  children: (offset: number) => ReactNode;
}) {
  return (
    <div
      className="absolute left-0 will-change-transform"
      style={{ top, height, width: LOOP * 2, animation: `wh-slide ${seconds}s linear infinite` }}
    >
      <svg width={LOOP * 2} height={height} className="block overflow-visible">
        {children(0)}
        {children(LOOP)}
      </svg>
    </div>
  );
}

// פני המסוע: פסים שזזים באותה מהירות של הקופסאות שעליו.
function BeltSurface({ top, pxPerSecond, color }: { top: number; pxPerSecond: number; color: string }) {
  const period = 24;
  return (
    <div className="absolute left-0 h-[3px] overflow-hidden" style={{ top, width: W }}>
      <div
        className="h-full will-change-transform"
        style={{
          width: W + period,
          background: `repeating-linear-gradient(90deg, ${color} 0 14px, transparent 14px ${period}px)`,
          animation: `wh-dash ${period / pxPerSecond}s linear infinite`,
        }}
      />
    </div>
  );
}

function ConveyorFrame({ y, band, roller, rollerGap, legTo, legGap, color }: {
  y: number; band: number; roller: number; rollerGap: number; legTo: number; legGap: number; color: string;
}) {
  const rollers = [];
  for (let x = rollerGap / 2; x < W; x += rollerGap) rollers.push(x);
  const legs = [];
  for (let x = legGap / 2; x < W; x += legGap) legs.push(x);
  return (
    <g stroke={color} fill="none" strokeWidth={2}>
      <line x1={0} y1={y} x2={W} y2={y} />
      <line x1={0} y1={y + band} x2={W} y2={y + band} />
      {rollers.map((x) => (
        <circle key={x} cx={x} cy={y + band / 2} r={roller} strokeWidth={1.25} />
      ))}
      {legs.map((x) => (
        <g key={x}>
          <line x1={x - 14} y1={y + band} x2={x - 22} y2={legTo} />
          <line x1={x + 14} y1={y + band} x2={x + 22} y2={legTo} />
          <line x1={x - 18} y1={(y + band + legTo) / 2} x2={x + 18} y2={(y + band + legTo) / 2} strokeWidth={1.25} />
        </g>
      ))}
    </g>
  );
}

function Racks() {
  const r = seeded(7);
  const beams = [230, 330, 430, 520, 600];
  const units = [];
  for (let x0 = 20; x0 < W; x0 += 280) {
    const boxes = [];
    for (let s = 1; s < beams.length; s++) {
      const floor = beams[s];
      const room = beams[s] - beams[s - 1] - 14;
      let x = x0 + 8;
      while (x < x0 + 200) {
        const w = Math.round(30 + r() * 34);
        if (x + w > x0 + 212) break;
        if (r() > 0.22) {
          const h = Math.round(room * (0.55 + r() * 0.4));
          boxes.push(<rect key={`${x}-${s}`} x={x} y={floor - h} width={w} height={h} rx={1.5} />);
        }
        x += w + 4 + r() * 10;
      }
    }
    units.push(
      <g key={x0}>
        <g fill={RACK_BOX_FILL} stroke={RACK_BOX_LINE} strokeWidth={1.25}>
          {boxes}
        </g>
        <g stroke={RACK} strokeWidth={3}>
          <line x1={x0} y1={beams[0] - 20} x2={x0} y2={beams[beams.length - 1]} />
          <line x1={x0 + 220} y1={beams[0] - 20} x2={x0 + 220} y2={beams[beams.length - 1]} />
          {beams.map((y) => (
            <line key={y} x1={x0} y1={y} x2={x0 + 220} y2={y} strokeWidth={2.5} />
          ))}
        </g>
      </g>,
    );
  }
  return <g>{units}</g>;
}

function Lamps() {
  const xs = [300, 700, 1100, 1500, 1900, 2300];
  return (
    <g>
      {xs.map((x) => (
        <g key={x}>
          <polygon points={`${x - 30},110 ${x + 30},110 ${x + 280},${H} ${x - 280},${H}`} fill="url(#wh-cone)" />
          <line x1={x} y1={0} x2={x} y2={90} stroke={RACK} strokeWidth={2} />
          <polygon points={`${x - 20},90 ${x + 20},90 ${x + 32},110 ${x - 32},110`} fill="#2e333a" stroke={FAR_FRAME} strokeWidth={1.5} />
          <ellipse cx={x} cy={111} rx={18} ry={3} fill="#e8eef8" opacity={0.35} />
        </g>
      ))}
    </g>
  );
}

const FAR_Y = 660; // פני המסוע הרחוק
const NEAR_Y = 810; // פני המסוע הקרוב
const RAIL_Y = 170;

const FAR_BOXES = belt(11, [32, 50], [22, 40], [50, 170], 5);
const NEAR_BOXES = belt(23, [56, 86], [40, 70], [90, 260], 4);
const CARRIERS = belt(31, [52, 60], [38, 46], [300, 420], 3);

export function WarehouseScene() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{ width: W, height: H }}>
        <svg width={W} height={H} className="absolute inset-0 block">
          <defs>
            <linearGradient id="wh-cone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#dfe8f7" stopOpacity={0.07} />
              <stop offset="1" stopColor="#dfe8f7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Lamps />
          <Racks />
          <line x1={0} y1={600} x2={W} y2={600} stroke={RACK} strokeWidth={1.5} />
          {/* המסילה העילית */}
          <rect x={0} y={RAIL_Y - 4} width={W} height={8} fill="#2a2e34" stroke={FAR_FRAME} strokeWidth={1.5} />
          <ConveyorFrame y={FAR_Y} band={12} roller={4} rollerGap={34} legTo={720} legGap={240} color={FAR_FRAME} />
          <ConveyorFrame y={NEAR_Y} band={16} roller={6} rollerGap={44} legTo={H} legGap={320} color={NEAR_FRAME} />
        </svg>

        {/* מסילה עילית: עגלות עם קופסה תלויה, הכי איטי — הכי רחוק */}
        <MovingStrip top={RAIL_Y - 16} height={150} seconds={96}>
          {(o) =>
            CARRIERS.map((c) => {
              const cx = o + c.x + c.w / 2;
              return (
                <g key={`${o}-${c.x}`}>
                  <rect x={cx - 16} y={0} width={32} height={10} rx={3} fill="#30353c" stroke={FAR_FRAME} strokeWidth={1.5} />
                  <circle cx={cx - 9} cy={13} r={3.5} fill={FAR_FRAME} />
                  <circle cx={cx + 9} cy={13} r={3.5} fill={FAR_FRAME} />
                  <line x1={cx} y1={20} x2={cx} y2={78} stroke={FAR_FRAME} strokeWidth={1.5} />
                  <Box {...c} x={o + c.x} bottom={78 + c.h} palette={FAR_BOX} />
                </g>
              );
            })
          }
        </MovingStrip>

        <BeltSurface top={FAR_Y - 1} pxPerSecond={LOOP / 60} color={FAR_FRAME} />
        <MovingStrip top={FAR_Y - 44} height={44} seconds={60}>
          {(o) => FAR_BOXES.map((b) => <Box key={`${o}-${b.x}`} {...b} x={o + b.x} bottom={43} palette={FAR_BOX} />)}
        </MovingStrip>

        <BeltSurface top={NEAR_Y - 1} pxPerSecond={LOOP / 40} color={NEAR_FRAME} />
        <MovingStrip top={NEAR_Y - 74} height={74} seconds={40}>
          {(o) => NEAR_BOXES.map((b) => <Box key={`${o}-${b.x}`} {...b} x={o + b.x} bottom={73} palette={NEAR_BOX} />)}
        </MovingStrip>
      </div>

      {/* הבמה נבלעת ברקע למעלה ולמטה, בלי קצה חד */}
      <div className="absolute inset-x-0 top-0 h-72 bg-linear-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-background to-transparent" />
      {/* מחשיך את צד הטקסט (ימין ב-RTL) כדי שהכותרת והתת-כותרת יישארו קריאות */}
      <div className="absolute inset-0 hidden bg-linear-to-l from-background/90 from-10% via-background/50 via-45% to-transparent to-70% md:block" />
      <div className="absolute inset-0 bg-background/35 md:hidden" />
    </div>
  );
}
