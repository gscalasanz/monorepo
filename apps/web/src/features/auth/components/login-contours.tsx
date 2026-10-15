/** Curvas de nivel decorativas (mapa topográfico) del panel institucional. */
const CONTOUR =
  'M0,-100 C70,-104 118,-40 96,18 C78,66 30,74 4,102 C-30,126 -96,88 -102,22 C-108,-36 -66,-98 0,-100 Z';
const SCALES = [0.35, 0.6, 0.85, 1.1, 1.35, 1.6, 1.85, 2.1, 2.35] as const;

/** Corrimiento por anillo: deforma la serie para que lea como relieve y no como diana. */
const DRIFT = { x: 9, y: -6, turn: 11 } as const;

export function LoginContours({ className }: { readonly className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="-260 -260 520 520"
      fill="none"
      className={className}
    >
      {SCALES.map((scale, index) => (
        <path
          key={scale}
          d={CONTOUR}
          stroke="currentColor"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          transform={`translate(${index * DRIFT.x} ${index * DRIFT.y}) rotate(${index * DRIFT.turn}) scale(${scale})`}
        />
      ))}
    </svg>
  );
}
