pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub') // Tên ID credentials của bạn trong Jenkins
    }

    stages {
        stage('Clone Repository') {
            steps {
                git 'https://github.com/NamKhagg/test.git'  // URL repo của bạn
            }
        }

        stage('Build Backend Image') {
            steps {
                echo 'Building Backend Docker Image...'
                withDockerRegistry(credentialsId: 'dockerhub', url: 'https://index.docker.io/v1/') {
                    sh label: 'Building Backend Image', script: 'docker build -t 20127200/backend-image:latest "./Back end"'  // Build image cho Backend
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                echo 'Building Frontend Docker Image...'
                withDockerRegistry(credentialsId: 'dockerhub', url: 'https://index.docker.io/v1/') {
                    sh label: 'Building Frontend Image', script: 'docker build -t 20127200/frontend-image:latest "./Front end"'  // Build image cho Frontend
                }
            }
        }

        stage('Push Backend Image') {
            steps {
                echo 'Pushing Backend Docker Image to DockerHub...'
                withDockerRegistry(credentialsId: 'dockerhub', url: 'https://index.docker.io/v1/') {
                    sh label: 'Pushing Backend Image', script: 'docker push 20127200/backend-image:latest'  // Push Backend image lên DockerHub
                }
            }
        }

        stage('Push Frontend Image') {
            steps {
                echo 'Pushing Frontend Docker Image to DockerHub...'
                withDockerRegistry(credentialsId: 'dockerhub', url: 'https://index.docker.io/v1/') {
                    sh label: 'Pushing Frontend Image', script: 'docker push 20127200/frontend-image:latest'  // Push Frontend image lên DockerHub
                }
            }
        }
    }
}
