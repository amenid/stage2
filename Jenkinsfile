pipeline {
    agent any

    environment {
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
                withCredentials([usernamePassword(credentialsId: '3d7d28e9-ec73-4d55-9bcd-506e89e64964', usernameVariable: 'ameni', passwordVariable: 'ameni')]) {
                    script {
                        dir("${WORKSPACE}/${FRONTEND_DIR}") { 
                            if (!fileExists('node_modules')) {
                        sh 'npm install' 
                    } else {
                        echo ' npm install as node_modules directory already exists.'
                    }
                    sh 'npm run build' 
                }
                    }
                }
            }
        }

        stage('Deploy Front') {
            steps {
                withCredentials([usernamePassword(credentialsId: '3d7d28e9-ec73-4d55-9bcd-506e89e64964', usernameVariable: 'ameni', passwordVariable: 'ameni')]) {
                    script {
                        dir("${WORKSPACE}/${FRONTEND_DIR}") { 
                            def httpServerInstalled = sh(script: 'if [ -x "$(command -v ./node_modules/.bin/http-server)" ]; then echo "yes"; else echo "no"; fi', returnStdout: true).trim()
                            if (httpServerInstalled == "no") {
                                sh 'npm install http-server --save-dev'
                            }
                            sh './node_modules/.bin/http-server dist/todo -p 4200 -c-1 &'
                            sleep 10
                            sh 'curl -I http://localhost:4200 || { echo "Server did not start"; exit 1; }'
                        }
                    }
                }
            }
        }

        stage('Build Back') {
            steps {
                withCredentials([usernamePassword(credentialsId: '3d7d28e9-ec73-4d55-9bcd-506e89e64964', usernameVariable: 'ameni', passwordVariable: 'ameni')]) {
                    script {
                        dir("${WORKSPACE}/${BACKEND_DIR}") {  
                            sh 'dotnet build WebApplication1.sln'
                        }
                    }
                }
            }
        }

        stage('Deploy Backend') {
            steps {
                withCredentials([usernamePassword(credentialsId: '3d7d28e9-ec73-4d55-9bcd-506e89e64964', usernameVariable: 'ameni', passwordVariable: 'ameni')]) {
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
}
