"use strict";

var who = "";

var mode = "+"; //足し算,引き算 + or -
var limit = 1; //数字の上限。０は制限なし。pastは過去問
var past_num = 0; //過去問の難問目を表示するか
var limit_mode = false; //第一オペランドの数字を固定するかどうか
var inputClass = 1;

var startTime;
var intervalStartTime;

function init() {
    var scrollOff = function scrollOff(e) {
        e.preventDefault();
    };
    // スクロールをキャンセル
    document.addEventListener('touchmove', scrollOff, false);
    document.addEventListener('scroll', scrollOff, false);

    /* ピッチインピッチアウトによる拡大縮小を禁止 */
    document.documentElement.addEventListener('touchstart', function (e) {
        if (e.touches.length >= 2) {
            e.preventDefault();
        }
    }, { passive: false });
    /* ダブルタップによる拡大を禁止 */
    var t = 0;
    document.documentElement.addEventListener('touchend', function (e) {
        var now = new Date().getTime();
        if (now - t < 350) {
            e.preventDefault();
        }
        t = now;
    }, false);

    //#で別のJSONPを指定可能
    if (window.location.hash != "" && window.location.hash != "#") {
        who = window.location.hash.substring(1);
    }

    setStartTime();

    document.querySelector("#select_limit").addEventListener('change', setlimit, false);
    document.querySelector("#select_mode").addEventListener('change', setmode, false);
    document.querySelector("#hissan").addEventListener('change', sethissan, false);

    setInterval(function () {
        var nextInputClass = (inputClass + 1) % 2;
        var el = document.querySelector(".input" + inputClass);
        el.classList.remove("input" + inputClass);
        el.classList.add("input" + nextInputClass);
        inputClass = nextInputClass;

        setElapsedTime();
    }, 500);

    //localStorageから前回指定値を入手
    var val = localStorage.getItem('sansu1_limit');
    if (val) {
        document.querySelector("#select_limit").value = val;
        setlimit();
    } else {
        limit = document.querySelector("#select_limit").value;
    }

    mode = localStorage.getItem('sansu1_mode');
    var elMode = document.querySelector("#select_mode");
    if (mode) {
        elMode.value = mode;
        setmode();
    } else {
        mode = elMode.value;
    }
    if (localStorage.getItem('sansu1_hissan') == "true") {
        document.querySelector("#hissan").checked = true;
        sethissan();
    }

    setNewProblem();
    setCountIncriment();

    var audio = void 0;
    audio = document.getElementById("touch_sound");
    try {
        audio.load();audio.play();
    } catch (e) {}

    document.body.style.display = "block";
}

function setStartTime() {
    var yobi = new Array("日", "月", "火", "水", "木", "金", "土");

    var d = new Date();
    startTime = d;

    //年・月・日・曜日を取得する
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var week = d.getDay();
    var day = d.getDate();

    //時・分・秒を取得する
    var hour = d.getHours();
    var minute = d.getMinutes();
    var second = d.getSeconds();

    //year+"年"+month+"月"+day+"日 "+yobi[week]+"曜日　"+hour+"時"+minute+"分"+second+"秒";
    document.querySelector("#startTime").textContent = month + "月" + day + "日 " + yobi[week] + "曜日　" + hour + "時" + minute + "分";
}

function setElapsedTime() {
    var d = new Date();

    var time = parseInt((d - startTime) / 1000);
    var minute = ("0" + parseInt(time / 60)).slice(-3);
    var second = ("0" + time % 60).slice(-2);
    //console.log(minute +"分"+ second+ "秒");
    document.querySelector("#elapsedTime").textContent = minute + "分" + second + "秒";
}

var setCountIncriment = function setCountIncriment() {
    document.querySelector("#count_num").textContent = String(parseInt(document.querySelector("#count_num").textContent) + 1);
};

//maxの数にランダム値を偏らせる
//const randTimeReverse = (max) => Math.floor( (1 - Math.random() * Math.random()) * max);

function setNewProblem() {
    var operand1 = void 0;
    var operand2 = void 0;

    var elOp1 = document.querySelector("#operand1");
    var elOp2 = document.querySelector("#operand2");

    console.log("setNewProblem limit:" + limit);
    if (limit == "past") {
        console.log("setNewProblem(past) num:" + past_num);

        operand1 = 1;
        operand2 = 1;
    } else {

        var oldOperand1 = parseInt(elOp1.textContent);
        var oldOperand2 = parseInt(elOp2.textContent);

        for (var i = 0; i < 30; i++) {
            console.log("setNewProblem(limit:" + limit + ") i:" + i);
            var random = void 0;

            if (limit_mode) {
                //limitの数字で固定
                operand1 = limit;
            } else {
                //operand1 = randTimeReverse(limit);
                operand1 = parseInt(Math.random() * Math.pow(10, String(limit).length)) % limit + 1;
            }

            //console.log("op2:" + random +", "+parseInt(random * String(limit).length * 10) );
            operand2 = parseInt(Math.random() * Math.pow(10, String(limit).length)) % limit + 1;

            //if(mode == "-" && operand1 < operand2){
            if (operand1 < operand2) {
                var tempOperand = operand1;
                operand1 = operand2;
                operand2 = tempOperand;
            }
            //console.log(" ope1: "+operand1+", ope2: "+operand2);

            if (operand1 == oldOperand1 && operand2 == oldOperand2) {
                console.log(" continue 1");
            } else if (limit * 0.7 > operand1) {
                //難しさパラメータ その１
                console.log(" continue 2 (" + operand1 + ", " + operand2 + ")");
            } else if (operand1 / 6 > operand2) {
                //難しさパラメータ その２
                console.log(" continue 3 (" + operand1 + ", " + operand2 + ")");
            } else {
                break;
            }
        }
    }

    elOp1.textContent = operand1;
    elOp2.textContent = operand2;

    document.querySelector("#result").textContent = " ";

    intervalStartTime = new Date();
    changeCursor(0);
}

function setNum(n) {
    console.log(">> setNum");
    try {
        touch_sound();
    } catch (e) {}
    var elRslt = document.querySelector("#result");

    var num = elRslt.textContent;
    num = num.replace(/\s/, "");

    var numLen = String(num).length;

    if (numLen == 0) {
        elRslt.textContent = n;
    } else if (numLen < 4) {
        elRslt.textContent = n + num;
    }
    changeCursor(numLen + 1);
    checkCalc();
}
function setBackSpace() {
    try {
        touch_sound();
    } catch (e) {}
    var elRslt = document.querySelector("#result");
    var num = elRslt.textContent;
    num = num.replace(/\s/, "");
    var numLen = String(num).length;
    if (numLen == 0 || numLen == 1) {
        elRslt.textContent = " ";
        numLen = 0;
    } else {
        elRslt.textContent = num.slice(1, numLen);
        numLen--;
    }
    changeCursor(numLen);
    //checkCalc();
}

function changeCursor(numLen) {
    console.log(">> changeCursor");
    var ResultWidth = 280; //px
    var ResultMaxLen = 4;

    var w = ResultWidth / ResultMaxLen * (ResultMaxLen - numLen);
    console.log("numLen: " + numLen);
    console.log("ResultWhidth: " + w);

    var elRsltCsr = document.querySelector("#result_cursor");
    elRsltCsr.style.width = String(w) + "px";
}

function checkCalc() {
    console.log(">> checkCalc");
    var elOp1 = document.querySelector("#operand1");
    var elOp2 = document.querySelector("#operand2");
    var elRslt = document.querySelector("#result");

    var operand1 = parseInt(elOp1.textContent);
    var operand2 = parseInt(elOp2.textContent);
    var result = parseInt(elRslt.textContent);

    var count = document.querySelector("#count_num").textContent;
    var hissan = "no";
    if (document.querySelector("#hissan").checked) {
        hissan = "筆算";
    }

    if (mode == "+") {
        try {
            if (operand1 + operand2 == result) {
                //console.log(" OK");
                checkOk(getStrForURL([count, hissan, operand1, "＋", operand2, Math.round((intervalStartTime - startTime) / 1000)]));
            } else {
                console.log(" NG");
            }
        } catch (e) {
            console.log(" checkCacl " + e);
        }
    } else if (mode == "-") {
        try {
            if (operand1 - operand2 == result) {
                //console.log(" OK");
                checkOk(getStrForURL([count, hissan, operand1, "−", operand2, Math.round((intervalStartTime - startTime) / 1000)]));
            } else {
                console.log(" NG");
            }
        } catch (e) {
            console.log(" checkCacl " + e);
        }
    } else if (mode == "x") {
        try {
            if (operand1 * operand2 == result) {
                //console.log(" OK");
                checkOk(getStrForURL([count, hissan, operand1, "x", operand2, Math.round((intervalStartTime - startTime) / 1000)]));
            } else {
                console.log(" NG");
            }
        } catch (e) {
            console.log(" checkCacl " + e);
        }
    }
}

function getStrForURL(array) {
    console.log(">> getStrForURL " + array);
    var str = "str=" + encodeURIComponent(array.join(","));
    return str;
}

function checkOk(sansu1) {
    console.log(">> checkOk");

    var elOK = document.querySelector("#ok");
    elOK.style.display = "block";
    ganba_sound();
    setTimeout(function () {
        elOK.style.display = "none";
        setNewProblem();
        setCountIncriment();
    }, 1000);

    access(getURL() + "&" + sansu1);
}

function setlimit() {
    var mode = document.querySelector("#select_mode");
    var val = document.querySelector("#select_limit").value;
    if (val == "past") {
        mode.disabled = true;
        limit = "past";
    } else {
        mode.disabled = false;

        var num = val.replace(/!/, "");
        if (val.length != num.length) {
            limit_mode = true;
        }
        limit = parseInt(num);
    }
    localStorage.setItem('sansu1_limit', val);

    setNewProblem();

    try {
        touch_sound();
    } catch (e) {}
}

function setmode() {
    var elOp = document.querySelector("#operator");
    var ellim = document.querySelector("#select_limit");

    mode = document.querySelector("#select_mode").value;
    console.log("mode: " + mode);
    localStorage.setItem('sansu1_mode', mode);
    if (mode == "x") {
        elOp.textContent = "×";
        if (limit != "past") {
            ellim.value = "9";
        }
    } else if (mode == "-") {
        elOp.textContent = "−";
    } else {
        elOp.textContent = "＋";
    }
    setNewProblem();
    try {
        touch_sound();
    } catch (e) {}
}
function sethissan() {
    var elHissan = document.querySelector("#hissan");
    var elPrb = document.querySelector("#problem");
    var elOp = document.querySelector("#operator");
    var elOp1 = document.querySelector("#operand1");
    var elOp2 = document.querySelector("#operand2");
    var elBar = document.querySelector("#bar");
    var elEq = document.querySelector("#equal");
    var elRslt = document.querySelector("#result");
    var elRsltCsr = document.querySelector("#result_cursor");

    if (elHissan.checked) {
        elPrb.classList.remove("problem");
        elPrb.classList.add("problemhissan");

        elOp1.classList.remove("operand1");
        elOp1.classList.add("operand1hissan");

        elOp.classList.remove("operator");
        elOp.classList.add("operatorhissan");

        elOp2.classList.remove("operand2");
        elOp2.classList.add("operand2hissan");

        elBar.classList.remove("bar");
        elBar.classList.add("barhissan");

        elEq.classList.remove("equal");
        elEq.classList.add("equalhissan");

        elRslt.classList.remove("result");
        elRslt.classList.add("resulthissan");

        elRsltCsr.classList.remove("result");
        elRsltCsr.classList.add("resulthissan");

        localStorage.setItem('sansu1_hissan', "true");
    } else {
        elPrb.classList.remove("problemhissan");
        elPrb.classList.add("problem");

        elOp1.classList.remove("operand1hissan");
        elOp1.classList.add("operand1");

        elOp.classList.remove("operatorhissan");
        elOp.classList.add("operator");

        elOp2.classList.remove("operand2hissan");
        elOp2.classList.add("operand2");

        elBar.classList.remove("barhissan");
        elBar.classList.add("bar");

        elEq.classList.remove("equalhissan");
        elEq.classList.add("equal");

        elRslt.classList.remove("resulthissan");
        elRslt.classList.add("result");

        elRsltCsr.classList.remove("resulthissan");
        elRsltCsr.classList.add("result");

        localStorage.setItem('sansu1_hissan', "false");
    }

    try {
        touch_sound();
    } catch (e) {}
}

function audio_sound(id) {
    console.log(">> " + id);
    var audio = document.getElementById(id);
    audio.pause();
    audio.currentTime = 0;
    audio.muted = false;
    audio.play();
}
function ganba_sound() {
    audio_sound("ganba_sound");
}
function touch_sound() {
    audio_sound("touch_sound");
}

function getURL() {
    return "https://script.google.com/macros/s/AKfycbzSWGe4qVF3em2ymmuHXc-HLJdewuRX-5xIv0Pj913NuS3JBOvW/exec?type=append&who=" + who;
}
function access(url) {
    console.log(">> Call access");
    console.log(" URL " + url);

    var script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);

    window.addEventListener('error', function (event) {
        console.log(" error access " + event);
    });
}
