export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-semibold">Zásady používania cookies</h1>

        <p className="mt-6 text-gray-300 leading-relaxed">
          Cookies sú malé textové súbory, ktoré pomáhajú webu fungovať a zlepšovať používateľský zážitok.
          Na tomto webe používam:
        </p>

        <h2 className="mt-10 text-xl font-semibold">Nevyhnutné cookies</h2>
        <p className="mt-3 text-gray-300 leading-relaxed">
          Tieto cookies sú potrebné pre základnú funkčnosť stránky (napr. uloženie voľby súhlasu s cookies).
        </p>

        <h2 className="mt-10 text-xl font-semibold">Analytické cookies (voliteľné)</h2>
        <p className="mt-3 text-gray-300 leading-relaxed">
          Používajú sa na anonymné meranie návštevnosti a zlepšovanie stránky. Načítajú sa iba vtedy, ak udelíš súhlas.
        </p>

        <h2 className="mt-10 text-xl font-semibold">Ako zmeniť súhlas</h2>
        <p className="mt-3 text-gray-300 leading-relaxed">
          Súhlas môžeš zmeniť kedykoľvek. Na stránke je tlačidlo <span className="text-white">Cookie settings</span> (vľavo dole na desktop).
        </p>

        <p className="mt-10 text-[12px] text-gray-400">
          Posledná aktualizácia: 25. 12. 2025
        </p>
      </div>
    </main>
  )
}
