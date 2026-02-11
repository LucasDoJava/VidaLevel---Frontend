pipeline {
    agent any

    stages {
        stage('Limpar workspace') {
            steps {
                deleteDir()
            }
        }

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/LucasDoJava/VidaLevel---Frontend.git'
            }
        }

        stage('Build Docker') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker compose up -d'
            }
        }
    }
}
