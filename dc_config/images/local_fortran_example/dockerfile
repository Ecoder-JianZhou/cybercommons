From ubuntu:20.04
ARG CELERY_SSH_USER 

RUN apt-get update && \
	apt-get install -y  openssh-server \
	gfortran \
	vim

RUN mkdir /var/run/sshd 

RUN useradd -r -U -m $CELERY_SSH_USER && \
	chown -R $CELERY_SSH_USER:$CELERY_SSH_USER /home/$CELERY_SSH_USER 

EXPOSE 22

WORKDIR /home/$CELERY_SSH_USER
USER $CELERY_SSH_USER

COPY test.f90 .
RUN gfortran -o test test.f90

USER root

COPY start_sshd.sh /root/ 
COPY entrypoint.sh entrypoint.sh
CMD ["/bin/sh", "entrypoint.sh"]

