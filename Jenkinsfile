pipeline {
    agent any

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
               // نعملو checkout مباشرة للـ workspace
               git branch: 'main', url: 'git@github.com:amenid/stage2.git' 
            }
        }
   stage('Build FRONT') {
            steps {
                script {
                    dir("${WORKSPACE}/${FRONTEND_DIR}") { 
                        sh 'ls -lrt'
                        sh 'pwd'
                        withEnv(['PATH+NODEJS=/usr/local/bin']) { 
                            sh 'npm install'
                            sh 'npm run build'
                        } 
                    }
                }
            }
        }
        stage('Start Application') {
            steps {
                script {
                    dir("${WORKSPACE}/${FRONTEND_DIR}") { 
                        sh 'ng serve --host 0.0.0.0 --port 4200 &'
                    }
                }
            }
        }
        stage('Build Back') {
            steps {
                script {
                    dir("${WORKSPACE}/${BACKEND_DIR}") {  
                        sh 'ls -lrt'
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
                            cd /home/$SERVER_USER/$PROJECT_DIR/$BACKEND_DIR 
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
