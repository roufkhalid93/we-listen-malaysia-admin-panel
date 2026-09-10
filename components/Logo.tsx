import Link from "next/link";

export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
      <svg
        width="34"
        height="34"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M20 2C10.06 2 2 9.85 2 19.5c0 4.2 1.52 8.06 4.06 11.08L4 38l7.86-2.4A19.1 19.1 0 0 0 20 37c9.94 0 18-7.85 18-17.5S29.94 2 20 2Z"
          fill="#1F447F"
        />
        <path
          d="M14.5 22c0-3.5 2.5-6 6-6"
          stroke="#FBF8F3"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="14.5" cy="22" r="2.4" fill="#E23E77" />
        <circle cx="24.5" cy="15" r="2.4" fill="#E23E77" />
      </svg>
      <span className="leading-tight">
        <span
          className={`block font-display italic text-[1.05rem] ${
            dark ? "text-white" : "text-blue-600"
          }`}
        >
          We Listen
        </span>
        <span
          className={`block text-[0.62rem] tracking-[0.14em] uppercase font-semibold ${
            dark ? "text-white/70" : "text-pink-500"
          }`}
        >
          Malaysia
        </span>
      </span>
    </Link>
  );
}
