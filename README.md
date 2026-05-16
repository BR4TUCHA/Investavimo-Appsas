# KidFund

`KidFund` yra statinis mobilus prototipas, skirtas vaikų kišenpinigių, taupymo
ir investavimo mokymuisi su aiškia tėvų kontrole.

## Kas dabar įdėta

- pilno ekrano prisijungimo / registracijos ekranas vaikui ir tėvams;
- atskiras PIN patvirtinimo modal langas jautriems veiksmams;
- child-safe vaizdas:
  - vaikas nemato `Duoti` skirtuko;
  - vaikas nemato leidimų politikos bloko;
  - vaikas nemato tėvų investavimo valdymo mygtukų;
- investavimo skiltis:
  - akcijų ir kriptovaliutų pasirinkimai;
  - vaiko investavimo prašymo pateikimas;
  - tėvų patvirtinimas arba atmetimas su atskiru PIN;
- taupymo tikslų, balanso ir limitų suvestinė;
- mokymosi kortelės ir mini viktorina;
- pranešimų istorija.

## Naudojimo logika

- Prisijungimas vyksta atskirame pilno ekrano lange, o ne pop-up'e.
- Registracija ir prisijungimas turi atskirą validaciją.
- Veiksmai kaip:
  - pinigų davimas vaikui,
  - investavimo prašymo siuntimas,
  - investavimo prašymo patvirtinimas / atmetimas,
  - kripto leidimo įjungimas / išjungimas
  vyksta per atskirą patvirtinimo modal langą su savo PIN tikrinimu.

## Paleidimas

Statinę versiją galima atsidaryti tiesiog atveriant `index.html`.

Jei norisi paleisti per lokalią tarnybą:

```bash
python3 -m http.server 8000
```

Tada atidarykite:

```text
http://localhost:8000
```

## Android build

```bash
npm install
npm run build:web
npx cap sync android
cd android
./gradlew assembleDebug
```

Sugeneruotas debug APK bus čia:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Patogesnė nukopijuota versija repozitorijoje:

```text
apk/KidFund-debug.apk
```

SHA-256:

```text
fffc59dd0f103c524372c77ce91f4a087c807dc25b0877ab913e7bbf81e1ba76
```
