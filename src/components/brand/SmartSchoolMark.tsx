interface Props {
  size?: number;
  c1?: string;
  c2?: string;
}

export function SmartSchoolMark({ size = 40, c1 = "#7C3AED", c2 = "#6366F1" }: Props) {
  const uid = `ss-${size}-${c1.replace("#", "")}`;
  return (
    <svg
      width={size}
      height={Math.round(size * 1.1)}
      viewBox="0 0 40 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={uid} x1="30" y1="7" x2="10" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
      </defs>
      <path
        d="M 31 8 C 20 7 8 10 8 17 C 8 24 33 21 33 30 C 33 38 20 39 9 38"
        stroke={`url(#${uid})`}
        strokeWidth="5.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
