'use strict';

var mode = "+"; //足し算,引き算 + or -
var limit = 1; //数字の上限。０は制限なし
var limit_mode = false; //第一オペランドの数字を固定するかどうか
var inputClass = 1;

var startTime;

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
  }, 900);

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
var randTimeReverse = function randTimeReverse(max) {
  return Math.floor((1 - Math.random() * Math.random()) * max);
};

function setNewProblem() {
  var operand1 = void 0;
  var operand2 = void 0;

  var elOp1 = document.querySelector("#operand1");
  var elOp2 = document.querySelector("#operand2");

  var oldOperand1 = parseInt(elOp1.textContent);
  var oldOperand2 = parseInt(elOp2.textContent);

  for (var i = 0; i < 15; i++) {
    console.log("setNewProblem(limit:" + limit + ") i:" + i);
    var random = void 0;

    if (limit_mode) {
      //limitの数字で固定
      operand1 = limit;
    } else {
      operand1 = randTimeReverse(limit);
    }

    random = Math.random();

    //console.log("op2:" + random +", "+parseInt(random * String(limit).length * 10) );
    operand2 = parseInt(random * String(limit).length * 10) % limit + 1;
    //console.log( "op1:"+ operand1 + ", op2:"+operand2 );

    //if(mode == "-" && operand1 < operand2){
    if (operand1 < operand2) {
      var tempOperand = operand1;
      operand1 = operand2;
      operand2 = tempOperand;
    }

    if (operand1 == oldOperand1 && operand2 == oldOperand2) {
      console.log("reset");
    } else {
      break;
    }
  }

  elOp1.textContent = operand1;
  elOp2.textContent = operand2;

  document.querySelector("#result").textContent = " ";
}

function setNum(n) {
  var elRslt = document.querySelector("#result");
  var num = elRslt.textContent;
  num = num.replace(/\s/, "");
  if (String(num).length == 1 && num == "0") {
    elRslt.textContent = n;
  } else if (String(num).length < 4) {
    elRslt.textContent = num + n;
  }
  checkCalc();
}
function setBackSpace() {
  var elRslt = document.querySelector("#result");
  var num = elRslt.textContent;
  num = num.replace(/\s/, "");
  if (String(num).length == 0 || String(num).length == 1) {
    elRslt.textContent = " ";
  } else {
    elRslt.textContent = num.slice(0, -1);
  }
  //checkCalc();
}

function checkCalc() {
  var elOp1 = document.querySelector("#operand1");
  var elOp2 = document.querySelector("#operand2");
  var elRslt = document.querySelector("#result");
  var elOK = document.querySelector("#ok");

  var operand1 = parseInt(elOp1.textContent);
  var operand2 = parseInt(elOp2.textContent);
  var result = parseInt(elRslt.textContent);

  if (mode == "+") {
    try {
      if (operand1 + operand2 == result) {
        //console.log("OK");
        elOK.style.display = "block";
        setTimeout(function () {
          elOK.style.display = "none";
          setNewProblem();
          setCountIncriment();
        }, 1000);
      } else {
        //console.log("NG");
      }
    } catch (e) {}
  } else if (mode == "-") {
    try {
      if (operand1 - operand2 == result) {
        //console.log("OK");
        elOK.style.display = "block";
        setTimeout(function () {
          elOK.style.display = "none";
          setNewProblem();
          setCountIncriment();
        }, 1000);
      } else {
        //console.log("NG");
      }
    } catch (e) {}
  } else if (mode == "x") {
    try {
      if (operand1 * operand2 == result) {
        //console.log("OK");
        elOK.style.display = "block";
        setTimeout(function () {
          elOK.style.display = "none";
          setNewProblem();
          setCountIncriment();
        }, 1000);
      } else {
        //console.log("NG");
      }
    } catch (e) {}
  }
}

function setlimit() {
  var val = document.querySelector("#select_limit").value;
  var num = val.replace(/!/, "");
  if (val.length != num.length) {
    limit_mode = true;
  }
  limit = parseInt(num);
  localStorage.setItem('sansu1_limit', val);
  setNewProblem();
}

function setmode() {
  var elOp = document.querySelector("#operator");
  var ellim = document.querySelector("#select_limit");

  mode = document.querySelector("#select_mode").value;
  console.log("mode: " + mode);
  localStorage.setItem('sansu1_mode', mode);
  if (mode == "x") {
    elOp.textContent = "×";
    ellim.value = "9";
  } else if (mode == "-") {
    elOp.textContent = "−";
  } else {
    elOp.textContent = "＋";
  }
  setNewProblem();
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

    localStorage.setItem('sansu1_hissan', "false");
  }
}
