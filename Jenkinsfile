pipeline {
    agent any

  

    stages {
        stage('Clone Code') {
            steps {
                echo 'Cloning code from GitHub...'
                git 'https://github.com/NamKhagg/test.git'
            }
        }
        stage('Check Docker') {
            steps {
                sh 'docker --version'
            }
        }
        stage('Build Backend Image') {
            steps {
                echo 'Building Backend Docker Image...'
                    dir('./Back end') {
                        sh 'docker build -t ${BACKEND_IMAGE} .'
                    }
                }
        }

        stage('Build Frontend Image') {
            steps {
                echo 'Building Frontend Docker Image...'
                sh 'docker build -t ${FRONTEND_IMAGE} "./Front end"'
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                script {
                    echo 'Logging into Docker Hub...'
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                        echo 'Pushing Backend Image...'
                        sh 'docker push ${BACKEND_IMAGE}'

                        echo 'Pushing Frontend Image...'
                        sh 'docker push ${FRONTEND_IMAGE}'
                    }
                }
            }
        }

        stage('Deploy Backend Container') {
            steps {
                echo 'Deploying Backend Container...'
                sh 'docker run -d -p 3000:3000 --name backend-container ${BACKEND_IMAGE}'
            }
        }

        stage('Deploy Frontend Container') {
            steps {
                echo 'Deploying Frontend Container...'
                sh 'docker run -d -p 3001:3001 --name frontend-container ${FRONTEND_IMAGE}'
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed. Cleaning up old containers...'
            sh 'docker rm -f backend-container || true'
            sh 'docker rm -f frontend-container || true'
        }
    }
}
