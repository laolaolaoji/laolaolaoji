#!/bin/bash

hosts_and_ports=(
    # "120.26.197.198:22"
    "159.75.6.191:2023"
)

FILES_TO_ZIP=(
    "LICENSE"
    "README.md"
    "ads.txt"
    "css/"
    "favicon.ico"
    "index.html"
    "robots.txt"
)

# 定义输出 zip 文件的名称
OUTPUT_ZIP="laolaolaoji.zip"

# 检查是否已安装 zip 工具
if ! command -v zip &>/dev/null; then
    echo "zip 命令未找到，请安装 zip 工具 (如: sudo apt install zip)"
    exit 1
fi

# 创建 zip 文件
zip -r "$OUTPUT_ZIP" "${FILES_TO_ZIP[@]}" >/dev/null 2>&1

du -h $OUTPUT_ZIP

# 循遍历主机地址
# 遍历主机与端口
for host_port in "${hosts_and_ports[@]}"; do
    # 分离主机名与端口
    hostname=${host_port%%:*}
    port=${host_port##*:}

    echo "Processing hostname: $hostname on port: $port"

    ssh root@$hostname -p $port 'rm -rf /www/laolaolaoji && mkdir -p /www/laolaolaoji'

    # 上传压缩包到远程服务器
    scp -P $port $OUTPUT_ZIP root@$hostname:/www/laolaolaoji/

    # 远程解压并部署
    ssh root@$hostname -p $port 'source /etc/profile && \
    cd /www/laolaolaoji && \
    unzip laolaolaoji.zip && \
    rm -f laolaolaoji.zip'

    # 输出完成信息
    echo "Finished processing hostname: $hostname"
done

rm -rf laolaolaoji.zip