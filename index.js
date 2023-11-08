const axios = require('axios');
const fs = require('fs');

// 从系统环境变量中读取icode参数
const icode = process.env.ICODE;

// 定义下载文件的目录
const downloadDir = './downloads/';

// 生成URL数组
const urls = [];
for (let i = 1; i <= 32; i++) {
  const url = `https://apis.imooc.com/new/${String(i).padStart(2, '0')}.zip?icode=${icode}`;
  urls.push(url);
}

// 遍历URL数组，并发起下载请求
urls.forEach((url, index) => {
  axios({
    method: 'GET',
    url: url,
    responseType: 'stream'
  })
  .then(response => {
    const fileName = `file${index + 1}.zip`;
    const filePath = downloadDir + fileName;

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on('finish', () => {
      console.log(`File ${fileName} downloaded successfully!`);
    });

    writer.on('error', (error) => {
      console.error(`Error while downloading file ${fileName}: ${error}`);
    });
  })
  .catch(error => {
    console.error(`Error while downloading file: ${error}`);
  });
});