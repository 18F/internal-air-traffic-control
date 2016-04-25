set -e

API="https://api.cloud.gov"
ORG="18F-acq"
SPACE="tools"
MODE=$1

if [ $# -ne 1 ]; then
  echo "Usage: deploy <production|staging>"
  exit
fi

if [ $MODE = 'production' ]; then
  MANIFEST="manifest.yml"
elif [ $MODE = 'staging' ]; then
  MANIFEST="manifest-staging.yml"
else
  echo "Unknown mode: $MODE"
  exit
fi

cf target -o $ORG -s $SPACE
cf push -f $MANIFEST
