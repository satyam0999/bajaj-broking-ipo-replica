export default function Hero({ title, blurb }) {
  return (
    <section className="bg-gradient-to-b from-navy to-[#102a5c] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        <nav className="mb-3 text-xs text-blue-200">
          <span className="opacity-80">Home</span>
          <span className="mx-1.5 opacity-50">/</span>
          <span className="font-medium text-white">IPO</span>
        </nav>
        <h1 className="max-w-3xl text-2xl font-extrabold leading-tight md:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm text-blue-100 md:text-base">{blurb}</p>
      </div>
    </section>
  )
}
