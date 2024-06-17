#!/bin/bash
source .venv/bin/activate
python -m flask --app ./WisBrain_Back/api/app.py run
