pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials') // Jenkins credentials ID
        BACKEND_IMAGE = '20127200/backend-image'                   // Backend Docker Hub image
        FRONTEND_IMAGE = '20127200/frontend-image'                 // Frontend Docker Hub image
    }

    stages {
        // Clone Code
        stage('Clone Code') {
            steps {
                echo 'Cloning source code from GitHub...'
                git branch: 'master', url: 'https://github.com/NamKhagg/test.git'
            }
        }

        // Build Backend Image
        stage('Build Backend Image') {
            steps {
                script {
                    echo 'Building Backend Docker image...'
                    sh 'docker build -t ${BACKEND_IMAGE}:latest ./Back\\ end'
                }
            }
        }

        // Build Frontend Image
        stage('Build Frontend Image') {
            steps {
                script {
                    echo 'Building Frontend Docker image...'
                    sh 'docker build -t ${FRONTEND_IMAGE}:latest ./Front\\ end'
                }
            }
        }

        // Login to Docker Hub
        stage('Login to Docker Hub') {
            steps {
                script {
                    echo 'Logging into Docker Hub...'
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                }
            }
        }

        // Push Backend Image
        stage('Push Backend Image') {
            steps {
                script {
                    echo 'Pushing Backend image to Docker Hub...'
                    sh 'docker push ${BACKEND_IMAGE}:latest'
                }
            }
        }

        // Push Frontend Image
        stage('Push Frontend Image') {
            steps {
                script {
                    echo 'Pushing Frontend image to Docker Hub...'
                    sh 'docker push ${FRONTEND_IMAGE}:latest'
                }
            }
        }

        // Remove Existing Backend Container
        stage('Remove Backend Container') {
            steps {
                script {
                    echo 'Removing existing Backend container (if exists)...'
                    sh 'docker rm -f backend-container || true'
                }
            }
        }

        // Remove Existing Frontend Container
        stage('Remove Frontend Container') {
            steps {
                script {
                    echo 'Removing existing Frontend container (if exists)...'
                    sh 'docker rm -f frontend-container || true'
                }
            }
        }

        // Run Backend Container
        stage('Run Backend Container') {
            steps {
                script {
                    echo 'Running Backend container...'
                    sh 'docker run -d -p 3000:3000 --name backend-container ${BACKEND_IMAGE}:latest'
                }
            }
        }

        // Run Frontend Container
        stage('Run Frontend Container') {
            steps {
                script {
                    echo 'Running Frontend container...'
                    sh 'docker run -d -p 3001:3001 --name frontend-container ${FRONTEND_IMAGE}:latest'
                }
            }
        }
    }

    post {
        always {
            echo 'Logging out of Docker Hub...'
            sh 'docker logout'
        }
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check the logs for more details.'
        }
    }
}
