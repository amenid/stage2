pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Clone the repository
                git branch: 'master', url: 'git@github.com:amenid/stage.git'
            }
        }
        stage('Build') {
            steps {
                script {
                    // Build .NET Core
                    dir('api/WebApplication1/WebApplication1') {
                        sh 'dotnet restore'  // Restaurer les packages NuGet si nécessaire
                        sh 'dotnet build'    // Construire le projet
                    }
                }
            }
        }
        stage('Test') {
            steps {
                script {
                    // Test .NET Core
                    dir('backend/WebApplication1/WebApplication1') {
                        sh 'dotnet test'     // Exécuter les tests unitaires
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                echo 'Nothing to do here yet!'  // Placeholder for deployment steps
            }
        }
    }
}
