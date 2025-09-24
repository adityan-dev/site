#!/bin/sh

BASEDIR=$(cd $(dirname "$0"); pwd)

[ -z "$WEBSITE_OUT_DIR" ] && \
  OUTDIR=$(mktemp -d) || \
    OUTDIR="$WEBSITE_OUT_DIR"

WEBSITE_OUT_DIR="$OUTDIR" \
               WEBSITE_BUILD_TYPE="$BUILD_TYPE" \
               emacs --batch -l "./project.el" --eval="(org-publish \"blog\" t)"

[ -z "$WEBSITE_OUT_DIR" ] && \
  echo "Output written to $OUTDIR." \
    || true
