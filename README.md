Colormax

Projekt kasutab Reacti front-endis, Flaski back-endis ja PostgreSQL-i andmebaasina.

Vajalik tarkvara

Python 3.13

Node.js koos npm-iga

PostgreSQL

Allolevad käsud on Windowsi PowerShelli jaoks.

Back-endi seadistamine

Alusta projekti juurkaustast:

cd backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt

Esimesel seadistamisel loo näidisfaili põhjal oma .env:

Copy-Item .env.example .env

Muuda .env failis DATABASE_URL väärtust: küsi Neoni ühendusaadress tiimikaaslaselt või kopeeri see Neoni projektist (Connect, ilma connection poolinguta).

Käivita Flask:

.\.venv\Scripts\python.exe -m backend.app

Flask töötab aadressil http://127.0.0.1:5000.

PyCharmis vali back-endi interpretaatoriks backend/.venv/Scripts/python.exe.

Front-endi seadistamine

Ava teine terminal projekti juurkaustas:

cd frontend
npm.cmd ci
npm.cmd run dev

Front-end avaneb brauseris aadressil http://127.0.0.1:5174. Port 5174 on fikseeritud, et vältida konflikti teiste projektidega. Kui port on kasutusel, peata selle projekti eelmine dev-server (Ctrl+C) ja käivita uuesti.

Vite suunab /api algusega päringud Flaskile pordil 5000. Mõlemad serverid peavad töötama, et front-end saaks back-endilt andmeid küsida.
Front-endi kontrollimine

Käivita frontend-kaustas:

npm.cmd run lint
npm.cmd run build

Konto sätete demovaade

Sätete vaatamiseks piisab ainult front-endi käivitamisest. Vajuta „Logi sisse” või registreerimise vormil „Loo konto”: ka tühjad ja vigased andmed avavad demovaate. See on ajutine kasutajaliidese eelvaade, mitte autentimine.

Sisselogimisel kasutatakse Mari näidisandmeid. Registreerimisel kuvatakse sisestatud nimi, e-post ja sünnipäev; tühjad väljad asendatakse näidisandmetega. Paroole ei salvestata ega saadeta. Andmed püsivad ainult Reacti mälus; lehe värskendamine avab uuesti sisselogimise.

Tellimused ja värviraamatud on staatilised näited. „Telli uuesti” ja „Loo uus värviraamat” näitavad ühendamata toimingu teadet. „Logi välja” lõpetab demoseansi. „Kustuta konto” küsib kinnitust ja lõpetab ainult demoseansi; serveriandmeid ei muudeta.

Kontrollimiseks ava mõlemast vormist sätted, proovi registreerimisel oma nime, ava päise menüü ning kontrolli väljalogimist ja kustutamise kinnitamist/tühistamist. Kontrolli mobiilivaadet laiustel 320–498 px ja töölauavaadet. Automaatkontrollid: `npm run lint` ja `npm run build` frontend-kaustas.

Andmebaas asub Neonis ja tabelid on seal loodud. Ei pea ise looma. Kui schema.sql muutub, käivita muudatused Neoni SQL Editoris.
