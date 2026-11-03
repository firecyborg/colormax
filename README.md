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

.\.venv\Scripts\python.exe app.py

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

Andmebaas asub Neonis ja tabelid on seal loodud. Ei pea ise looma. Kui schema.sql muutub, käivita muudatused Neoni SQL Editoris.