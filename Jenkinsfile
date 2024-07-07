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
                        env.PATH = "${env.PATH}:/home/ameni/.nvm/versions/node/v20.15.0/bin" 
                        sh 'npm install' // لازم  تكون  في  نفس  الـ  indentation  متاع  السطر  اللي  قبلها
                        sh 'npm run build' // لازم  تكون  في  نفس  الـ  indentation  متاع  السطر  اللي  قبلها
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
                // نستعملو  sshPublisher  باش  نبعثو  الملفات  للـ  server
                sshPublisher(
                    publishers: [
                        sshPublisherDesc(
                            configName: 'YOUR_SSH_SERVER_CONFIG', //  غيّر  هذي  بإسم  الـ  configuration  متاع  الـ  server  متاعك
                            transfers: [
                                sshTransfer(
                                    sourceFiles: "${BACKEND_DIR}/bin/Debug/net8.0/*", //  غيّر  هذي  إن  كان  الـ  path  متاع  الـ  build  artifacts  مختلف
                                    removePrefix: "${BACKEND_DIR}/bin/Debug/net8.0/", 
                                    remoteDirectory: "/home/${SERVER_USER}/${PROJECT_DIR}/${BACKEND_DIR}", 
                                    execCommand: """
                                        dotnet restore
                                        dotnet build
                                        pm2 restart projettt || pm2 start node --name projettt -- start
                                    """
                                )
                            ]
                        )
                    ]
                )
            }
        }
    }
}
