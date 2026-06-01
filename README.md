# Taupytukas

`Taupytukas` yra statinis mobilus prototipas vaikų (10+) ir tėvų taupymui — be investavimo skilties, su aiškiais tikslais ir XP.

## Kas dabar įdėta

- pilno ekrano prisijungimas vaikui ir tėvams (atskiras PIN jautriems veiksmams);
- **tėvų misijos**: tikslas, XP atlygis, patvirtinimas kai vaikas atliko;
- **vaiko XP** matomas vaikui ir tėvams;
- išskirtas tikslo progresas (%, kiek liko EUR);
- taupymas, limitai, pavedimų užklausos, QR skeneris, deep link review;
- pranešimų istorija (skiltis „Pranešimai“);
- misijos / žaidimai (trumpi mini žaidimai su XP);
- plona apatinė navigacija (nelipa ant turinio);
- Android APK ir iOS projektas (Capacitor).

## Naudojimo logika

- Tėvai skiltyje **Taupyti** kuria misiją (EUR tikslas arba tik užduotis).
- Kai vaikas atlieka — tėvai **Patvirtinti atlikimą** → vaikas gauna XP.
- Svarbūs įvykiai eina į **Pranešimus**.
- Papildymai ir užklausos — per PIN modalą.

## Paleisti naršyklėje

```bash
npm install
npx serve .
```

## Android debug APK

```bash
npm run android:build:debug
```

APK kopija: `apk/Taupytukas-debug.apk`

## iOS

Reikia Mac + Xcode + Apple Developer paskyros TestFlight arba App Store publikavimui:

```bash
npm run ios:sync
```
