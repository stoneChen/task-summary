var YAML = require('yamljs');
var jade = require('jade');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var LOCAL_DAYS = ['日','一','二','三','四','五','六'];
var INCIDENT_FILE_NAME = '_incidents.yml';

var sumPath = process.argv[2];
if(!fs.existsSync(sumPath)){
    log(sumPath,'does not exist!');
    return;
}
if(!fs.statSync(sumPath).isDirectory()){
    log(sumPath,'is not a directory!');
    return;
}
var incidents = {};
var incidentPath = path.join(sumPath, INCIDENT_FILE_NAME);
if(!fs.existsSync(incidentPath)){
    log('No incidents this month');
}else{
    incidents = YAML.load(incidentPath);
}

//遍历yml数据
var members = getMemberList(sumPath);

//获取当月天数
var tasksData = {
    year: sumPath.substr(0,4),
    month: sumPath.substr(4),
    members:members
};
var dayCount = getDayCount(tasksData.year, tasksData.month);
var rowList = getRowList(dayCount, tasksData);
var resultData = {
    year:  tasksData.year,
    month: tasksData.month,
    rowList: rowList
};
writeMD();
fs.readFile('./sum.jade', function (err, tpl) {
    var fn = jade.compile(tpl, {pretty: true});
    var html = fn(resultData);
    var fileNameHTML = path.join(sumPath, '_SUM_.html');
    fs.writeFile(fileNameHTML, html, function (err) {
        if (err) throw err;
        log(fileNameHTML + ' created');
    });
});



function writeMD(){
    var fileNameMD = path.join(sumPath, '_SUM_.md');
    var md = getMDContent(resultData);
    fs.writeFile(fileNameMD, md, function (err) {
        if (err) throw err;
        log(fileNameMD + ' created');
    });
}

function getMDContent(resultData){
    var MD_HEADER_TPL = '# 爱客仕前端组 <%= year %>年<%= month %>月 工作汇总\n';
    var md = _.template(MD_HEADER_TPL)(resultData);
    resultData.rowList.forEach(function (cols, idx) {
        md += '|' + cols.join('|') + '|\n';
        if(idx === 0){//第二行要加横杠，才能成为表格
            md += _.repeat('|---', cols.length) + '|\n';
        }
    });
    md = _.escape(md);
    return md;
}






























function getMemberList(sumPath){
    var members = [];
    var fileList = fs.readdirSync(sumPath);
    fileList.forEach(function (file) {
        var filePath = path.join(sumPath, file);
        if(!/\.yml$/.test(filePath)){
            log(filePath, 'is not a yml file, passed.');
            return;
        }
        if(INCIDENT_FILE_NAME === file){
            log('_incidents file passed');
            return;
        }
        var member = YAML.load(filePath);
        members.push(member);
    });
    return members;
}

function getDayCount(year, month){
    var dateStr = [year, month].join('-');
    var day = new Date(dateStr);//本月第一天
    var lastDay = getLastDayOfMonth(day.getFullYear(), day.getMonth());//本月最后一天;
    return lastDay.getDate();
}

function getLastDayOfMonth(year,month){
    return new Date(new Date(year,month + 1,1) - 1)
}

function getRowList(dayCount, tasksData){
    var rowList = [];
    var members = tasksData.members;
    rowList.push(getHeader(members));
    for(var i = 1; i <= dayCount; i++){
        var str = [tasksData.year, tasksData.month, i].join('-');
        var curDay = new Date(str);
        var colList = [i, LOCAL_DAYS[curDay.getDay()], incidents[i]];//添加事件节点
        members.forEach(function (m) {
            var tasks = m.tasks;
            colList.push(tasks[i]);
        });
        rowList.push(colList);
    }
    return rowList;
}

function getHeader(members){
    var headerList = ['Date', 'Week', 'Incident'];
    members.forEach(function (m) {
        headerList.push(m.name);
    });
    return headerList;
}


function getHTMLBody(html){
    var tail = html.split('</head>')[1],
        body = tail.split('</html>')[0];
    return body;
}





function log(){
    var args = [].slice.call(arguments);
    console.log.apply(console, args);
}



