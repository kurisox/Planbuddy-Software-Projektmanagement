# Node.js

## Docker Getting Started
* Running `docker compose up -d`
* Build custom local image in development mode (`nodemon`)
* Running `docker compose down` to cleanup after your done.

Add packages while docker-compose is running:
* `docker compose exec backend npm install --save \<package-name\>`
* Installs packages inside the docker container.
* stop all running containers with `docker compose down`
* rebuild to apply changes with `docker compose --build -d`

Command for database:
* `docker exec -ti db mysql -u root -p`
* Log into mysql command line tool

Make a new build:
* First make sure, docker-compose is not running `docker compose down`
* Then run `docker compose --build -d` for new build.
* Without `--build` docker compose will use the image in cache (old build).