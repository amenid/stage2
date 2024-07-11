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
                withCredentials([usernamePassword(credentialsId: '9c70db8f-05ef-41bd-af2b-d3748e3ceddb', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    script {
                        dir("${WORKSPACE}/${FRONTEND_DIR}") {
                            if (!fileExists('node_modules')) {
                                sh 'npm install'
                            } else {
                                echo 'npm install as node_modules directory already exists.'
                            }
                            sh 'npm run build'
                        }
                    }
                }
            }
        }
        stage('Install Angular CLI') {
    steps {
        script {
            sh 'npm install -g @angular/cli'
        }
    }
}


        stage('Deploy Front') {
    steps {
        withCredentials([usernamePassword(credentialsId: '9c70db8f-05ef-41bd-af2b-d3748e3ceddb', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
            script {
                dir("${WORKSPACE}/${FRONTEND_DIR}") {
                    // Installer Angular CLI si ce n'est pas déjà fait
                    def angularInstalled = sh(script: 'if [ -x "$(command -v ng)" ]; then echo "yes"; else echo "no"; fi', returnStdout: true).trim()
                    if (angularInstalled == "no") {
                        sh 'npm install -g @angular/cli'
                    }

                    // Exécuter ng serve
                    sh 'ng serve --host 0.0.0.0 --port 4200 &'
                    sleep 30  // Attendez suffisamment de temps pour que ng serve démarre

                    // Vérifier si le serveur est accessible
                    sh 'curl -I http://localhost:4200 || { echo "Server did not start"; exit 1; }'
                }
            }
        }
    }
}


        stage('Build Back') {
            steps {
                withCredentials([usernamePassword(credentialsId: '9c70db8f-05ef-41bd-af2b-d3748e3ceddb', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
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
                withCredentials([usernamePassword(credentialsId: '9c70db8f-05ef-41bd-af2b-d3748e3ceddb', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    script {
                        dir("${WORKSPACE}/${BACKEND_DIR}") {
                            sh """
                                if ! command -v pm2 > /dev/null 2>&1; then
                                    sudo npm install pm2 -g
                                fi
                                dotnet restore
                                pm2 describe projettt > /dev/null 2>&1 && pm2 restart projettt --update-env || pm2 start node --name projettt -- start
                            """
                        }
                    }
                }
            }
        }
    }
}
