# React
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).  
Runs the app on [localhost:3000](http://localhost:3000) in the development mode.  
The page will reload if you make edits.

## Docker Getting Started:
* Running `docker compose up -d` (`-d` for starting in background)
* Build custom local image in development mode
* Running `docker compose down` to cleanup after your done.

Add packages while docker-compose is running:
* `docker compose exec frontend npm install --save \<package-name\>`
* Installs packages inside the docker container.
* .json-files get updated accordingly and will be install automatically on next build

Make a new build:
* First make sure, docker-compose is not running `docker compose down`
* Then run `docker compose --build -d` for new build.
* Without `--build` docker compose will use the image in cache (old build).

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

