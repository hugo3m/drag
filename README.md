# AABB

AABB initially a project to learn [BabylonJS](https://www.babylonjs.com/). The idea was to reproduce something similar to the sample project explaning how AABB collision works from [Mozilla](https://mozdevs.github.io/gamedev-js-3d-aabb/physics.html). The first step of the project was to drag a mesh around a scene. But developing this feature was, if not difficult, at least more complex than I initially thought. The project is now about showing what are the maths behind dragging objects.

## How to get started

You will need [NodeJS](https://nodejs.org/en) or [Docker](https://www.docker.com/).

### Developing
*Command from the root folder of the project.*
```
node -v
```
v21.6.1

```
# install dependency
npm install
# start the application
npm run start
```

http://localhost:8080

### Docker
*Command from the root folder of the project.*
```
docker build . --tag {your_tag}
docker run --publish 8080:8080 {your_tag}
```

http://localhost:8080
