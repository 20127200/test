pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials') // Jenkins credentials ID
        BACKEND_IMAGE = '20127200/backend-image'                   // Docker Hub backend image name
        FRONTEND_IMAGE = '20127200/frontend-image'                 // Docker Hub frontend image name
    }

    stages {
        stage('Clone Code') {
            steps {
                echo 'Cloning source code from GitHub...'
                git branch: 'master', url: 'https://github.com/NamKhagg/test.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                script {
                    echo 'Building Backend Docker image...'
                    sh 'docker build -t ${BACKEND_IMAGE}:latest ./Back\\ end'
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                script {
                    echo 'Building Frontend Docker image...'
                    sh 'docker build -t ${FRONTEND_IMAGE}:latest ./Front\\ end'
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    echo 'Logging into Docker Hub...'
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                }
            }
        }

        stage('Push Backend Image') {
            steps {
                script {
                    echo 'Pushing Backend image to Docker Hub...'
                    sh 'docker push ${BACKEND_IMAGE}:latest'
                }
            }
        }

        stage('Push Frontend Image') {
            steps {
                script {
                    echo 'Pushing Frontend image to Docker Hub...'
                    sh 'docker push ${FRONTEND_IMAGE}:latest'
                }
            }
        }

        stage('Remove Existing Backend Container') {
            steps {
                script {
                    echo 'Removing existing Backend container (if exists)...'
                    sh 'docker rm -f backend-container || true'
                }
            }
        }

        stage('Remove Existing Frontend Container') {
            steps {
                script {
                    echo 'Removing existing Frontend container (if exists)...'
                    sh 'docker rm -f frontend-container || true'
                }
            }
        }

        stage('Run Backend Container') {
            steps {
                script {
                    echo 'Running Backend container...'
                    sh 'docker run -d -p 3000:3000 --name backend-container ${BACKEND_IMAGE}:latest'
                }
            }
        }

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
