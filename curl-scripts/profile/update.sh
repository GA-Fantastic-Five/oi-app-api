#!/bin/bash

API="http://localhost:4741"
URL_PATH="/profile"

curl "${API}${URL_PATH}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "profile": {
      "nickname": "'"${NICKNAME}"'",
      "avatar": "'"${AVATAR}"'"
    }
  }'

echo