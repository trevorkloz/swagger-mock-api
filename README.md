# Swagger Mock-Api

Creates useful mock values based on a swagger.yaml file.
Reloads file on every api call so that changes can be seen without restarting the server.

Forkes the Swagger Mock-Api from *stuartmclean/swagger-mock-api* and added support for 
* "post"-methods
* better path matching in general ("path/with/slashes")
* basePath matching

Added features:
* Following references ($ref) in response definitions.
* Per default test values will be generated on the base of the swagger definition
* Per extension (*x-mock-api*) it is possible to respond the content of a json-file when a header key or a body attribute matches (body/path specification follows the JSONPath syntax, see https://github.com/s3u/JSONPath)

```
x-mock-api:
   x-mock-api-profiles:
    - file: response_mock_1.json
      header: 
        key: testId
        value: xyz
    - file: response_mock_2.json
      body: 
        path: $.._testId
        value: 123
```

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
