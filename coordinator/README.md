# 图像标注网站后端

## 技术选型

golang (gin + gorm) + MySQL + MinIO

## 配置与运行

### 对象存储 (OSS) 配置

我使用了 MinIO 作为我的对象存储数据库。您需要从 MinIO 的官方网站上下载 MinIO 。就我而言，我下载的是 MinIO 的二进制文件，将其放进我的 `/usr/bin` 后，编写了一个 `systemd` 配置文件使得其能正常启动。这个配置文件的配置方法出现在了 MinIO 官网的教程中，这里也给出我这里的配置文件：

```shell
# /etc/systemd/system/minio.service
[Unit]
Description=MinIO
Documentation=https://docs.min.io
Wants=network-online.target
After=network-online.target
AssertFileIsExecutable=/usr/local/bin/minio

[Service]
WorkingDirectory=/usr/local

User=minio-user
Group=minio-user

EnvironmentFile=-/etc/default/minio
ExecStartPre=/bin/bash -c "if [ -z \"${MINIO_VOLUMES}\" ]; then echo \"Variable MINIO_VOLUMES not set in /etc/default/minio\"; exit 1; fi"
ExecStart=/usr/local/bin/minio server $MINIO_OPTS $MINIO_VOLUMES

# Let systemd restart this service always
Restart=always

# Specifies the maximum file descriptor number that can be opened by this process
LimitNOFILE=65536

# Specifies the maximum number of threads this process can create
TasksMax=infinity

# Disable timeout logic and wait until process is stopped
TimeoutStopSec=infinity
SendSIGKILL=no

[Install]
WantedBy=multi-user.target
```

随后，您会发现，MinIO 暴露了一个可以通过浏览器访问的端口，用浏览器访问这个端口，输入默认的用户名和密码后，即可在它提供的控制台中添加用户、创建桶。**您需要完成添加用户和创建桶操作。**

### 关系型数据库 MySQL 配置

您需要在 MySQL 中手动添加一个数据库，再手动添加一个用户，并授予用户这个数据库的所有权限。

这样就行了，不需要任何建表脚本。这是由于 golang gorm 的特性，建表会在后端启动时自动完成。

### 后端运行

请您在我的后端应用所在的项目根目录下，添加一个名叫 `conf.yaml` 的文件。内容如下，请您进行更改：

```yaml
gin:
  port: ":3000"
  release: false
sql:
  username: img_annotation
  password: img_annotation
  db_name: img_annotation
token:
  secure: false
  http_only: false
  name: img_annotation
  issuer: img_annotation
  max_age: 3600
  secret_key: AllYourBase
  domain: "localhost:8000"
minio:
  enable: true
  endpoint: "127.0.0.1:9000"
  id: minioadmin
  secret: minioadmin
  secure: false
  bucket_name: img-tag
```
