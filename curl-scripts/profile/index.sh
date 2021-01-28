#!/bin/bash

API="http://localhost:4741"
URL_PATH="/profiles"

curl "${API}${URL_PATH}/" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"

echo