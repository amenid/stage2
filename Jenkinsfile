pipeline {
  agent any

  environment {
    FRONTEND_DIR = 'ui2/todo'
    BACKEND_DIR = 'api/WebApplication1'
    PROJECT_DIR = 'proj/stage2'
    NPM_CONFIG_CACHE = "${WORKSPACE}/.npm-cache"
    APP_NAME = 'proj'
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
            def sudoPassword = credentials('sudoPassword')
            def portCheckOutput = sh(returnStatus: true, script: '''
            echo "Enter sudo password (it will not be shown):"
            read -s password
            echo
            sudo -S -u $sudoPassword.username netstat -atlpn | grep :4200
            ''')
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
                            sh '''
                            if ! command -v pm2 > /dev/null 2>&1; then
                            npm install pm2 -g
                            fi
                            dotnet restore

                            APP_NAME="${env.APP_NAME ?: 'proj'}"  

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
