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

Muuda .env failis DATABASE_URL väärtust: sisesta oma PostgreSQL-i kasutajanimi, parool ja olemasoleva andmebaasi nimi.

Käivita Flask:

.\.venv\Scripts\python.exe app.py

Flask töötab aadressil http://127.0.0.1:5000.

PyCharmis vali back-endi interpretaatoriks backend/.venv/Scripts/python.exe.

Front-endi seadistamine

Ava teine terminal projekti juurkaustas:

cd frontend
npm.cmd ci
npm.cmd run dev

Ava terminalis kuvatud Local aadress, tavaliselt http://localhost:5173.

Vite suunab /api algusega päringud Flaskile pordil 5000. Mõlemad serverid peavad töötama, et front-end saaks back-endilt andmeid küsida.

Front-endi kontrollimine

Käivita frontend-kaustas:

npm.cmd run lint
npm.cmd run build

Andmebaasi tabelite loomine- Ava pgAdminis colormax andmebaasi peal Query Tool, kopeeri sinna backend/schema.sql sisu ja käivita (F5).