# Investavimo-Appsas

`KidFund` yra mobiliai pritaikytas MVP prototipas, skirtas parodyti vaikų
kišenpinigių, taupymo, investavimo edukacijos ir tėvų kontrolės idėją.

## Kas įdėta

- tamsus `banking app` stiliaus dizainas, artimesnis realiai finansų programėlei;
- fiksuota apatinė shortcut juosta su skiltimis:
  - `Pradžia`,
  - `Taupyti`,
  - `Leidimai`,
  - `Pervedimai`,
  - `Mokymasis`,
  - `Viktorina`,
  - `Push`;
- viršuje dešinėje visada matoma maža rolės ikona su:
  - `Vaiko prisijungimu`,
  - `Tėvų prisijungimu`;
- reklamos / partnerio vieta produkto finansavimui;
- pradžiamokslio blokas pagrindiniame ekrane;
- taupyklės veiksmai:
  - vaikas gali pateikti prašymą įdėti į taupyklę,
  - vaikas gali pateikti prašymą išimti iš taupyklės,
  - tėvai gali veikti tiesiogiai be papildomo leidimo;
- leidimų centras, kuriame tėvai:
  - leidžia arba neleidžia vaiko prašymų,
  - keičia leidimų politiką;
- tėvų pinigų skiltis:
  - pervesti į vaiko piniginę,
  - pridėti į pasirinktą taupyklę,
  - skirti premiją / `match`;
- push pranešimų istorija apie:
  - papildymus,
  - išėmimus,
  - leidimų prašymus,
  - patvirtinimus ir atmetimus;
- 140 mokymosi patarimų;
- 140 viktorinos klausimų;
- asistentas, kuris:
  - rodo atsitiktinius promptus,
  - trumpai supažindina su kiekviena skiltimi ją atidarius.

## MVP logika

- Tėvai nustato, kokia kišenpinigių dalis lieka išlaidoms, taupymui ir investavimo mokymuisi.
- Vaikas gali inicijuoti taupyklės veiksmus, bet kai leidimų politika įjungta, galutinį sprendimą priima tėvai.
- Tėvai gali:
  - duoti kišenpinigius,
  - pervesti pinigus,
  - papildyti taupyklę,
  - skirti premiją,
  - patvirtinti arba atmesti prašymus.
- Push istorija simuliuoja bankinio tipo notif’ikacijas ir rodo, kas vyko programėlėje.
- Mokymosi ir viktorinos turinys išplėstas iki 140 įrašų kiekvienoje dalyje,
  kad programa atrodytų kaip realus mokymosi ir taupymo produktas.

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
apk/KidFund-debug.apk
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
  `9e4ad7acc398930b5a6528f5c53964f0817401cf899178bae2c1bbf2d4397834`
- Jei norėsi, kitame etape galima padaryti pasirašytą `release` APK arba AAB
  failą Google Play įkėlimui.
