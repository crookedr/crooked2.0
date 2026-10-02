export default function GdprPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-semibold">GDPR – Ochrana osobných údajov</h1>

        <p className="mt-6 text-gray-300 leading-relaxed">
          Táto stránka vysvetľuje, ako spracúvam osobné údaje na webe <span className="text-white">crookedr.com</span>.
          Tento web je portfólio a slúži primárne na prezentáciu práce.
        </p>

        <h2 className="mt-10 text-xl font-semibold">Prevádzkovateľ</h2>
        <p className="mt-3 text-gray-300 leading-relaxed">
          Prevádzkovateľ: <span className="text-white">Roman Hatnančík</span>
          <br />
          Kontakt: <span className="text-white">uvedený v sekcii Contact</span>
        </p>

        <h2 className="mt-10 text-xl font-semibold">Aké údaje môžem spracúvať</h2>
        <ul className="mt-3 list-disc pl-6 text-gray-300 space-y-2">
          <li>
            Údaje z kontaktného formulára (ak ho používaš): meno alebo email a obsah správy.
          </li>
          <li>
            Technické údaje o návšteve webu (iba ak je povolená analytika): anonymizované metriky návštevnosti.
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold">Účel spracovania</h2>
        <ul className="mt-3 list-disc pl-6 text-gray-300 space-y-2">
          <li>Odpoveď na správu od návštevníka.</li>
          <li>Zlepšovanie webu na základe anonymných štatistík (voliteľné).</li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold">Právny základ</h2>
        <ul className="mt-3 list-disc pl-6 text-gray-300 space-y-2">
          <li>Oprávnený záujem (bezpečnosť a prevádzka webu).</li>
          <li>Súhlas (analytické cookies, ak ich používaš).</li>
          <li>Plnenie zmluvy / predzmluvné vzťahy (odpoveď na dopyt).</li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold">Doba uchovávania</h2>
        <p className="mt-3 text-gray-300 leading-relaxed">
          Správy z formulára uchovávam len počas nevyhnutnej doby na komunikáciu. Analytické údaje (ak sú povolené)
          sa riadia nastaveniami analytického nástroja.
        </p>

        <h2 className="mt-10 text-xl font-semibold">Práva dotknutej osoby</h2>
        <p className="mt-3 text-gray-300 leading-relaxed">
          Máš právo na prístup k údajom, opravu, vymazanie, obmedzenie spracovania, prenositeľnosť a namietať spracovanie.
          Ak spracovanie prebieha na základe súhlasu, súhlas môžeš kedykoľvek odvolať.
        </p>

        <p className="mt-10 text-[12px] text-gray-400">
          Posledná aktualizácia: 25. 12. 2025
        </p>
      </div>
    </main>
  )
}
