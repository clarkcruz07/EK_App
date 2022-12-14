#!/bin/sh

for i in 1 2 3 4 5 6 7 8 9 10

do 

curl http://localhost:9090/api/lockercontroller/door/$i/open

done