function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <header className="bg-blue-600 text-white w-full py-4 text-center">
        <h1 className="text-4xl font-bold">Smart Media Player</h1>
      </header>
      <main className="max-w-4xl p-8">
        <article className="prose prose-lg">
          <h2>Smart Media Player – Inteligentny odtwarzacz wideo.</h2>
          <p>
            Witaj w projekcie Smart Media Player! Celem tego zadania jest
            stworzenie nowoczesnego odtwarzacza wideo, który dynamicznie reaguje
            na zachowanie użytkownika i wykorzystuje zaawansowane API
            przeglądarkowe. Dzięki temu odtwarzacz stanie się bardziej
            intuicyjny, wydajny i dostosowany do potrzeb użytkownika.
          </p>
          <h3>Auto-PiP – Automatyczny tryb Picture-in-Picture</h3>
          <p>
            Jedną z kluczowych funkcji odtwarzacza jest automatyczne
            przełączanie wideo w tryb Picture-in-Picture (PiP). Dzięki temu
            użytkownik może kontynuować oglądanie filmu w małym okienku, nawet
            gdy przewinie stronę i odtwarzacz zniknie z pola widzenia. To
            rozwiązanie jest szczególnie przydatne podczas przeglądania długich
            stron, gdzie użytkownik chce jednocześnie konsumować treści wideo i
            tekstowe. Gdy użytkownik wróci do sekcji z odtwarzaczem, wideo
            automatycznie powróci do głównego kontenera.
          </p>
          <h3>Media Session API – Integracja z systemem</h3>
          <p>
            Kolejną funkcjonalnością jest integracja z Media Session API. Dzięki
            temu użytkownik będzie mógł sterować odtwarzaniem wideo bez
            konieczności przechodzenia na kartę przeglądarki. W systemowym
            centrum powiadomień pojawią się informacje o odtwarzanym filmie,
            takie jak tytuł, artysta czy okładka. Dodatkowo obsłużone zostaną
            przyciski akcji, takie jak "play", "pause" czy "seek", co znacznie
            poprawi wygodę użytkowania.
          </p>
          <h3>Lazy Loading – Optymalizacja ładowania</h3>
          <p>
            W trosce o wydajność i szybkość działania strony zaimplementowany
            zostanie mechanizm lazy loading. Film zacznie się pobierać dopiero
            wtedy, gdy sekcja z odtwarzaczem znajdzie się blisko widocznego
            obszaru strony (np. 200px przed pojawieniem się). Dzięki temu
            zmniejszymy obciążenie sieci i przyspieszymy ładowanie strony,
            szczególnie na urządzeniach mobilnych.
          </p>
          <h3>Obsługa błędów</h3>
          <p>
            Nie każda przeglądarka obsługuje tryb Picture-in-Picture czy Media
            Session API. Dlatego zadbamy o odpowiednią obsługę błędów, aby
            użytkownik zawsze miał dostęp do podstawowych funkcji odtwarzacza,
            nawet jeśli jego przeglądarka nie wspiera zaawansowanych API.
          </p>
          <h3>Dodatkowe funkcje – Snapshot</h3>
          <p>
            Dla bardziej zaawansowanych użytkowników przewidziano funkcję
            "Snapshot". Za pomocą Canvas API użytkownik będzie mógł przechwycić
            aktualną klatkę wideo i zapisać ją jako plik .webp. To świetne
            rozwiązanie dla osób, które chcą szybko uchwycić ważny moment z
            filmu.
          </p>
          <p>
            Nowoczesne API przeglądarkowe, takie jak Intersection Observer,
            Media Session czy Picture-in-Picture, pozwalają na tworzenie
            aplikacji, które są bardziej responsywne, wydajne i przyjazne dla
            użytkownika. Dzięki ich zastosowaniu odtwarzacz wideo stanie się nie
            tylko narzędziem do oglądania filmów, ale także integralną częścią
            doświadczenia użytkownika na stronie.
          </p>
        </article>
      </main>
      <footer className="bg-gray-800 text-white w-full py-4 text-center">
        <p>© 2026 Smart Media Player. Wszystkie prawa zastrzeżone.</p>
      </footer>
    </div>
  );
}

export default App;
