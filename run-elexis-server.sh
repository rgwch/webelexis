#! /bin/bash
# Elexis Server launcher for macOS and Linux.

# If an elexis-server is running: Do nothing
# If an elexis container exists: Start that container
# Else create a new container from the named elexis-server image

# Note for Linux: You must be either root or member of the docker group to run this.

if docker ps|grep d_elexis-server;
then
  echo Elexis Server is already running!
elif docker ps -a|grep d_elexis-server;
then
  docker start -ia d_elexis-server
else
  docker run -h "es.localhost" -e DEMO_MODE='true' -e TZ=Europe/Zurich -e DISABLE_WEB_SECURITY='true' -p 8380:8380 -p 8480:8480 -p 7234:7234 --name d_elexis-server medevit/elexis-server:1.6
fi
