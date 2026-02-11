FROM jenkins/jenkins:lts

USER root

# instala docker
RUN apt-get update && \
    apt-get install -y docker.io curl && \
    apt-get clean

# instala docker-compose
RUN curl -L "https://github.com/docker/compose/releases/download/v2.29.2/docker-compose-linux-x86_64" \
    -o /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose

# adiciona jenkins ao grupo docker
RUN usermod -aG docker jenkins

USER jenkins
