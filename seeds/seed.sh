#!/bin/bash

curl -X POST -d @seed_user.txt http://localhost:3010/v1/users --header "Content-Type:application/json"


curl -X POST -d @seed_fundraiser.txt http://localhost:3010/v1/fundraisers --header "Authorization: Bearer 518c2195-9597-4b43-844b-21fc6674b56e" --header "Content-Type:application/json"