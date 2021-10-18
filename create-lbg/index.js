#!/usr/bin/env node

// 交互式命令行
const inquirer = require("inquirer");
const path = require('path');
// nodejs读写package.json
const fs = require("fs");
//loading模块
const ora = require('ora');
// 可以指定两个参数，项目名和templateName( lbg-project --tpl)
const argv = require('minimist')(process.argv.slice(2), { string: ['_'] });
const cwd = process.cwd(); // 当前index.js所在目录
const {
    yellow,
    green,
    cyan,
    blue,
    magenta,
    lightRed,
    red,
} = require("kolorist");

const targetDir = argv._[0];
const templateArg = argv.tpl || argv.t;
const defaultProjectName = targetDir || 'lbg-fe-project';
// 模板配置
const FRAMEWORKS = [
    {
        value: 'pc',
        color: green
    },
    {
        value: 'h5',
        color: yellow
    },
];
const frameWorkArr = FRAMEWORKS.map((ite) => (ite.name));
try {
    const TEMPLATES = [
        // 确认项目名称
        {
            type: "input",
            name: "projectName",
            message: "项目名称",
            default: defaultProjectName,
        },
        {
            type: 'confirm',
            name: 'overwrite',
            when: fs.existsSync(targetDir) || !isEmpty(targetDir),
            message: targetDir !== '.' ? `使用${targetDir}作为项目路径，将替换目录下所有文件，是否继续？` : '当前文件夹创建？'
        },
        {
            name: "template",
            type: "list",
            when: templateArg && frameWorkArr.includes(templateArg),
            message: "选择模板",
            choices: [
                {
                    value: green('pc')
                },
                {
                    value: yellow('h5')
                }
            ],
        },
        {
            name: "entryType",
            type: "list",
            message: "选择入口",
            choices: [
                {
                    value: cyan("✔ 单页"),
                },
                {
                    value: blue("✔ 多页"),
                },
            ],
        },
    ];

    inquirer.prompt(TEMPLATES).then((answers) => {
        const { projectName, template, entryType, overwrite } = answers;
        const templateArr = FRAMEWORKS.filter((item) => template.indexOf(item.value) > -1);
        let templateURL = '';
        if(templateArr.length > 0) {
            templateURL = path.join(__dirname, `template-${templateArr[0].value}`)
        }
        // switch(entryType.replace(/[\u0000-\u0019]/g, '')) {
        //     case "✔ 单页":
        //     case "✔ 多页": 
        // }
        // const spinner = ora('Downloading template... \n');
        // spinner.start();
        // console.log(Printer.default.fromString(input));

        // 用户选择覆盖将文件夹清空，没有覆盖创建新文件夹准备写入文件
        const root = path.join(cwd, projectName); // 取当前文件夹拼接
        if (overwrite) {
            delDir(root);
        } else if (!fs.existsSync(root)) {
            fs.mkdirSync(root);
        }
        // 写模板文件
        const files = templateURL ? fs.readdirSync(templateURL) : [];
        const writeByContent = (root, file, content) => {
            const targetPath = path.join(root, file);
            // 有content代表写入内容
            if(content) {
                fs.writeFileSync(targetPath, content);
            } else {
            // 没有直接copyfile
                copyFile(templateURL, targetPath);
            }
        };
        if(files.length > 0) {
            for (const file of files.filter((f) => f !== 'package.json')) {
                writeByContent(root, file);
            }
        }
        // spinner.stop();
        // 写package.json文件
        // 写webpack.config.js，区分单页和多页
    }).catch((err) => {
        if (err.isTtyError) {
            // Prompt couldn't be rendered in the current environment
        } else {
        // Something else went wrong
        }
    });

} catch (cancelled) {
    console.log(cancelled.message)
    return
}

function copyDir(srcDir, destDir) {
    fs.mkdirSync(destDir, { recursive: true });
    for (const file of fs.readdirSync(srcDir)) {
        const srcFile = path.resolve(srcDir, file);
        const destFile = path.resolve(destDir, file);
        copyFile(srcFile, destFile);
    }
}

function copyFile(src, dest) {
    console.log('src, dest-----', src, dest);
    // 如果文件信息存在
   const stat = fs.statSync(src);
   console.log('isDirect-----',stat.isDirectory());
   if(stat.isDirectory()) {
      copyDir(src, dest);
   } else {
       fs.copyFileSync(src, dest);
   }
}


function isEmpty(curPath) {
    if(!curPath) {
        return true;
    }
    // 获取是否有子目录
    return fs.readdirSync(curPath).length === 0
}


function delDir(dir) {
    let files = [];
    if(!fs.existsSync(dir)) {
       return;
    } else {
       files = fs.readdirSync(dir);
       // 层层删除
       files.forEach((file, index) => {
           let curPath = dir + "/" + file;
           if(fs.statSync(curPath).isDirectory()) { // 读取文件信息判断是否是文件夹
             delDir(curPath); // 递归删除
           } else {
             fs.unlinkSync(curPath); // 删除文件
           }
       });
    }
}
