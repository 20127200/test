pipeline {
    agent any
    environment {
        DOCKER_CREDENTIALS = 'dockerhub-credentials' // Jenkins credentials ID
        BACKEND_IMAGE = '20127200/backend-image'     // Backend image name
        FRONTEND_IMAGE = '20127200/frontend-image'   // Frontend image name
    }

    stages {
        stage('Clone Code') {
            steps {
                echo "Cloning code from GitHub..."
                git branch: 'master', url: 'https://github.com/NamKhagg/test.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                echo "Building Backend Docker image..."
                sh """
                cd 'Back end'
                docker build -t ${BACKEND_IMAGE} .
                """
            }
        }

        stage('Push Backend Image') {
            steps {
                echo "Pushing Backend image to Docker Hub..."
                docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS) {
                    sh "docker push ${BACKEND_IMAGE}"
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                echo "Building Frontend Docker image..."
                sh """
                cd 'Front end'
                docker build -t ${FRONTEND_IMAGE} .
                """
            }
        }

        stage('Push Frontend Image') {
            steps {
                echo "Pushing Frontend image to Docker Hub..."
                docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS) {
                    sh "docker push ${FRONTEND_IMAGE}"
                }
            }
        }
    }
}
