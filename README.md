# Investavimo-Appsas

`TaupykLab` yra paprastas vieno puslapio MVP prototipas, skirtas parodyti vaikų
kišenpinigių, taupymo, investavimo edukacijos ir tėvų kontrolės idėją.

## Kas įdėta

- hero sekcija su produkto pasiūlymu;
- interaktyvus simuliatorius:
  - mėnesio kišenpinigių dydis,
  - procentas taupymui,
  - procentas investavimo kišenei,
  - taupymo tikslas,
  - esama pažanga,
  - tėvų prisidėjimo procentas;
- automatiškai perskaičiuojamas paskirstymas į:
  - išleidimą,
  - taupymą,
  - investavimą;
- tėvų pranešimo ir prisidėjimo scenarijus;
- mini mokymosi zona su trumpomis finansų pamokomis ir viktorina.

## MVP logika

- Tėvai nustato, kokia kišenpinigių dalis lieka išleidimui, taupymui ir
  investavimo mokymuisi.
- Kai vaikas pasiekia bent 50% savo tikslo, programėlė pažymi, kad galima
  siųsti pranešimą tėvams ir aktyvuoti jų prisidėjimą.
- Tėvų prisidėjimo procentas skaičiuojamas tik po to, kai šis slenkstis
  pasiektas.
- Edukacinė dalis skirta aiškinti bazines sąvokas: taupymą, riziką ir
  sudėtinį augimą.

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
  `4a220b95760590917c40c6b631bde515cd717b53da8b3b2500d402afff97cfd9`
- Jei norėsi, kitame etape galima padaryti pasirašytą `release` APK arba AAB
  failą Google Play įkėlimui.
