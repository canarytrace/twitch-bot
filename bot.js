const tmi = require('tmi.js');
const k8s = require('@kubernetes/client-node');

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME
  ]
};

// k8s
const kc = new k8s.KubeConfig();
kc.loadFromFile('/Users/rdpanek/Downloads/but-kubeconfig.yaml');

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const appsV1Api = kc.makeApiClient(k8s.AppsV1Api);

let namespace = {
  metadata: {
      name: 'canarytrace',
  },
};

/*
k8sApi.createNamespace(namespace).then(
  (response) => {
    console.log('Created namespace');
    console.log(response);
    // vypsani namespaces
    //k8sApi.readNamespace(namespace.metadata.name).then((response) => {
      //console.log(response);
      // odstraneni namespace
      //k8sApi.deleteNamespace(namespace.metadata.name, {});
    //});
  },
    (err) => {
    console.log('Vytvorit namespace se nezdarilo: ' + err);
  },
);
*/

// list pods
k8sApi.listNamespacedPod(namespace.metadata.name).then((res) => {
  console.log(res.body);
});

const CanaryDeployment = {
  "apiVersion": "apps/v1",
  "kind": "Deployment",
  "metadata": {
    "name": "canarytrace",
    "labels": {
      "app": "canarytrace"
    }
  },
  "spec": {
    "replicas": 1,
    "selector": {
      "matchLabels": {
        "app": "canarytrace"
      }
    },
    "template": {
      "metadata": {
        "labels": {
          "app": "canarytrace"
        }
      },
      "spec": {
        "containers": [
          {
            "name": "canary",
            "image": "quay.io/canarytrace/smoke-pro:3.0.1",
            "env": [
              {
                "name": "BASE_URL",
                "value": "https://www.tesla.com/;http://canarytrace.com/"
              },
              {
                "name": "SMOKE",
                "value": "allow"
              },
              {
                "name": "ELASTIC_CLUSTER",
                "value": "https://XXX.europe-west3.gcp.cloud.es.io:9243"
              },
              {
                "name": "ELASTIC_HTTP_AUTH",
                "value": "elastic:XXX"
              },
              {
                "name": "AT_DRIVER_HOST_NAME",
                "value": "localhost"
              },
              {
                "name": "PT_AUDIT",
                "value": "allow"
              },
              {
                "name": "PT_AUDIT_THROTTLING",
                "value": "desktopDense4G"
              }
            ],
            "resources": {
              "requests": {
                "memory": "300Mi",
                "cpu": "200m"
              },
              "limits": {
                "memory": "400Mi",
                "cpu": "300m"
              }
            },
            "imagePullPolicy": "IfNotPresent"
          },
          {
            "name": "selenium",
            "image": "selenium/standalone-chrome:3.141.59-20200730",
            "ports": [
              {
                "containerPort": 4444
              }
            ],
            "resources": {
              "requests": {
                "memory": "4000Mi",
                "cpu": "2000m"
              },
              "limits": {
                "memory": "6000Mi",
                "cpu": "4000m"
              }
            },
            "imagePullPolicy": "IfNotPresent",
            "volumeMounts": [
              {
                "mountPath": "/dev/shm",
                "name": "dshm"
              }
            ],
            "livenessProbe": {
              "httpGet": {
                "path": "/wd/hub",
                "port": 4444
              },
              "initialDelaySeconds": 10,
              "timeoutSeconds": 5
            },
            "readinessProbe": {
              "httpGet": {
                "path": "/wd/hub",
                "port": 4444
              },
              "initialDelaySeconds": 10,
              "timeoutSeconds": 5
            }
          }
        ],
        "restartPolicy": "Always",
        "volumes": [
          {
            "name": "dshm",
            "emptyDir": {
              "medium": "Memory"
            }
          }
        ]
      }
    }
  }
}

appsV1Api.createNamespacedDeployment(namespace.metadata.name, CanaryDeployment).then((res) => {
  console.log(res.body)
})

// get deployment list
appsV1Api.listNamespacedDeployment(namespace.metadata.name).then((res) => {
  console.log(res.body)
})

// list deployments
//let deploymentsRes = await k8sApi.listNamespacedDeployment(namespace.metadata.name);
/*
k8sApi.create('/Users/rdpanek/htdocs/canary/canarytrace/tests/k8s/tesla-smoke.yaml').then((res) => {
  console.log(res.body);
});
*/
// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  
  // Ignore messages from the bot
  if(self || !msg.startsWith('!')) return;

  // Exist some badge?
  let subscriber = false
  if (context['badge-info'] !== null) {
    subscriber = true;
  }
  
  console.log(JSON.stringify(self, null, 2))
  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  if (commandName === '!canarybot') {
    client.say(target, `rdpaneCANARY Hello ${context['display-name']} ${subscriber? 'a ma Sub!': 'Nemas subscribe'}`);
    console.log(`* Executed ${commandName} command`);
  } 
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
