import os
import ssl
from datetime import timedelta

# Refer to Celery's configuration documentation for details on these settings.
# https://docs.celeryproject.org/en/stable/userguide/configuration.html

def setBrokerSSL():
    if os.environ.get('BROKER_USE_SSL'):
        return {'keyfile': '/ssl/client/key.pem',
                'certfile': '/ssl/client/cert.pem',
                'ca_certs': '/ssl/testca/cacert.pem',
                'cert_reqs': ssl.CERT_REQUIRED}
    else:
        return None

# SETUP BROOKER URI
RABBITMQ_DEFAULT_USER = os.environ.get('RABBITMQ_DEFAULT_USER')
RABBITMQ_DEFAULT_PASS = os.environ.get('RABBITMQ_DEFAULT_PASS')
RABBITMQ_DEFAULT_VHOST = os.environ.get('RABBITMQ_DEFAULT_VHOST')
broker_url = f"amqp://{RABBITMQ_DEFAULT_USER}:{RABBITMQ_DEFAULT_PASS}@cybercom_rabbitmq:5671/{RABBITMQ_DEFAULT_VHOST}"
broker_use_ssl = setBrokerSSL()
worker_send_task_events = True
result_expires = None
accept_content = ['json']

# SETUP MONGO URI
SSL_PATH = os.environ.get('SSL_PATH')
MONGO_USERNAME = os.environ.get('MONGO_USERNAME')
MONGO_PASSWORD = os.environ.get('MONGO_PASSWORD')
result_backend = f"mongodb://{MONGO_USERNAME}:{MONGO_PASSWORD}@cybercom_mongo:27017/?ssl=true&tlsCAFile={SSL_PATH}/testca/cacert.pem&tlsCertificateKeyFile={SSL_PATH}/client/mongodb.pem" 

mongodb_backend_settings = {
    "database": os.environ.get('MONGO_DB', "cybercom"),
    "taskmeta_collection": os.environ.get('MONGO_TOMBSTONE_COLLECTION', "tombstone")
}

imports = tuple(os.environ.get('CELERY_IMPORTS').split(','))

# add by Jian: to set the schedule task to run forecasting.
beat_schedule = {
    # 名字随意命名
    'test-30-seconds': {
        # 执行tasks1下的test_celery函数
        'task': 'ecopadq.tasks.tasks.jian',
        # 每隔2秒执行一次
        # 'schedule': 1.0,
        # 'schedule': crontab(minute="*/1"),
        'schedule': timedelta(seconds=30),
        # 传递参数
        'args': (1,2)
    },
}