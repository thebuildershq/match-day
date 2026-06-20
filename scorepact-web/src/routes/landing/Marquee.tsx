const NAMES = ["Premier League", "La Liga", "Champions League", "Serie A", "Bundesliga", "Ligue 1"];

export function Marquee() {
  // Duplicated list + translateX(-50%) loop = seamless scroll.
  const items = [...NAMES, ...NAMES];
  return (
    <div className="overflow-hidden whitespace-nowrap border-y border-line py-[18px]">
      <div className="inline-flex w-max animate-marquee will-change-transform motion-reduce:animate-none">
        {items.map((name, i) => (
          <span key={i} className="inline-flex items-center font-serif text-[clamp(20px,3vw,30px)] font-medium italic">
            {name}
            <span className="mx-[26px] text-accent">●</span>
          </span>
        ))}
      </div>
    </div>
  );
}