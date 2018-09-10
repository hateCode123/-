// 冒泡排序：循环数组，把每一项拿出来跟它后面的每一项对比，
// 如果大于后面的一项，就交换位置
function sort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] > arr[j]) {
                let temp = arr[i]
                arr[i] = arr[j]
                arr[j] = temp
            }
        }
    }
    return arr
}
console.log(sort([2, 4, 3, 1]))
// 数组去重：将原数组的第一个元素放进res这个空数组内，然后把它
function rewrite(arr1) {
    let res = [arr1[0]]
    for (let i = 1; i < arr1.length; i++) {
        var isFalse = false
        for (let j = 0; j < res.length; j++) {
            if (arr1[i] === res[j]) {
                isFalse = true
                break;
            };
        }
        if (!isFalse) {
            res.push(arr1[i])
        }
    }
    return res
}
console.log(rewrite([2, 2, 4, 3, 1]))
// 统计字符串中出现最多的
function findMaxDuplicateChar(str) {
    if (str.length == 1) {
        return str;
    }
    let charObj = {};
    for (let i = 0; i < str.length; i++) {
        if (!charObj[str.charAt(i)]) {
            charObj[str.charAt(i)] = 1;
        } else {
            charObj[str.charAt(i)] += 1;
        }
    }
    let maxChar = '',
        maxValue = 1;
    for (var k in charObj) {
        if (charObj[k] >= maxValue) {
            maxChar = k;
            maxValue = charObj[k];
        }
    }
    return maxChar;
}
// 快速排序:利用递归的思想
function quickSort(arr) {
    if (arr.length <= 1) {
        return arr
    }
    let leftArr = []
    let rightArr = []
    let p = arr[0]
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > p) {
            rightArr.push(arr[i])
        } else {
            leftArr.push(arr[i])
        }
    }
    return [].concat(quickSort(leftArr), [p], quickSort(rightArr))
}
console.log(quickSort([2, 7, 8, 5, 4, 1]))
// 打印三角形
function writeSjx(n) {
    for (var i = 1; i <= n; i++) {
        //外循环控制等腰三角形的行数
        for (var j = n - 1; j >= i; j--) {
            //打印等腰三角形每行前的空格数
            document.write("&nbsp;");
        }
        for (var k = 1; k <= 2 * i - 1; k++) {
            //输出等腰三角形
            document.write("*");
        }
        document.write("<br />");
        //换行
    }
}
// 获取URL的?后的查询字符串
function getQueryStr(url) {
    let queryObject = {}
    let s_url = url.substr(url.indexOf('?') + 1)
    let strArr = s_url.split('&')
    // console.log(strArr)
    let newArr = strArr.map(item => item.split('='))
    // console.log(newArr)
    for (let i = 0; i < newArr.length; i++) {
        queryObject[newArr[i][0]] = !isNaN(Number(newArr[i][1])) ? Number(newArr[i][1]) : newArr[i][1]
    }
    return queryObject
}
console.log(getQueryStr('http://www.quwan.com/index?name=tyler&age=13'))
// 将手机号中间四位替换成'*'
function newPhoneStr(phone) {
    let arr = phone.split('')
    arr.splice(3,4,'*','*','*','*')
    return arr.join('')
}
console.log(newPhoneStr('17639223398'))

// 对连续重复的字符去重
function romRepStr(str) {
    let strArr = str.match(/(\w)\1+/g) // ["ss", "aaa", "666", "ggg"]
    console.log(strArr)
    if (strArr == ['']) {
        return str
    }
    //                    "ss"              "s"
    // str1 = str.replace(strArr[0], strArr[0].substr(0, 1))
    // console.log(str1)
    strArr.forEach(item => {
        str = str.replace(item, item.substr(0, 1))
    });
    return str
}
console.log(romRepStr('sadssgssdaaa666fggg'));

// 实现bind功能
Function.prototype.bindA = function (obj, ...arg) { // arg收集参数
    return (...extendArg) => { // 返回函数
        console.log(this) // this绑定调用这个函数方法(bindA)的函数对象sayColor
        return this.apply(obj, [...arg, ...extendArg]) // 改变this的指向
        //                            合并参数
    }
}


var o={};
function sayColor(color,name,age){
    this.color = color
    this.name = name
    this.age = age
    console.log(this.color);
    console.log(this.name)
    console.log(this.age)
}
var func=sayColor.bindA(o,'blue');
console.log(func)
func('zs', 18);
