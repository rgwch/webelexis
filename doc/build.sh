#! /bin/bash
pandoc -o index.json -f markdown metadata.md anwender.md developer.md security.md

pandoc-index index

rm index.json

pandoc -o handbuch.epub metadata.md anwender.md developer.md index.md

