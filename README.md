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
echo '{}' > /opt/dockge/docker-auth.json
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
      - ./docker-auth.json:/root/.docker/config.json
    ...
```

### 3. add this helper into dockge so you can configure the auth in dockge.

```yaml
services:
  helper:
    image: eslym/dockge-auth-helper:latest
    # only run when you need to update the config
    restart: no
    volumes:
      # the default path for output, can specified via env OUTPUT_FILE
      # the source must be full path on host
      - /opt/dockge/docker-auth.json:/opt/dockge/docker-auth.json
    environment:
      AUTH_TOKENS: |
        # list docker credentials here, format <entry>=<username>:<token>
        # use @ for default docker registry (docker.io)
        @=<your username>:<your token>
        other.private-repo.com=<your username>:<your token>
        127.0.0.1:8000=<your username>:<your token>
    #   AUTH_SECRET: my-secret
      # or read from secret which pointless for now
      # since dockge not yet support secret management
```
