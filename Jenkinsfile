
pipeline {

  agent any
  
  environment {
    DOCKERHUB_USERNAME = "frandpradas"
    ORGANIZATION_NAME = "task-manager"
    SERVICE_NAME = "task-manager-backend"
    REPOSITORY_TAG = "${DOCKERHUB_USERNAME}/${ORGANIZATION_NAME}:${SERVICE_NAME}"
  }

  stages {
    stage("Install dependencies") {
      steps {
        script {
          sh "npm install"
        }   
      }
    }
      
    // stage("Unit Test") {
    //   steps {
    //     script {
    //       sh "npm test"
    //     }
    //   }
    // }
      
    stage("Build") {
      steps {
        sh "docker build -t ${REPOSITORY_TAG} ."
      }
    }

    stage("Push") {
      steps {
        withDockerRegistry([ credentialsId: "b95bb1a3-6c72-4db4-af52-87119c37fcc8", url: "" ]) {
          sh "docker push ${REPOSITORY_TAG}"
        }
      }
    }

    stage("Deploy") {
      steps {
        sh "kubectl rollout restart deployment ${SERVICE_NAME}"
      }
    }
  }
}