#!/bin/bash

for file in files/*
do
(cd /home2/vvsaripalli/master && python3 parserExtractor.py $file)
done
for dir in files/*/
do
(mv $dir master/)
done
(./checkTableN-CSR.sh )
(./format.sh )
(./blank.sh )
(./emptydir.sh )
(./formatword.sh )
(./libor.sh)
 