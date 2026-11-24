# Colormax

Colormax on Reacti ja Flaski põhinev veebirakendus, kus kasutaja saab sirvida värvimislehti, luua värviraamatu ja esitada tellimuse. Kasutajaliides kasutab Vitet ning server salvestab konto-, raamatu- ja tellimuseandmed PostgreSQL-i andmebaasi.

## Funktsioonid

- Kasutajakonto registreerimine, sisselogimine, väljalogimine ja kustutamine.
- Konto loomisel kontrollitakse sisestatud andmeid ning parool salvestatakse räsituna.
- Värvimislehtede ja kategooriate sirvimine ning otsing.
- Värviraamatu loomine valitud lehtedest ja tellimuse esitamine.
- Kontoga seotud raamatute ning tellimuste kuvamine.
- Kasutajaliidese arendusaegne demovaade on võimalik avada ka andmebaasita, kuid andmeid salvestavad funktsioonid vajavad töötavat API-t ja andmebaasi.

## Projekti struktuur

```text
backend/
  app.py                       Flaski rakendus
  API/                         Konto, lehtede, raamatu ja tellimuse otspunktid
  services/                    Andmebaasipäringud ja rakenduse loogika
  database.py                  PostgreSQL-i ühendus
  schema.sql                   Andmebaasitabelite definitsioonid
  seed.sql                     Näidisandmed
  .env.example                 Keskkonnamuutujate näidis
  requirements.txt             Pythoni sõltuvused
frontend/
  src/                         Reacti kasutajaliides ja API-kliendid
Pildid/                        Rakenduse värvimislehtede pildid
Projekti kirjeldused/          Projektiplaan ja disainimaterjalid
Dockerfile                     Renderi konteineriehitus
render.yaml                    Renderi Blueprinti seadistus
```

## Eeldused

- Python 3.13.
- Node.js 22.12+ (või 20.19+) ja npm.
- PostgreSQL-i andmebaas. Kohalikuks arenduseks sobib näiteks Neon.

## Seadistamine

Kõik järgnevad käsud eeldavad, et alustad repo juurkaustast. Loo `backend`-kaustas keskkonnafail näidisfaili põhjal ja täida andmebaasiühendus ning seansivõti:

```sh
cd backend
cp .env.example .env
```

Windows PowerShellis kasuta kopeerimiseks käsku `Copy-Item .env.example .env`.

Muuda `backend/.env` sisu:

```dotenv
DATABASE_URL="postgresql://KASUTAJA:PAROOL@HOST/neondb?sslmode=require&channel_binding=require"
SECRET_KEY="siia-pane-juhuslik-pikk-voti"
```

Genereeri salajane võti näiteks käsuga `python -c "import secrets; print(secrets.token_hex(32))"`. Ära lisa päris `.env` faili versioonihaldusse. Andmebaasi tabelid ja värvimislehtede näidisandmed saad luua PostgreSQL-i `psql` käsureatööriistaga (kasuta oma andmebaasi ühendusaadressi):

```sh
psql "$DATABASE_URL" -f backend/schema.sql
psql "$DATABASE_URL" -f backend/seed.sql
```

Projektis pole automaatset migratsioonisüsteemi.

## Käivitamine arenduses

Paigalda ja käivita kasutajaliides (repo juurkaustast):

```sh
cd frontend
npm ci
npm run dev
```

Vite kasutab aadressi <http://127.0.0.1:5174> (samuti töötab `http://localhost:5174`). Port 5174 peab olema vaba. API päringud suunatakse arenduses Flaski aadressile `http://127.0.0.1:5000`.

Käivita server teises terminalis, samuti repo juurkaustast. Loo virtuaalkeskkond:

```sh
python -m venv backend/.venv
```

macOS/Linux:

```sh
backend/.venv/bin/python -m pip install -r backend/requirements.txt
backend/.venv/bin/python backend/app.py
```

Windows PowerShell:

```powershell
backend\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
backend\.venv\Scripts\python.exe backend\app.py
```

Flask kuulab aadressil <http://127.0.0.1:5000> (samuti `http://localhost:5000`). Konto ja tellimuse andmeid salvestavad funktsioonid vajavad kehtivat `DATABASE_URL` väärtust ning loodud andmebaasitabeleid. Sirvimislehtede API vajab samuti tabelite ja näidisandmete olemasolu. `backend/.env.example` sisaldab näidisväärtusi; asenda need oma andmebaasi andmetega.

## API ülevaade

| Meetod | Otspunkt | Kirjeldus |
| --- | --- | --- |
| GET | `/api/account/data` | Tagastab sisselogitud konto, raamatud ja tellimused. Vajab seanssi. |
| POST | `/api/account/register` | Loob konto (`username`, `password`, `email`, `birthday`) ja alustab seansi. Sünnipäevavorming on `pp/kk/aaaa`. |
| POST | `/api/account/login` | Logib sisse kasutajanime või e-posti ja parooliga. |
| POST | `/api/account/logout` | Lõpetab seansi. |
| DELETE | `/api/account/delete` | Kustutab sisselogitud konto ning sellega seotud tellimused ja raamatud. |
| PATCH | `/api/account/change_password` | Praegu näidisloogika: kontrollib fikseeritud praegust parooli `1234`; uut parooli andmebaasi ei salvesta. |
| GET | `/api/categories` | Tagastab värvimislehtede kategooriad. |
| GET | `/api/pages` | Tagastab värvimislehed; toetab valikulist `category` parameetrit. |
| GET | `/api/images/<failitee>` | Annab värvimislehe pildi. |
| POST | `/api/book/make_book` | Loob sisselogitud kasutajale värviraamatu. |
| POST | `/api/order/register_order` | Esitab sisselogitud kasutaja tellimuse. |

POST- ja PATCH-päringute sisu saada JSON-ina päisega `Content-Type: application/json`. Konto API kasutab Flaski küpsisega seanssi. Paroolid räsitakse registreerimisel ning kontrollitakse sisselogimisel.

## Kasulikud käsud

Käivita `frontend`-kaustas:

```sh
npm run lint
npm run build
npm run preview
```

`build` loob tootmisfailid kausta `frontend/dist`; `preview` näitab neid lokaalselt. `/api` puhverserver on seadistatud Vite arendusserveris ning saadab päringud Flaskile. Värvimislehtede filtriks kasuta `/api/pages?category=1` (kategooria ID).

## Avaldamine Renderis

Repo juurkausta `render.yaml` ja `Dockerfile` ehitavad kasutajaliidese ja Flaski API üheks veebiteenuseks. Renderi Blueprint kasutab harus `84-hostimine-veebis` ning vajab keskkonnamuutujaid `DATABASE_URL` ja `SECRET_KEY`. Ühenda Renderis GitLabi hoidla, vali **New → Blueprint** ja seadista mõlemad väärtused. Tasuta teenus võib jõudeoleku järel uinuda ning järgmisel avamisel uuesti käivituda.
