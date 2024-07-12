pipeline {
  agent any

  environment {
    FRONTEND_DIR = 'ui2/todo'
    BACKEND_DIR = 'api/WebApplication1'
    PROJECT_DIR = 'projettt/stage2'
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
      def buildDir = "${WORKSPACE}/${FRONTEND_DIR}/dist"
      def deployDir = sh 'ssh -i ~/.ssh/id_rsa -p 4200 ameni@192.168.45.138 "cat \$DEPLOY_DIR"'

      sh "scp -r ${buildDir}/* -P 4200 ameni@192.168.45.138:${deployDir}"
    }
  }
}



    stage('Build Back') {
      steps {
        withCredentials([usernamePassword(credentialsId: '9c70db8f-05ef-41bd-af2b-d3748e3ceddb', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
          script {
            dir("${WORKSPACE}/${BACKEND_DIR}") {
              sh 'dotnet build WebApplication1.sln' // Replace with your build command
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
                            sh '''
                            if ! command -v pm2 > /dev/null 2>&1; then
                            npm install pm2 -g
                            fi
                            dotnet restore

                            APP_NAME="${env.APP_NAME ?: 'projettt'}"  # Use environment variable for app name

                            if pm2 describe $APP_NAME > /dev/null 2>&1; then
                            pm2 restart $APP_NAME --update-env
                            else
                            pm2 start node --name $APP_NAME -- start
                            fi
                            '''

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
        mail to: 'ameniaydiii@gmail.com', // Replace with actual recipient email address
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
