pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials') // Đã cấu hình trước trong Jenkinsssss
     
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
                        bat 'docker build -t 20127200/backend-image:latest .'
                    }
                }
        }

        stage('Build Frontend Image') {
            steps {
                echo 'Building Frontend Docker Image...'
                bat 'docker build -t 20127200/frontend-image:latest "./Front end"'
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                script {
                    echo 'Logging into Docker Hub...'
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                        echo 'Pushing Backend Image...'
                        bat 'docker push 20127200/backend-image:latest'

                        echo 'Pushing Frontend Image...'
                        bat 'docker push 20127200/frontend-image:latest'
                    }
                }
            }
        }

        stage('Deploy Backend Container') {
            steps {
                echo 'Deploying Backend Container...'
                bat 'docker run -d -p 3000:3000 --name backend-container 20127200/backend-image:latest'
            }
        }

        stage('Deploy Frontend Container') {
            steps {
                echo 'Deploying Frontend Container...'
                bat 'docker run -d -p 3001:3001 --name frontend-container 20127200/frontend-image:latest'
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
