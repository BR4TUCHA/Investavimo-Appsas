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
912a4ba866e57c8d75c4cacd82d1ba6876e98a2b548a57cf2a70be207097881d
```
