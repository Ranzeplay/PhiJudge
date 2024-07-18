#!/bin/sh

cat /app/context/$1.prof | grep 'Maximum resident set size' | awk '{print $6}'

