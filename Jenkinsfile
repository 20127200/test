pipeline {
    agent any

    environment {
        BACKEND_IMAGE = '20127200/backend-image:latest'
        FRONTEND_IMAGE = '20127200/frontend-image:latest'
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials') // Đã cấu hình trước trong Jenkins
     
    }

    stages {
        stage('Clone Code') {
            steps {
                echo 'Cloning code from GitHub...'
                git 'https://github.com/NamKhagg/test.git'
            }
        }
        stage('Check Docker') {
            steps {
                bat 'docker --version'
            }
        }
        stage('Build Backend Image') {
            steps {
                echo 'Building Backend Docker Image...'
                    dir('./Back end') {
                        bat 'docker build -t ${BACKEND_IMAGE} .'
                    }
                }
        }

        stage('Build Frontend Image') {
            steps {
                echo 'Building Frontend Docker Image...'
                bat 'docker build -t ${FRONTEND_IMAGE} "./Front end"'
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                script {
                    echo 'Logging into Docker Hub...'
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                        echo 'Pushing Backend Image...'
                        bat 'docker push ${BACKEND_IMAGE}'

                        echo 'Pushing Frontend Image...'
                        bat 'docker push ${FRONTEND_IMAGE}'
                    }
                }
            }
        }

        stage('Deploy Backend Container') {
            steps {
                echo 'Deploying Backend Container...'
                bat 'docker run -d -p 3000:3000 --name backend-container ${BACKEND_IMAGE}'
            }
        }

        stage('Deploy Frontend Container') {
            steps {
                echo 'Deploying Frontend Container...'
                bat 'docker run -d -p 3001:3001 --name frontend-container ${FRONTEND_IMAGE}'
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed. Cleaning up old containers...'
            bat 'docker rm -f backend-container || true'
            bat 'docker rm -f frontend-container || true'
        }
    }
}
