#!/usr/bin/env bash

set -e

#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

echo "========================================================================="
echo "Running start.sh as:"
echo "========================================================================="

CMD="http-server --proxy http://localhost:8080? dist"
echo "Launch command is $CMD"

bash -c "$CMD"
