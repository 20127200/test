pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS = 'dockerhub-credentials' // Jenkins credentials ID cho DockerHub
        BACKEND_IMAGE = '20127200/backend-image'
        FRONTEND_IMAGE = '20127200/frontend-image'
    }

    stages {
        stage('Pull Code') {
            steps {
                echo 'Pulling source code from GitHub...'
                git 'https://github.com/NamKhagg/test.git'
            }
        }

        stage('Build and Push Backend Image') {
            steps {
                script {
                    echo 'Building and pushing Backend Docker image...'
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS) {
                        def backendImage = docker.build("${BACKEND_IMAGE}", "./Back end")
                        backendImage.push('latest')
                    }
                }
            }
        }

        stage('Build and Push Frontend Image') {
            steps {
                script {
                    echo 'Building and pushing Frontend Docker image...'
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS) {
                        def frontendImage = docker.build("${FRONTEND_IMAGE}", "./Front end")
                        frontendImage.push('latest')
                    }
                }
            }
        }
    }
}
