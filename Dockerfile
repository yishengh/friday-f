# 使用 Node.js 14 的基础镜像
FROM node:14-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 到容器内
COPY package*.json ./


# 安装项目依赖
RUN npm install

# 复制整个项目目录到容器内
COPY . .

# 构建前端应用
RUN npm run build

# 使用 nginx 作为 Web 服务器来托管前端应用
FROM nginx:alpine

# 删除默认的 Nginx 静态文件
RUN rm -rf /usr/share/nginx/html/*

# 从第一个阶段复制构建好的前端文件到 Nginx 的默认静态文件目录
COPY --from=0 /app/build /usr/share/nginx/html

# 暴露 nginx 使用的端口（默认为 80）
EXPOSE 8000

# nginx 容器会在启动时自动运行，无需额外的 CMD 指令
