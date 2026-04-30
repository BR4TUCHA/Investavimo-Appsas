# Investavimo-Appsas

`TaupykLab` yra vieno puslapio MVP prototipas, skirtas parodyti vaikų
kišenpinigių, taupymo, investavimo edukacijos ir tėvų kontrolės idėją.

## Kas įdėta

- apatinė navigacija su atskiromis skiltimis:
  - `Pagrindas`,
  - `Tikslai`,
  - `Limitai`,
  - `Mokymasis`,
  - `Viktorina`;
- skirtingi rolės režimai:
  - `Vaiko prisijungimas`,
  - `Tėvų prisijungimas`;
- tikslų modulis:
  - vaikas gali pats siūlyti ir kurti naujus tikslus,
  - tėvai gali pridėti savo tikslus,
  - tėvai gali redaguoti ir ištrinti esamus tikslus;
- atskira limitų skiltis su:
  - savaitės limitu,
  - išleista suma,
  - perspėjimais apie artėjimą prie ribos arba jos viršijimą,
  - push notification imitacija;
- atskira investavimo ir bendro valdymo logika pagrindinėje skiltyje;
- avataro-asistento kortelė su atsitiktiniais patarimais;
- daugiau nei 100 mokymosi patarimų / mini pamokų;
- daugiau nei 100 viktorinos klausimų.

## MVP logika

- Tėvai nustato, kokia kišenpinigių dalis lieka išleidimui, taupymui ir
  investavimo mokymuisi.
- Vaiko režime valdymo elementai užrakinami, tačiau vaikas vis tiek gali:
  - matyti taisykles,
  - kurti savo tikslų pasiūlymus,
  - spręsti viktorinos klausimus,
  - skaityti mokymosi patarimus.
- Tikslai saugomi atskiroje skiltyje, kur tėvai gali juos koreguoti arba trinti.
- Jei išleidžiama suma priartėja prie limito arba jį viršija, rodomi
  įspėjamieji pranešimai ir avataro-asistento promptai.
- Mokymosi ir viktorinos turinys išplėstas iki 100+ įrašų kiekvienoje skiltyje,
  kad ekranai būtų atskirti ir nebūtų perkrauti vienoje vietoje.

## Paleidimas

Tai statinis projektas, todėl užtenka atsidaryti `index.html` naršyklėje.

Jei norisi paleisti per lokalią tarnybą:

```bash
python3 -m http.server 8000
```

Tada atidarykite:

```text
http://localhost:8000
```

## Android APK

Iš esamo MVP pridėtas Android apvalkalas su Capacitor, todėl galima sugeneruoti
`apk` failą telefonui.

### Kur parsisiųsti APK iš GitHub

Į repo yra įkeltas parsisiunčiamas failas čia:

```text
apk/TaupykLab-debug.apk
```

Šitą failą gali atsidaryti GitHub ir telefone spausti `Download` / `View raw`.

### Kur yra lokalus build failas

Po build'o lokalus Gradle sugeneruotas failas yra čia:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

### Kaip perbuildinti APK

Jei reikėtų perbuildinti iš naujo:

```bash
npm install
npm run build:web
npx cap sync android
cd android
./gradlew assembleDebug
```

### Pastaba

- Šiuo metu tai yra `debug` APK versija.
- Android telefone gali reikėti leisti diegimą iš nežinomų šaltinių.
- Parsisiunčiamo failo kontrolinė suma (`SHA-256`):
  `0b5fb998de5c1c88be613293bd49a1cbc674e0c835917934d113535c31d7c7fe`
- Jei norėsi, kitame etape galima padaryti pasirašytą `release` APK arba AAB
  failą Google Play įkėlimui.
