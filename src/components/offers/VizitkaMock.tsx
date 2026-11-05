import type { Dictionary } from '@/i18n/dictionaries/en';

const QR_MODULES = 21;
const FINDER_ORIGINS = [
  [0, 0],
  [0, QR_MODULES - 7],
  [QR_MODULES - 7, 0],
] as const;

/**
 * Dark module of a decorative, QR-looking 21×21 glyph: three finder squares
 * and a fixed pseudo-random fill. It does not encode anything; the real QR
 * generator is not used here on purpose.
 */
function isDarkModule(row: number, col: number): boolean {
  for (const [top, left] of FINDER_ORIGINS) {
    const inZone = row >= top - 1 && row <= top + 7 && col >= left - 1 && col <= left + 7;
    if (!inZone) continue;
    const ring = Math.max(Math.abs(row - top - 3), Math.abs(col - left - 3));
    return ring === 3 || ring <= 1;
  }
  return (row * 31 + col * 17 + row * col) % 7 < 3;
}

function QrGlyph() {
  const darkModules: { row: number; col: number }[] = [];
  for (let row = 0; row < QR_MODULES; row++) {
    for (let col = 0; col < QR_MODULES; col++) {
      if (isDarkModule(row, col)) darkModules.push({ row, col });
    }
  }

  return (
    <svg
      viewBox={`-2 -2 ${QR_MODULES + 4} ${QR_MODULES + 4}`}
      className="w-24 h-24 rounded-md bg-white"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      {darkModules.map(({ row, col }) => (
        <rect key={`${row}-${col}`} x={col} y={row} width={1} height={1} fill="#111111" />
      ))}
    </svg>
  );
}

/** A phone-sized example of a web business card, in plain HTML and CSS. */
export function VizitkaMock({ t }: { t: Dictionary['vizitka']['mock'] }) {
  const pillClass =
    'flex-1 rounded-lg bg-[#14532d] px-2 py-2 text-center text-xs font-semibold text-white';

  return (
    <figure className="w-full max-w-[20rem] mx-auto">
      <div className="rounded-[2rem] border border-[var(--border-hot)] bg-[var(--surface-2)] p-3 shadow-[0_0_28px_rgba(57,255,122,0.12)]">
        <div className="rounded-[1.5rem] bg-[#f6f5f0] text-[#1a1a1a] p-5 space-y-4">
          <div>
            <p className="text-xl font-semibold">{t.name}</p>
            <p className="text-sm text-[#4a4a4a]">{t.tagline}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#4a4a4a]">
              {t.hoursLabel}
            </p>
            <ul className="mt-1 text-sm">
              {t.hours.map(({ days, time }) => (
                <li key={days} className="flex justify-between gap-3">
                  <span>{days}</span>
                  <span className="font-mono">{time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="relative h-24 rounded-lg border border-[#d4d2c8] bg-[#e7ecdf] overflow-hidden"
            style={{
              backgroundImage:
                'linear-gradient(115deg, transparent 45%, #ffffff 45% 52%, transparent 52%), linear-gradient(20deg, transparent 60%, #ffffff 60% 64%, transparent 64%), linear-gradient(90deg, transparent 30%, #b9d3e8 30% 38%, transparent 38%)',
            }}
          >
            <span className="absolute left-2 top-2 text-[10px] font-semibold uppercase tracking-wider text-[#4a4a4a]">
              {t.mapLabel}
            </span>
            <span
              aria-hidden="true"
              className="absolute left-[55%] top-[40%] h-4 w-4 rounded-full border-2 border-white bg-[#dc2626] shadow"
            />
          </div>

          <div className="flex gap-2">
            <span className={pillClass}>{t.call}</span>
            <span className={pillClass}>{t.menu}</span>
            <span className={pillClass}>{t.directions}</span>
          </div>

          <div className="flex items-center gap-3 border-t border-[#d4d2c8] pt-4">
            <QrGlyph />
            <p className="text-xs text-[#4a4a4a]">{t.scan}</p>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-center font-mono text-xs text-[var(--muted-strong)]">
        {t.caption}
      </figcaption>
    </figure>
  );
}
