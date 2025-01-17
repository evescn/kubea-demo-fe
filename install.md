# kubea-fe

> `k8s` + `cicd` + 内网 `url` 导航 前端

## 1. 服务镜像打包

### 克隆代码

```shell
$ git clone https://github.com/evescn/kubea-fe.git
$ cd kubea-fe
$ git checkout master
```

### 打包镜像

> 方法1 打包 Docker 镜像

```shell
# 打包服务
$ rm ./dist -rf
$ npm run build

# 打包 Docker 镜像
$ docker build -t harbor.xxx.cn/devops/kubea-fe:v1.1 -f Dockerfile .
$ docker push harbor.xxx.cn/devops/kubea-fe:v1.1
```

> 方法2 打包 Docker 镜像

```shell
$ chmod a+x ./build
$ ./build 1 dev # 版本号信息 环境
```

## 2. 服务部署

### a | Docker 启动

```shell
$ docker run -d \
  --restart=always \
  --name kubea-fe \
  -p 80:80 \
  harbor.xxx.cn/devops/kubea-fe:v1.1
```

### b | Kubernetes 启动

```yaml
# k8s.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kubea-fe
  namespace: devops
spec:
  replicas: 1
  selector:
    matchLabels:
      app: kubea-fe
  template:
    metadata:
      labels:
        app: kubea-fe
    spec:
      containers:
      - name: kubea-fe
        image: harbor.xxx.cn/devops/kubea-fe_fe:v1.0
        imagePullPolicy: Always
        ports:
        - containerPort: 80

---
# service
apiVersion: v1
kind: Service
metadata:
  name: kubea-fe
  namespace: devops
spec:
  ports:
  - port: 80
    protocol: TCP
    targetPort: 80
    nodePort: 20080
  selector:
    app: kubea-fe
  type: NodePort

---
# ingress
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: kubea
  namespace: devops
spec:
  ingressClassName: nginx
  rules:
  - host: kubea.evescn.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: kubea-fe
            port:
              number: 80
```

```shell
$ kubectl apply -f k8s.yaml
```

## 3. 服务访问

> 项目前后端分离，需要部署后端后才能访问
> [后端地址](https://github.com/evescn/kubea)
