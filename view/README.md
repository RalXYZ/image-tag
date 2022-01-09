# 图像标注网站前端

## 技术选型

React + TypeScript + Gatsby + MUI

## 运行与部署

### 前端运行

请直接在前端项目的根目录下执行：

```shell
npm install
npm run develop
```

### 部署到服务器

除了前端运行部分，其余部分的配置都相同。而对于前端而言，如果您需要将其部署在服务器上，您需要在前端项目的根目录下执行：

```shell
npm install
gatsby build  # 把 nodjs 项目编译为静态文件
```

您会发现，前端目录下多出了一个 `public` 目录。

随后，您需要配置反向代理。以下我将展示一个能实现此需求的 Nginx 配置文件：

```nginx
server {
    root /path/to/front-end/static/files;  # 请在这里填写刚刚前端编译出的静态文件所在的目录

    server_name example.com;  # 请在这里换成您的域名；需要保证域名解析到了这台服务器上

    location /api {
        proxy_pass http://localhost:1323/api;  # 代理后端流量，无需更改此行
    }

    location / {
        try_files $uri $uri/ =404;  # 暴露前端静态文件，无需更改此行
    }

}
```
