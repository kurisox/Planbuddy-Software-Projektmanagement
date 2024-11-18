# Software-Projektmanagement

## Featur Branch Workflow
Es wird in Feature Branches gearbeitet, die bei Fertigstellung per Merge/Pull-Request in dein main branch implementiert werden. Schreibzugriff auf dem Master nur eine Person, die nach Review der Request das Feature in den main-Branch mergen kann.

### Vorteile:
- einfache Entwicklung von neuen Funktionen
- Code-Reviews vor dem Merge des Feature-Branches
- übersichtliche Git-History
- Master bleibt stabil
- einfacher Übergang in CI/CD-Workflow

### Nachteile:
- Codeduplizierung durch gemeinsame Bibliotheken
- komplizierte Merges aufgrund zu langer Entwicklung in Feature Branches
  - Behebung durch Aufteilung größere Funktionen in kleine Teilaufgaben

### Arbeitsablauf eines Entwicklers:
1. `git pull`
2. `git checkout -b \<feature\>`
3. Feature entwicklen (`git add`; `git commit`)
4. Feature auf Remote Repository laden
   - `git push --set-upstream origin \<feature\>`
5. Merge/Pull-Request auf Github stellen.

## How to use Docker
### Installation
[Docker](https://docs.docker.com/get-docker/)  
[Docker-Compose](https://docs.docker.com/compose/install/) (only for Linux)

### Development
Project structure:
```
├── backend
│   ├── Dockerfile
│   ├── src
│   ...
├── db
│   └── password.txt
├── frontend
│   ├── ...
│   ├── src
│   └── Dockerfile
├── ...
├── docker-compose.yaml
└── README.md
```
The docker compose file defines an application with three services frontend 
backend and db.

Starting Docker Container:
```
$ docker compose up -d
Creating network "software-projektmanagement_database-backend" with...
...
Creating db ... done
Creating backend ... done
Creating frontend ... done
```

Expected result:
```
CONTAINER ID   IMAGE                                 COMMAND                  CREATED       STATUS              PORTS                      NAMES
d7d9f0021087   software-projektmanagement_frontend   "docker-entrypoint.s…"   2 minutes ago   Up About a minute   0.0.0.0:3000->3000/tcp, :::3000->3000/tcp                                                          frontend
ca12aafeef04   software-projektmanagement_backend    "docker-entrypoint.s…"   2 minutes ago   Up About a minute   0.0.0.0:80->80/tcp, :::80->80/tcp, 0.0.0.0:9229-9230->9229-9230/tcp, :::9229-9230->9229-9230/tcp   backend
31875c84d06a   mysql:8.0.27                          "docker-entrypoint.s…"   2 minutes ago   Up About a minute   3306/tcp, 33060/tcp                                                                                db
```

Frontend-Team uses [localhost:3000](http://localhost:3000).  
Backend-Team uses [localhost:80](http://localhost:80).

Stop and remove Docker Container:
```
$ docker compose down
Stopping frontend ... done
Stopping backend  ... done
Stopping db       ... done
Removing frontend ... done
Removing backend  ... done
Removing db       ... done
Removing network software-projektmanagement_database-backend
Removing network software-projektmanagement_backend-frontend
```
Access `mysql`:
```
$ docker exec -ti db mysql -u root -p
Enter password: ...

-----------------------------------------
not sure if it works on every pc:

$ docker compose exec db mysql -u root -p
Enter password: ...
```
