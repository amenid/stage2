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
                git branch: 'main', url: 'git@github.com:amenid/stage2.git' 
            }
        }

        stage('Build Front') {
            steps {
                script {
                    dir("${WORKSPACE}/${FRONTEND_DIR}") { 
                        sh 'ls -lrt'
                        sh 'pwd'  
                        env.PATH = "${env.PATH}:/home/ameni/.nvm/versions/node/v20.15.0/bin" 
                        sh 'npm install' 
                        sh 'npm run build' 
                    } 
                }
            }
        }

        stage('Deploy Front') {
            steps {
                script {
                    dir("${WORKSPACE}/${FRONTEND_DIR}") {
                        // Installer http-server si ce n'est pas déjà fait
                        sh 'npm install -g http-server'
                        // Démarrer le serveur http
                        def serverProcess = sh(script: 'http-server -p 4200 -c-1', background: true)
                        // Attendre quelques secondes pour que le serveur démarre
                        sleep 10
                        // Terminer le processus du serveur après le déploiement
                        sh "kill \$(lsof -t -i:4200)"
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
                script {
                    dir("${WORKSPACE}/${BACKEND_DIR}") {
                        sh """
                            if ! command -v pm2 > /dev/null 2>&1; then
                                npm install pm2 -g
                            fi
                            dotnet restore
                            dotnet build
                            pm2 describe projettt > /dev/null 2>&1 && pm2 restart projettt --update-env || pm2 start node --name projettt -- start
                        """
                    }
                }
            }
        }
    }
}
