#!/bin/bash

if [ -d "ci-build" ]; then
	rm -rf ./ci-build
fi
mkdir -p ci-build
cd ci-build
mkdir -p ./website/zh/docs/version
mkdir -p ./website/en/docs/version
cp -rf ../content/zh/* ./website/zh/docs/version
cp -rf ../content/en/* ./website/en/docs/version
if [ -d "../content/docs-lite" ]; then
    mkdir -p ./website/zh/docs/version-lite
    mkdir -p ./website/en/docs/version-lite
    cp -rf ../content/docs-lite/zh/* ./website/zh/docs/version-lite
    cp -rf ../content/docs-lite/en/* ./website/en/docs/version-lite
fi
cp -r ../website-v2/* .
rm -rf ../website-v2
rm -rf ./content
mv ./website ./content
# 生成停维(EOM)数据；失败时告警并沿用仓库内已提交的兜底文件，不中断构建
bash scripts/gen-eol-versions.sh || echo "WARN: gen-eol-versions.sh failed, use committed EOL data"
hugo -D
