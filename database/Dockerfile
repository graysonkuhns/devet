FROM mariadb:10.3

# Set the timezone
RUN  unlink /etc/localtime && \
     ln -s /usr/share/zoneinfo/America/Chicago /etc/localtime

# Copy in database initialization script
RUN  mkdir -p /opt/devet/database
COPY ./init* /opt/devet/database/
