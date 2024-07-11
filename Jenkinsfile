pipeline {
    agent any

    environment {
        FRONTEND_DIR = 'ui2/todo'
        BACKEND_DIR = 'api/WebApplication1'
        PROJECT_DIR = 'projettt/stage2'
        NPM_CONFIG_CACHE = "<span class="math-inline">\{WORKSPACE\}/\.npm\-cache"
\}
stages \{
stage\('Checkout'\) \{
steps \{
git branch\: 'main', url\: 'git@github\.com\:amenid/stage2\.git'
\}
\}
stage\('Build Front'\) \{
steps \{
withCredentials\(\[usernamePassword\(credentialsId\: '9c70db8f\-05ef\-41bd\-af2b\-d3748e3ceddb', usernameVariable\: 'USERNAME', passwordVariable\: 'PASSWORD'\)\]\) \{
script \{
dir\("</span>{WORKSPACE}/${FRONTEND_DIR}") {
                            if (!fileExists('node_modules')) {
                                sh 'npm install'
                            } else {
                                echo 'npm install as node_modules directory already exists.'
                            }
                            sh 'npm run build'
                        }
                    }
                }

                // Move catchError block inside steps
                catchError {
                    echo "An error occurred in stage 'Build Front': <span class="math-inline">\{error\.message\}"
// Perform any additional error handling tasks \(logging, notifications, etc\.\)
\}
\}
\}
stage\('Deploy Front'\) \{
steps \{
script \{
dir\("</span>{WORKSPACE}/${FRONTEND_DIR}") {
                        // Install serve locally within the project directory (optional)
                        // sh 'npm install serve'

                        // Use the full path to npx if npx is not available globally
                        sh '/home/ameni/.nvm/versions/node/v20.15.0/bin/npx serve --host 0.0.0.0 --port 4200 &'
                        sleep 10
                        sh 'curl -I http://localhost:4200 || { echo "Server did not start"; exit 1; }'
                    }
                }

                // Move catchError block inside steps
                catchError {
                    echo "An error occurred in stage 'Deploy Front': <span class="math-inline">\{error\.message\}"
// Perform any additional error handling tasks \(logging, notifications, etc\.\)
\}
\}
\}
stage\('Build Back'\) \{
steps \{
withCredentials\(\[usernamePassword\(credentialsId\: '9c70db8f\-05ef\-41bd\-af2b\-d3748e3ceddb', usernameVariable\: 'USERNAME', passwordVariable\: 'PASSWORD'\)\]\) \{
script \{
dir\("</span>{WORKSPACE}/${BACKEND_DIR}") {
                            sh 'dotnet build WebApplication1.sln'
                        }
                    }
                }

                // Move catchError block inside steps
                catchError {
                    echo "An error occurred in stage 'Build Back': <span class="math-inline">\{error\.message\}"
// Perform any additional error handling tasks \(logging, notifications, etc\.\)
\}
\}
\}
stage\('Deploy Backend'\) \{
steps \{
script \{
dir\("</span>{WORKSPACE}/${BACKEND_DIR}") {
                        sh '''
                            if ! command -v pm2 > /dev/null 2>&1; then
                                npm install pm2 -g
                            fi
                            dotnet restore
                            pm2 describe projettt > /dev/null 2>&1 && pm2 restart projettt --update-env || pm2 start node --name projettt -- start
                        '''
                    }
                }

                // Move catchError block inside steps
                catchError {
                    echo "An error occurred in stage 'Deploy Backend': ${error.message}"
                    // Perform any additional error handling tasks (logging, notifications, etc.)
                }
            }
        }
    }

    post {
        failure {
            mail to: 'ameniaydiii@gmail.com',  // Replace with actual recipient email address
                 subject: 'Jenkins Stage Failed: <span class="math-inline">\{currentBuild\.fullDisplayName\}',
body\: """
Stage '</span>{currentBuild.stageName}' failed with message: ${error.message}

Build URL: ${currentBuild.absoluteUrl}

Additional details:

* Console log: ${currentBuild.rawBuildConsoleLog}
* Error stacktrace: ${error.stackTrace}
                 """
        }
    }
}
