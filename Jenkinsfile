pipeline {
    agent any
    tools { nodejs "nodejs" }
    workspace { dir('/home/ameni/jenkins_workspace') { } }
    environment {
        SERVER_USER = 'ameni'
        SERVER_IP = '192.168.45.138'
        FRONTEND_DIR = 'ui2/todo'
        BACKEND_DIR = 'api/WebApplication1'
        PROJECT_DIR = 'projettt/stage2' 
    }
    stages {
        stage('Checkout') {
            steps {
                dir('/home/ameni/${PROJECT_DIR}') { 
                    git branch: 'main', url: 'git@github.com:amenid/stage2.git'
                }
            }
        }
        stage('Build FRONT') {
            steps {
                script {
                    dir("${PROJECT_DIR}/${FRONTEND_DIR}") { 
                        sh 'ls'
                        sh 'pwd'
                        sh 'npm install'
                        sh 'npm run build'
                    }
                }
            }
        }
        stage('Start Application') {
            steps {
                script {
                    dir("${PROJECT_DIR}/${FRONTEND_DIR}") { 
                        sh 'ng serve --host 0.0.0.0 --port 4200 &'
                    }
                }
            }
        }
        stage('Build Back') {
            steps {
                script {
                    dir("${PROJECT_DIR}/${BACKEND_DIR}") {  
                        sh 'ls'
                        sh 'pwd'
                        sh 'dotnet build WebApplication1.sln'
                    }
                }
            }
        }
        stage('Deploy Backend') {
            steps {
                sshAgent(['git (Clé SSH pour dépôt GitHub)']) {
                    sh """
                        ssh $SERVER_USER@$SERVER_IP "
                            cd /home/$SERVER_USER/projettt/stage2/$BACKEND_DIR
                            dotnet restore
                            dotnet build
                            pm2 restart projettt || pm2 start npm --name projettt -- start
                        "
                    """
                }
            }
        }
    }
}
