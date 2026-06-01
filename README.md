# Taupytukas

`Taupytukas` yra statinis mobilus prototipas vaikų (10+) ir tėvų taupymui — be investavimo skilties, su aiškiais tikslais ir XP.

## Kas dabar įdėta

- pilno ekrano prisijungimas vaikui ir tėvams (atskiras PIN jautriems veiksmams);
- **tėvų misijos**: tikslas, XP atlygis, patvirtinimas kai vaikas atliko;
- **vaiko XP** matomas vaikui ir tėvams;
- išskirtas tikslo progresas (%, kiek liko EUR);
- taupymas, limitai, pavedimų užklausos, QR skeneris, deep link review;
- pranešimų istorija (skiltis „Pranešimai“);
- **Mokymasis** (pamokos + viktorina) ir atskira **Misijos** skiltis (tėvų užduotys + žaidimai);
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

### Atsisiųsti (naudok šias nuorodas)

1. **APK aplankas** — atsidarysi `apk` ir matai `Taupytukas-debug.apk`:  
   https://github.com/BR4TUCHA/Investavimo-Appsas/tree/cursor/simplify-goals-xp-ad52/apk

2. **Tiesioginis atsisiuntimas** (patogiausia telefone):  
   https://github.com/BR4TUCHA/Investavimo-Appsas/releases/download/taupytukas-apk/Taupytukas-debug.apk

3. **Releases** — sąraše po *Assets* paspausk `Taupytukas-debug.apk`:  
   https://github.com/BR4TUCHA/Investavimo-Appsas/releases

4. **Atsisiuntimo puslapis** (mygtukas + nuoroda į failą):  
   https://br4tucha.github.io/Investavimo-Appsas/

SHA-256: `8d3e8261fc784c9afe41dab6e0bbdceecf761c793cfc266bad0196e49d808fee`

> Sena versija telefone? Ištrink programėlę ir įdiek iš naujo. Nenaudok senų `raw.githubusercontent.com` nuorodų su kita šaka.

## iOS

Reikia Mac + Xcode + Apple Developer paskyros TestFlight arba App Store publikavimui:

```bash
npm run ios:sync
```
