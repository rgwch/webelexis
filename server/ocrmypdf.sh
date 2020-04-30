#! /bin/bash

docker pull jbarlow83/ocrmypdf
docker tag jbarlow83/ocrmypdf ocrmypdf
docker run --entrypoint python3 -d -p  5000:5000 --name pdfocr jbarlow83/ocrmypdf webservice.py
