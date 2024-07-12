pipeline {
  agent any

  environment {
    FRONTEND_DIR = 'ui2/todo'
    BACKEND_DIR = 'api/WebApplication1'
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
                echo 'npm install skipped as node_modules directory already exists.'
              }
              sh 'npm run build'
            }
          }
        }
      }
    }

    stage('Deploy Front') {
      steps {
        dir("${WORKSPACE}/${FRONTEND_DIR}") { 
          sh 'ng serve --host 0.0.0.0 --port 4200 &'
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
                script {
                    def pm2Path = '/home/ameni/.nvm/versions/node/v20.15.0/bin/pm2'

                    sh "${pm2Path} --version"

                    sh """
                    if ! command -v pm2 > /dev/null 2>&1; then
                        npm uninstall pm2 -g || true
                        npm install pm2 -g --unsafe-perm
                    fi
                    """
                    sh """
                    pm2 describe proj > /dev/null 2>&1 && pm2 restart proj --update-env || pm2 start node --name proj -- start
                    """
                }
            }
        }

  post {
    failure {
      mail to: 'ameniaydiii@gmail.com',
           subject: "Jenkins Stage Failed: ${currentBuild.fullDisplayName}",
           body: """
           Stage '${currentBuild.stageName}' failed with message: ${error.message}

           Build URL: ${currentBuild.absoluteUrl}

           Additional details:
           * Console log: ${currentBuild.rawBuildConsoleLog}
           * Error stacktrace: ${error.stackTrace}
           """
    }
  }
}
}