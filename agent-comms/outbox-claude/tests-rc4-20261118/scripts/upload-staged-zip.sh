#!/bin/bash
# usage: up.sh zip key date sig policy
Z=$1; K=$2; D=$3; SIG=$4; POL=$5
curl -sS -o /dev/null -w "%{http_code}\n" https://shopify-staged-uploads.storage.googleapis.com/ \
 -F "Content-Type=application/zip" -F "success_action_status=201" -F "acl=private" -F "key=$K" \
 -F "x-goog-date=$D" -F "x-goog-credential=merchant-assets@shopify-tiers.iam.gserviceaccount.com/${D%T*}/auto/storage/goog4_request" \
 -F "x-goog-algorithm=GOOG4-RSA-SHA256" -F "x-goog-signature=$SIG" -F "policy=$POL" -F "file=@$Z"
