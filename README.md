# Colormax

Colormax on värviraamatute veebirakenduse prototüüp. Kasutajaliides on loodud Reacti ja Vitega, server Flaskiga ning PostgreSQL-i ühenduse jaoks on lisatud Psycopgi abimoodul.

## Praegune seis

- Kasutajaliideses on sisselogimise, registreerimise ja konto sätete vaated.
- Sisselogimine ja registreerimine avavad kohaliku demoseansi ka tühjade või vigaste andmetega. Vormid ei kutsu praegu konto API-t.
- Sisselogimisel kuvatakse Mari näidisandmeid. Registreerimisel kasutatakse sisestatud nime, e-posti ja sünnipäeva; tühjad väljad asendatakse näidisandmetega.
- Konto andmed püsivad ainult Reacti mälus. Lehe värskendamine avab uuesti sisselogimise; paroole ei saadeta serverisse ega salvestata.
- Tellimused ja värviraamatud on staatilised näited. „Telli uuesti” ja „Loo uus värviraamat” kuvavad teate, et toiming pole ühendatud.
- „Logi välja” lõpetab demoseansi. „Kustuta konto” küsib kinnitust ja lõpetab samuti ainult demoseansi.
- „Jäta mind meelde” ja „Unustasid parooli?” funktsionaalsus pole ühendatud.
- Konto API kasutab näidisandmeid ega loe või salvesta andmeid PostgreSQL-is. Päris autentimine ja andmete püsiv salvestamine pole veel teostatud.

## Projekti struktuur

```text
backend/
  app.py                  Flaski rakendus ja konto API registreerimine
  API/api_account.py      Konto API otspunktid
  database.py             PostgreSQL-i ühenduse abifunktsioonid
  .env.example            Andmebaasi seadistuse näidis
  requirements.txt        Pythoni sõltuvused
frontend/
  src/App.jsx             Vaadete vahetamine ja demoseansi olek
  src/pages/Login/        Sisselogimisvaade
  src/pages/Register/     Registreerimisvaade
  src/pages/Settings/     Konto sätted
  src/pages/shared/       Jagatud komponendid
  vite.config.js          Arendusserver ja API puhverserver
Pildid/                   Autode, kosmose, loomade ja muinasjutu pildid
Projekti kirjeldused/      Projektiplaan, disainijuhis ja muud kirjeldused
```

## Vajalik tarkvara

- Python 3.13 (projekti arenduses kasutatav versioon).
- Node.js ja npm. Vite 8 jaoks kasuta Node.js versiooni 20.19+ või 22.12+.
- PostgreSQL, kui soovid kasutada `backend/database.py` ühenduse abifunktsioone. Praeguse demovaate ja konto API jaoks pole andmebaasi vaja.

## Kasutajaliidese käivitamine

Käivita projekti juurkaustast:

```sh
cd frontend
npm ci
npm run dev
```

Windowsi PowerShellis võib vajadusel kasutada `npm` asemel `npm.cmd`.

Arendusserver avab aadressi <http://127.0.0.1:5174>. Port 5174 on fikseeritud (`strictPort: true`): kui see on hõivatud, vabasta port ja käivita server uuesti. Serveri peatamiseks vajuta `Ctrl+C`.

Demovaate vaatamiseks piisab ainult kasutajaliidese käivitamisest. Vite suunab `/api` algusega päringud aadressile `http://127.0.0.1:5000`; nende päringute jaoks peab töötama ka Flask.

## Serveri käivitamine

Ava teine terminal projekti juurkaustas.

### Windows PowerShell

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe app.py
```

### macOS / Linux

```sh
cd backend
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python app.py
```

Flask töötab aadressil <http://127.0.0.1:5000> silumisrežiimis. See käivitusviis on mõeldud kohalikuks arenduseks.

PyCharmis vali interpretaatoriks Windowsis `backend/.venv/Scripts/python.exe` või macOS-is/Linuxis `backend/.venv/bin/python`.

### Andmebaasi seadistamine

Kui hakkad kasutama andmebaasiühendust, loo esmalt PostgreSQL-is andmebaas. Seejärel kopeeri `backend`-kaustas näidisfail:

```powershell
# Windows PowerShell
Copy-Item .env.example .env
```

```sh
# macOS / Linux
cp .env.example .env
```

Asenda `.env` failis kasutajanimi, parool ja andmebaasi nimi enda väärtustega:

```dotenv
DATABASE_URL=postgresql://postgres:SINU_PAROOL@127.0.0.1:5432/SINU_ANDMEBAAS
```

`database.py` loeb seadistuse `backend/.env` failist. `.env` on Gitist välja jäetud. Projektis pole praegu andmebaasitabelite loomise ega migratsioonide skripte ning konto API ei kasuta seda ühendust.

## Konto API

Kõigi otspunktide eesliide on `/api/account`. POST- ja PATCH-päringute sisu saada JSON-ina päisega `Content-Type: application/json`.

| Meetod | Teekond | Praegune käitumine |
| --- | --- | --- |
| GET | `/data?username=Mari` | Tagastab kasutajanime ning raamatu ja tellimuse näidisandmed. |
| POST | `/login` | Kontrollib välju `username` ja `password`. Näidiskasutaja on `Jaagup`, parool `1234`; vale paari korral tagastab 401. |
| POST | `/logout` | Tagastab õnnestumise teate. |
| POST | `/register` | Nõuab välju `username`, `password`, `email` ja `birthday`. Sünnipäev peab olema kujul `pp/kk/aaaa`; puudulike andmete korral tagastab 400. Kasutajat ei salvestata. |
| PATCH | `/change_password` | Nõuab mittetühje tekstivälju `previous_password` ja `new_password`. Praeguse parooli näidisväärtus on `1234`; uut parooli ei salvestata. |
| DELETE | `/delete` | Tagastab kustutamise teate; andmeid ei kustutata. |

Need näidisandmed kehtivad serveri API kohta. Kasutajaliidese demosse pääsemiseks neid sisestama ei pea.

## Kontrollimine

Käivita `frontend`-kaustas:

```sh
npm run lint
npm run build
```

Tootmisjärgu failid tekivad kausta `frontend/dist`. Koostatud kasutajaliidese kohalikuks eelvaateks kasuta `npm run preview`. `/api` puhverserver on seadistatud arendusserverile; tootmiskeskkonna API suunamine vajab eraldi seadistust.

Käsitsi kontrollimiseks:

1. Ava konto sätted nii sisselogimise kui ka registreerimise vormilt.
2. Sisesta registreerimisel oma nimi, e-post ja sünnipäev ning kontrolli nende kuvamist sätetes.
3. Kontrolli päise menüüd, näidistoimingute teateid ja väljalogimist.
4. Proovi konto kustutamise kinnitamist ja tühistamist.
5. Värskenda lehte ja kontrolli, et demoseanss lõpeb.
6. Kontrolli mobiilivaadet laiustel 320–498 px ja töölauavaadet.

Projektis ei ole praegu automaattestide käivitamise skripti.
