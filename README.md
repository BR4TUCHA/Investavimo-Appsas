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
