#!/usr/bin/env python3

import os
from subprocess import call

for itm in os.environ.get("CELERY_SOURCE").split(','):
    call(['pip3','install','--force-reinstall',itm])

celery_queue=os.environ.get("CELERY_QUEUE","celery")
log_level=os.environ.get("LOG_LEVEL","INFO")

# change by Jian Zhou: to test the schedule task for Forecasting weekly.
call(["celery", "-A", celery_queue, "beat", "--detach"])