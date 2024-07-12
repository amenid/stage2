pipeline {
  agent any

  environment {
    FRONTEND_DIR = 'ui2/todo'
    BACKEND_DIR = 'api/WebApplication1'
    NPM_CONFIG_CACHE = "${WORKSPACE}/.npm-cache"
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
        catchError {
          echo "An error occurred in stage 'Build Front': ${error.message}"
        }
      }
    }

    stage('Deploy Front') {
      steps {
        script {
          dir("${WORKSPACE}/${FRONTEND_DIR}") { 
            sh 'ng serve --host 0.0.0.0 --port 4200 &'
          }
        }
        catchError {
          echo "An error occurred in stage 'Deploy Front': ${error.message}"
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
        catchError {
          echo "An error occurred in stage 'Build Back': ${error.message}"
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
        catchError {
          echo "An error occurred in stage 'Deploy Backend': ${error.message}"
        }
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
