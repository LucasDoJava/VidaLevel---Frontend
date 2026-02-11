pipeline {
    agent any

    environment {
        IMAGE_NAME = "react-frontend"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Frontend Image') {
            steps {
                script {
                    sh '''
                    cd frontend
                    docker build -t $IMAGE_NAME .
                    '''
                }
            }
        }

        stage('Run Frontend Container') {
            steps {
                script {
                    sh '''
                    docker stop react_frontend || true
                    docker rm react_frontend || true

                    docker run -d \
                      --name react_frontend \
                      -p 3000:80 \
                      $IMAGE_NAME
                    '''
                }
            }
        }
    }
}
