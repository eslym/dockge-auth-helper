# dockge-auth-helper

A helper to set `.docker/config.json` for dockge to authenticate for private repository.

> [!IMPORTANT]  
> Dockge itself is not designed with much security,
> ex: you can mount the whole root directory into container,
> so do not complaint about this project.
>
> And please only use it with token, password is highly not recommended

## How to use

### 1. make a config file in same path with the `compose.yaml` of dockge

```shell
# use /opt/dockge as example here
echo '{}' > /opt/dockge/docker-auths.json
```

### 2. mount the config file into dockge container as `/root/.docker/config.json`

```yaml
# /opt/dockge/compose.yaml
services:
  dockge:
    image: louislam/dockge:1
    ...
    volumes:
      # add this line
      - ./docker-auths.json:/root/.docker/config.json
    ...
```

### 3. add this helper into dockge so you can configure the auth in dockge.

```yaml
services:
  image: eslym/dockge-auth-helper:latest
  # only run when you need to update the config
  restart: no
  volumes:
    # the default path for output, can specified via env OUTPUT_FILE
    /opt/dockge/docker-auths.json:/home/bun/app/docker-auths.json
  environment:
    AUTH_TOKENS: |-
      # list urls with credentials here
      # index.docker.io/v1 is default for docker login
      https://<your username>:<your token>@index.docker.io/v1/
      https://<your username>:<your token>@other.private-repo.com/
    # AUTH_SECRET: my-secret # or read from secret which pointless for now since dockge not yet support secret management
```