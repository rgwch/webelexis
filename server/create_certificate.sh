#! /bin/bash

# Create a key and a self signed certificate for SSL connections

openssl req -newkey rsa:4096 -x509 -sha512 -days 365 -nodes -out certificate.pem -keyout privatekey.pem
