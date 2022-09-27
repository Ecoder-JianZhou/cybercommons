#!/bin/sh
chown -R $CELERY_SSH_USER:$CELERY_SSH_USER /data
/root/start_sshd.sh

