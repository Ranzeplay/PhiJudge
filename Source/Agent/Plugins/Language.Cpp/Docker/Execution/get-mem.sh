#!/bin/sh

cat /app/profiling/$1.prof | grep 'Maximum resident set size' | awk '{print $6}'

