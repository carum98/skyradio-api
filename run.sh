#!/bin/bash

# Variables
accion=""

# Options
show_help() {
  echo "Uso: $0 [OPCIÓN]"
  echo "Options:"
  echo "  --dev            Run dev container"
  echo "  --prod           Run prod container"
  echo "  --test           Run test container"
  echo "  --stop           Stop container"
  echo "  --clear          Clear container and volumes (db) and images (skyradio-api)"
  echo "  --help           Show help"
  exit 1
}

# Arguments
while getopts ":h-:" opt; do
  case $opt in 
    (-)
      case "${OPTARG}" in
        (dev|prod|stop|clear|test)
          accion="${OPTARG}"
        ;;
        (help)
          show_help
        ;;
        (*)
          echo "Invalid option: --${OPTARG}" >&2
          show_help
        ;;
      esac
      ;;
    (h)
      show_help
      ;;
    (\?)
      echo "Invalid option: -$OPTARG" >&2
      show_help
      ;;
  esac
done

# Check if a valid action was provided
if [ -z "$accion" ]; then
  echo "Required a valid action. Use --help to get help."
  exit 1
fi

# Run action
case "$accion" in
  (dev)
    docker-compose -f docker-compose.yml -f docker/docker-compose.dev.yml up -d --build
    ;;
  (prod)
    docker-compose -f docker-compose.yml -f docker/docker-compose.prod.yml up -d --build
    ;;
  (test)
    docker-compose -f docker-compose.yml -f docker/docker-compose.test.yml up -V --build --abort-on-container-exit && docker-compose -f docker-compose.yml -f docker/docker-compose.test.yml down -v && ./run.sh clear
    ;;
  (stop)
    docker-compose down
    ;;
  (clear)
    docker-compose down -v && rm -rf .db && rm -rf dist && rm -rf node_modules && docker rmi skyradio-api
    ;;
  (*)
    echo "Not valid action: $accion. Use --help to show options."
    exit 1
    ;;
esac