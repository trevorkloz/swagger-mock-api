# Swagger Mock-Api

Creates useful mock values based on a swagger.yaml file.
Reloads file on every api call so that changes can be seen without restarting the server.

Forkes the Swagger Mock-Api from stuartmclean/swagger-mock-api and added support for "post"-methods and better path matching 
("path/with/slashes"). Also differs in following references ($ref) in response definitions.

### Quickstart

run ```npm install```

run ```node server.js```

optional environment params:
* FILE (full file path to the swagger.yaml)
* PORT (default: 8080)

### Docker

get image: ```docker pull trevorkloz/swagger-mock-api```

sample docker command, accessible on port 10010 and reading swagger file from:
/path/to/swagger/dir/swagger.yaml

```
docker run -d \
    -p 10010:8080 \
    trevorkloz/swagger-mock-api \
    -f /path/to/swagger/dir:/app/swagger \
```

### Dev

run a useful self-refreshing test server on port 8080: ```gulp```

run tests: ```npm test```
