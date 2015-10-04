# 用于前端团队汇总每月工作  
[![Build Status](https://travis-ci.org/stoneChen/task-summary.svg)](https://travis-ci.org/stoneChen/task-summary)  
## 如何运作  

每个团队成员在相应目录下，提交自己的task数据文件(yml格式)即可。  
比如，要汇总2015年9月的工作，团队成员有张三和李四。张三要在201507目录下提交自己的数据文件：  
zs.yml:

```yml
name: '张三'
tasks:
  1: 'css'
  2: 'js'
  3: 'html'
```
tasks下的1，2，3为当月的日期，冒号后为当日的工作内容或请假等内容  
即：  
{日期}:{当天工作内容}  
  
李四也要在201509目录下提交自己的数据文件：  
ls.yml:  

```yml
name: '李四'
tasks:
  1: 'Angular'
  2: 'React'
  3: 'Ember'
  6: 'Bootstrap'
  8: '请假'
```

_incidents.yml为特殊节点日期的数据，格式与tasks列表一致,即：  


```yml
1:  'outing'
5:  '加班'
16: '发布'
30: '内测'
```

## 生成汇总html和markdown
**考虑到 github 或 gitlab 无法直接预览 html，所以顺便生成了 markdown。 html 主要用于在本地查看，markdown 用于在 github 或 gitlab 上查看。**
  
首次使用，请安装依赖：  
```bash
npm install
```

每个成员都上传完自己的数据文件后，将所有数据文件pull下来，在根目录下执行  
```bash
node sum {年月} 
```
比如，要汇总2015年07月的团队工作任务，执行：  
```bash
node sum 201507
```
node将在201507目录下生成\_SUM\_.html 和 \_SUM\_.md，里面是一个表格，日期和星期都将自动计算。

如果你想一次性生成汇总html，并立即看到效果，就执行：
```bash
node sum 201507 && open 201507/_SUM_.html
```



