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
- Serveri sisselogimine ja registreerimine kasutavad PostgreSQL-i andmebaasi. Ülejäänud konto otspunktid kasutavad endiselt näidisandmeid või tagastavad ainult õnnestumise teate. Kasutajaliides pole nende otspunktidega ühendatud.

## Projekti struktuur

```text
backend/
  app.py                  Flaski rakendus ja konto API registreerimine
  API/api_account.py      Konto API otspunktid
  database.py             PostgreSQL-i ühenduse abifunktsioonid
  services/database_account.py  Sisselogimine ja registreerimine andmebaasis
  schema.sql              Andmebaasitabelite definitsioonid
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
- Ligipääs projekti Neoni PostgreSQL-i andmebaasile serveri sisselogimise ja registreerimise kasutamiseks. Kasutajaliidese demovaate jaoks pole andmebaasi vaja.

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

Projekti andmebaas asub Neonis ja tabelid on seal juba loodud. Küsi ühendusaadress tiimikaaslaselt või kopeeri see Neoni projekti Connect-vaatest ilma connection poolinguta. Kopeeri `backend`-kaustas näidisfail:

```powershell
# Windows PowerShell
Copy-Item .env.example .env
```

```sh
# macOS / Linux
cp .env.example .env
```

Määra `.env` failis projekti Neoni ühendusaadress ja SECRET KEY login seanssiks:

```dotenv
DATABASE_URL="postgresql://KASUTAJA:PAROOL@HOST/neondb?sslmode=require&channel_binding=require"
SECRET_KEY=(python -c "import secrets; print(secrets.token_hex(32))" kasutage seda et saada suvaline võti)
```

`database.py` loeb seadistuse `backend/.env` failist. `.env` on Gitist välja jäetud. Tabelite definitsioonid asuvad failis `backend/schema.sql`; skeemimuudatused rakenda Neoni SQL Editoris. Automaatset migratsioonisüsteemi projektis ei ole. 

App.py loeb SECRET KEYd login seanssi loomiseks. Asendage SEXRET_KEY väärtus python -c "import secrets; print(secrets.token_hex(32))" terminalist saadud väärtusega.

## Konto API

Kõigi otspunktide eesliide on `/api/account`. POST- ja PATCH-päringute sisu saada JSON-ina päisega `Content-Type: application/json`.

| Meetod | Teekond | Praegune käitumine |
| --- | --- | --- |
| GET | `/data?username=Mari` | Tagastab kasutajanime ning raamatu ja tellimuse näidisandmed. |
| POST | `/login` | Otsib `username` välja järgi kasutajanime või e-posti andmebaasist ja kontrollib `password` väärtust; vale paari korral tagastab 401. |
| POST | `/logout` | Tagastab õnnestumise teate. |
| POST | `/register` | Salvestab kasutaja andmebaasi väljadega `username`, `password`, `email` ja `birthday`. Sünnipäev peab olema kujul `pp/kk/aaaa`; valideerimisvead tagastavad 400 ja olemasolev kasutajanimi või e-post 409. |
| PATCH | `/change_password` | Nõuab mittetühje tekstivälju `previous_password` ja `new_password`. Praeguse parooli näidisväärtus on `1234`; uut parooli ei salvestata. |
| DELETE | `/delete` | Tagastab kustutamise teate; andmeid ei kustutata. |

Serveri sisselogimine eeldab andmebaasis olevat kasutajat. Kasutajaliidese demosse pääsemiseks serveri kontot vaja ei ole. Serveri praegune teostus salvestab parooli `password_hash` veergu muutmata kujul ja võrdleb seda otse; paroolide räsimine ja autentimisseansi loomine vajavad veel teostamist.

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

## Tasuta prooviversiooni avaldamine Renderis

Repo juurkausta `render.yaml` ja `Dockerfile` seadistavad Reacti kasutajaliidese ning Flaski API üheks Renderi veebiteenuseks. Pärast Renderis GitLabi repo ühendamist avaldatakse rakendus tasuta aadressil `*.onrender.com`. Teenus vajab Renderis keskkonnamuutujaid `DATABASE_URL` (Neoni PostgreSQL-i ühendusaadress) ja `SECRET_KEY` (juhuslik pikk võti); Blueprint küsib nende väärtused loomisel.

Enne avaldamist lükka haru `codex/book-preview-step` koos viimaste muudatustega GitLabi. Seejärel vali Renderis **New → Blueprint**, ühenda GitLab ja vali see repo ning haru. Esimene ehitus võib võtta mõne minuti. Tasuta veebiteenus võib pärast jõudeolekut uinuda ja järgmise avamise ajal uuesti käivituda. Hiljem saab Renderi teenusele lisada oma domeeni.
