#!/bin/sh
emacs -Q --script build.el
cp -rf ./content/web ./public
