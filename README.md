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
- partnerių / reklamos vieta pagrindiniame lange;
- atskiri sąskaitų numeriai:
  - pagrindiniam mokėjimui;
  - taupyklei;
- pavedimo užklausų kūrimas ir numerio kopijavimas;
- atskiras pavedimo užklausos share ekranas su QR kodu;
- `kidfund://pay/review?...` deep link srautas, kad QR galėtų atidaryti review ekraną telefone;
- tikras in-app QR skeneris su telefono kamera ir Android ML Kit integracija;
- payment review ekranas po scan su aiškiu `review + confirm` žingsniu prieš demo papildymą;
- anti-spam apsauga dažnoms užklausoms;
- lokalių telefono pranešimų siuntimas už kiekvieną naują KidFund veiksmą;
- taupymo tikslų, balanso ir limitų suvestinė;
- mokymosi kortelės ir mini viktorina;
- pranešimų istorija;
- atsitiktine tvarka maišomi viktorinos atsakymai;
- vaikiškesnis vaiko režimo tonas su emoji ir mini misijomis;
- tikros apatinės navigacijos ikonėlės vietoj raidžių;
- platesnis SVG ikonėlių paketas visam UI;
- keli mini žaidimukai vaikams su taškais ir lygiais;
- bankinio stiliaus QR share kortelė su suma, sąskaita ir request ID.

## Naudojimo logika

- Prisijungimas vyksta atskirame pilno ekrano lange, o ne pop-up'e.
- Registracija ir prisijungimas turi atskirą validaciją.
- Veiksmai kaip:
  - pinigų davimas vaikui,
  - investavimo prašymo siuntimas,
  - investavimo prašymo patvirtinimas / atmetimas,
  - kripto leidimo įjungimas / išjungimas,
  - pavedimo užklausos kūrimas
  vyksta per atskirą patvirtinimo modal langą su savo PIN tikrinimu.
- Nauji feed įrašai papildomai siunčiami kaip lokali telefono notifikacija, jei
  suteiktas leidimas pranešimams.
- QR kodas dabar koduoja KidFund deep link, todėl telefono kamera gali atidaryti
  review ekraną tiesiai programėlėje.
- Transfers skiltyje galima paleisti tikrą KidFund QR skenerį su kamera tiesiai
  programėlėje, o nuskaitytas QR iškart perduodamas į review ekraną.
- Nuskenavus QR ar atidarius deep link, pinigai neįkrenta automatiškai:
  pirmiausia parodoma mokėjimo peržiūra, tada reikia aiškaus patvirtinimo.
- Atidarius modal langus, foninis ekranas nebesiscrollina, o ilgas turinys
  scrollinasi pačiame modal lange.
- Anti-spam riboja per dažnus prašymus ir papildymus, kad KidFund nebūtų
  apkrautas pasikartojančiomis užklausomis.

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
9cd4933d8261e6ae2cad77c490d4fc24b6f636f65a1357ce2a57c1f9141c0b37
```
