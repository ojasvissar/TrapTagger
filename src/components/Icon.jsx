const paths = {
  mail: <><rect x="2.5" y="4.5" width="15" height="11" rx="2" /><path d="m3 5.5 7 5.5 7-5.5" /></>,
  doc: <><path d="M5 2.5h7l3.5 3.5v11.5h-10.5z" /><path d="M12 2.5V6h3.5M8 10h5M8 13.5h5" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" /></>,
  ship: <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />,
  screen: <><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 21h8M12 18v3" /></>,
  plane: <><path d="M2 16l20-6-4-2-6 2-6-4-2 1 4 5-4 1-2-1z" /><path d="M3 21h18" /></>,
};

export default function Icon({ name, size = 24 }) {
  const small = name === "mail" || name === "doc";
  return (
    <svg viewBox={small ? "0 0 20 20" : "0 0 24 24"} width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
