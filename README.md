# Investavimo-Appsas

`TaupykLab` yra vieno puslapio MVP prototipas, skirtas parodyti vaikų
kišenpinigių, taupymo, investavimo edukacijos ir tėvų kontrolės idėją.

## Kas įdėta

- viršuje esantys rolės mygtukai:
  - `Vaiko prisijungimas`,
  - `Tėvų prisijungimas`;
- interaktyvus valdymo skydelis su skirtingomis teisėmis:
  - tėvai gali keisti limitus, kišenpinigius, taupymo tikslus ir investavimo dalį,
  - vaikas mato nustatymus, bet jų keisti negali;
- investavimo kategorijos:
  - ETF fondai,
  - technologijos,
  - žalioji energija,
  - saugi pinigų rinka;
- avataro-asistento kortelė su atsitiktiniais patarimais ir žinutėmis;
- push notification tipo įspėjimai:
  - kai vaikas artėja prie limito,
  - kai limitas viršijamas,
  - kai pasiekiamas taupymo tikslas,
  - kai tėvų prisidėjimas gali būti aktyvuotas;
- mini mokymosi zona su trumpomis finansų pamokomis ir viktorina.

## MVP logika

- Tėvai nustato, kokia kišenpinigių dalis lieka išleidimui, taupymui ir
  investavimo mokymuisi.
- Vaiko rolėje valdikliai užrakinami, todėl vaikas mato taisykles, bet jų
  pakeisti negali.
- Kai vaikas pasiekia bent 50% savo tikslo, programėlė pažymi, kad galima
  siųsti pranešimą tėvams ir aktyvuoti jų prisidėjimą.
- Jei išleidžiama suma priartėja prie limito arba jį viršija, rodomi
  įspėjamieji pranešimai ir avataro-asistento patarimai.
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
