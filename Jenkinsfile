pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                echo 'Cloning GitHub repository...'
                git 'https://github.com/NamKhagg/test.git' // Thay repo của bạn tại đây
            }
        }

        stage('Build Backend Image') {
            steps {
                echo 'Building Backend Docker Image...'
                sh 'docker build -t 20127200/backend-image:latest "./Back end"'
            }
        }

        stage('Build Frontend Image') {
            steps {
                echo 'Building Frontend Docker Image...'
                sh 'docker build -t 20127200/frontend-image:latest "./Front end"'
            }
        }

        stage('Push Backend Image') {
            steps {
                echo 'Pushing Backend Docker Image to Docker Hub...'
                withDockerRegistry(credentialsId: 'dockerhub-credentials', url: 'https://index.docker.io/v1/') {
                    sh 'docker push 20127200/backend-image:latest'
                }
            }
        }

        stage('Push Frontend Image') {
            steps {
                echo 'Pushing Frontend Docker Image to Docker Hub...'
                withDockerRegistry(credentialsId: 'dockerhub-credentials', url: 'https://index.docker.io/v1/') {
                    sh 'docker push 20127200/frontend-image:latest'
                }
            }
        }

        stage('Deploy Containers') {
            steps {
                echo 'Deploying Backend and Frontend Containers...'
                sh 'docker run -d --name backend-container -p 3000:3000 20127200/backend-image:latest'
                sh 'docker run -d --name frontend-container -p 3001:3001 20127200/frontend-image:latest'
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed successfully!'
        }
    }
}
