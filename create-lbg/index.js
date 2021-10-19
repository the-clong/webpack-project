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
    lightBlue
} = require("kolorist");

let targetDir = argv._[0];
const templateArg = argv.tpl || argv.t;
const defaultProjectName = targetDir || 'lbg-fe-project';
console.log('dir------', defaultProjectName);
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
            default: (answers) => {
                targetDir = answers.projectName || defaultProjectName;
                return targetDir;
            },
        },
        {
            type: 'confirm',
            name: 'overwrite',
            when: () => {
               return fs.existsSync(targetDir);
            },
            message: (answers) => {
                const { projectName } = answers;

                return projectName !== '.' ? `使用${projectName}作为项目路径，将替换目录下所有文件，是否继续？` : '当前文件夹创建？'
            },
        },
        {
            name: "template",
            type: "list",
            when: (answers) => {
                if(answers.hasOwnProperty('overwrite')) {
                    if(!answers.overwrite) {
                        console.log(red('✖') + ' Operation cancelled');
                        process.exit();
                    }
                }
                // 没有tpl参数让用户选择，如果有但是用户选的不对，也需要让他自己选
                if(!templateArg) {
                    return true;
                } else {
                    console.log(blue('info') + ' 当前模板不存在，请重新选择');
                    return !frameWorkArr.includes(templateArg);
                }         
            },
            message: "选择模板",
            choices: FRAMEWORKS.map((item) => {
                return {
                    value: item.color(item.value)
                };
            }),
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
        let templateDir = '';
        if(templateArr.length > 0) {
            templateDir = path.join(__dirname, `template-${templateArr[0].value}`)
        }
        switch(entryType.replace(/[\u0000-\u0019]/g, '')) {
            case "✔ 单页":
                throw new Error('fdsfds');
            case "✔ 多页": 
        }
        const spinner = ora({spinner: {
            interval: 80, // Optional
            frames: ["🕛 ",
			"🕐 ",
			"🕑 ",
			"🕒 ",
			"🕓 ",
			"🕔 ",
			"🕕 ",
			"🕖 ",
			"🕗 ",
			"🕘 ",
			"🕙 ",
			"🕚 "],
        },text: lightBlue('下载中模板中')});
        spinner.start();
        // 用户选择覆盖将文件夹清空，没有覆盖创建新文件夹准备写入文件
        const root = path.join(cwd, projectName); // 取当前文件夹拼接
        if (overwrite) {
            delDir(root);
        } else if (!fs.existsSync(root)) {
            fs.mkdirSync(root);
        }
        // 写模板文件
        const files = templateDir ? fs.readdirSync(templateDir) : [];
        const writeByContent = (root, file, content) => {
            const targetPath = path.join(root, file);
            // 有content代表写入内容
            if(content) {
                fs.writeFileSync(targetPath, content);
            } else {
            // 没有直接copyfile
                copyFile(path.join(templateDir, file), targetPath);
            }
        };
        if(files.length > 0) {
            for (const file of files.filter((f) => f !== 'package.json')) {
                writeByContent(root, file);
            }
            spinner.succeed('Done，运行以下命令开发!');
            if (root !== cwd) {
                console.log(`\n cd ${path.relative(cwd, root)} \n`);
            }
        }
    }).catch((err) => {
        console.log('err-----', err);
        if (err.isTtyError) {
            // Prompt couldn't be rendered in the current environment
        } else {
            // Something else went wrong
        }
    });

} catch (cancelled) {
    console.log(cancelled.message);
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
    // 如果文件信息存在
   const stat = fs.statSync(src);
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
    if(fs.existsSync(targetDir)) {
        // 获取是否有子目录
        return fs.readdirSync(curPath).length === 0;
    } else {
        return false;
    }
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
