#!/bin/bash

# 确保脚本在错误时退出
set -e

# 颜色常量
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否已登录 npm
if ! npm whoami >/dev/null 2>&1; then
    echo -e "${RED}错误: 您还没有登录 npm${NC}"
    echo "请先运行: npm login"
    exit 1
fi

# 获取当前版本
current_version=$(node -p "require('./package.json').version")
echo -e "${GREEN}当前版本: ${current_version}${NC}"

# 提示选择版本类型
echo -e "${YELLOW}请选择要发布的版本类型:${NC}"
echo "1) patch (补丁版本: x.x.x -> x.x.x+1)"
echo "2) minor (次要版本: x.x.x -> x.x+1.0)"
echo "3) major (主要版本: x.x.x -> x+1.0.0)"
read -p "请输入选项 (1-3): " version_type

# 根据选择执行相应的发布命令
case $version_type in
    1)
        npm run prepublish && npm version patch && npm publish
        ;;
    2)
        npm run prepublish && npm version minor && npm publish
        ;;
    3)
        npm run prepublish && npm version major && npm publish
        ;;
    *)
        echo -e "${RED}无效的选项${NC}"
        exit 1
        ;;
esac

# 获取新版本
new_version=$(node -p "require('./package.json').version")
echo -e "${GREEN}发布成功! 新版本: ${new_version}${NC}"