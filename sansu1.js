
var mode = "+";//足し算,引き算 + or -
var limit = 1;//数字の上限。０は制限なし。pastは過去問
var past_num = 0;//過去問の難問目を表示するか
var limit_mode = false;//第一オペランドの数字を固定するかどうか
var inputClass = 1;

var startTime;

function init(){
    var scrollOff = function( e ){
	    e.preventDefault();
    }
    // スクロールをキャンセル
    document.addEventListener( 'touchmove',scrollOff, false);
    document.addEventListener( 'scroll',scrollOff, false);

    /* ピッチインピッチアウトによる拡大縮小を禁止 */
    document.documentElement.addEventListener('touchstart', function (e) {
        if (e.touches.length >= 2) {e.preventDefault();}
    }, {passive: false});
    /* ダブルタップによる拡大を禁止 */
    var t = 0;
    document.documentElement.addEventListener('touchend', function (e) {
        var now = new Date().getTime();
        if ((now - t) < 350){
            e.preventDefault();
        }
        t = now;
    }, false);


    setStartTime();

    document.querySelector("#select_limit").addEventListener('change',setlimit,false);
    document.querySelector("#select_mode").addEventListener('change',setmode,false);
    document.querySelector("#hissan").addEventListener('change',sethissan,false);

    setInterval(()=>{
        let nextInputClass = (inputClass + 1) % 2;
        let el = document.querySelector(".input"+inputClass);
        el.classList.remove("input"+inputClass);
        el.classList.add("input"+nextInputClass);
        inputClass = nextInputClass;

        setElapsedTime();
    },900);

    //localStorageから前回指定値を入手
    let val = localStorage.getItem('sansu1_limit');
    if(val){
        document.querySelector("#select_limit").value = val;
        setlimit();
    }else{
        limit = document.querySelector("#select_limit").value;
    }

    mode = localStorage.getItem('sansu1_mode');
    let elMode = document.querySelector("#select_mode");
    if(mode){
        elMode.value = mode;
        setmode();
    }else{
        mode = elMode.value;
    }
    if(localStorage.getItem('sansu1_hissan') == "true"){
        document.querySelector("#hissan").checked = true;
        sethissan();
    }

    setNewProblem();
    setCountIncriment();


    let audio;
    audio = document.getElementById("touch_sound");
    try{ audio.load(); audio.play(); }catch(e){}

    document.body.style.display = "block";
}

function setStartTime(){
    let yobi= new Array("日","月","火","水","木","金","土");

    let d=new Date();
    startTime = d;

    //年・月・日・曜日を取得する
    let year = d.getFullYear();
    let month = d.getMonth()+1;
    let week = d.getDay();
    let day = d.getDate();

    //時・分・秒を取得する
    let hour = d.getHours();
    let minute = d.getMinutes();
    let second = d.getSeconds();

    //year+"年"+month+"月"+day+"日 "+yobi[week]+"曜日　"+hour+"時"+minute+"分"+second+"秒";
    document.querySelector("#startTime").textContent = month+"月"+day+"日 "+yobi[week]+"曜日　"+hour+"時"+minute+"分";
}

function setElapsedTime(){
    let d=new Date();

    let time = parseInt((d - startTime)/1000); 
    let minute = ("0" +parseInt(time/60)).slice(-3);
    let second = ("0" +time%60).slice(-2);
    //console.log(minute +"分"+ second+ "秒");
    document.querySelector("#elapsedTime").textContent = minute +"分"+ second+ "秒";
}

const setCountIncriment = ()=>{
    document.querySelector("#count_num").textContent = String(parseInt(document.querySelector("#count_num").textContent)+1);
}

//maxの数にランダム値を偏らせる
const randTimeReverse = (max) => Math.floor( (1 - Math.random() * Math.random()) * max);

function setNewProblem(){
    let operand1;
    let operand2;

    let elOp1 = document.querySelector("#operand1");
    let elOp2 = document.querySelector("#operand2");

    console.log("setNewProblem limit:"+limit);
    if(limit == "past"){
        console.log("setNewProblem(past) num:"+past_num);
    
        operand1 = 1;
        operand2 = 1;

    }else{

        let oldOperand1 = parseInt(elOp1.textContent);
        let oldOperand2 = parseInt(elOp2.textContent);

        for(let i=0; i<15; i++){
            console.log("setNewProblem(limit:"+limit+") i:"+i);
            let random;

            if(limit_mode){//limitの数字で固定
                operand1 = limit;
            }else{
                operand1 = randTimeReverse(limit);
            }

            random = Math.random();

            //console.log("op2:" + random +", "+parseInt(random * String(limit).length * 10) );
            operand2 = parseInt(random * String(limit).length * 10) % limit +1;
            //console.log( "op1:"+ operand1 + ", op2:"+operand2 );

            //if(mode == "-" && operand1 < operand2){
            if(operand1 < operand2){
                let tempOperand = operand1;
                operand1 = operand2;
                operand2 = tempOperand;
            }

            if(operand1 == oldOperand1 &&    operand2 == oldOperand2){
                console.log("reset");
            }else{
                break;
            }
        }
    }

    elOp1.textContent = operand1;
    elOp2.textContent = operand2;

    document.querySelector("#result").textContent = " ";
}

function setNum(n){
    try{ touch_sound(); }catch(e){}
    let elRslt = document.querySelector("#result");
    let num = elRslt.textContent;
    num = num.replace(/\s/,"");
    if( String(num).length == 0 ){
        elRslt.textContent = n;
    }else if( String(num).length < 4 ){
        elRslt.textContent =  n + num;
    }
    checkCalc();
}
function setBackSpace(){
    try{ touch_sound(); }catch(e){}
    let elRslt = document.querySelector("#result");
    let num = elRslt.textContent;
    num = num.replace(/\s/,"");
    let len = String(num).length;
    if( len == 0 || len == 1 ){
        elRslt.textContent = " ";
    }else{
        elRslt.textContent = num.slice(1,len);
    }
    //checkCalc();
}

function checkCalc(){
    let elOp1 = document.querySelector("#operand1");
    let elOp2 = document.querySelector("#operand2");
    let elRslt = document.querySelector("#result");
    let elOK = document.querySelector("#ok");

    let operand1 = parseInt( elOp1.textContent );
    let operand2 = parseInt( elOp2.textContent );
    let result = parseInt( elRslt.textContent );

    if(mode == "+"){
        try{
            if( (operand1 + operand2) == result){
                //console.log("OK");
                elOK.style.display = "block";
                setTimeout(()=>{
                    elOK.style.display = "none";
                    setNewProblem();
                    setCountIncriment();
                },1000);
            }else{
                //console.log("NG");
            }
        }catch(e){
        }
    }else if(mode == "-"){
        try{
            if( (operand1 - operand2) == result){
                //console.log("OK");
                elOK.style.display = "block";
                setTimeout(()=>{
                    elOK.style.display = "none";
                    setNewProblem();
                    setCountIncriment();
                },1000);
            }else{
                //console.log("NG");
            }
        }catch(e){
        }
    }else if(mode == "x"){
        try{
            if( (operand1 * operand2) == result){
                //console.log("OK");
                elOK.style.display = "block";
                setTimeout(()=>{
                    elOK.style.display = "none";
                    setNewProblem();
                    setCountIncriment();
                },1000);
            }else{
                //console.log("NG");
            }
        }catch(e){
        }
    }
}

function setlimit(){
    let mode = document.querySelector("#select_mode");
    let val = document.querySelector("#select_limit").value;
    if(val=="past"){
        mode.disabled = true;
        limit = "past";
    }else{
        mode.disabled = false;

        let num = val.replace(/!/,"");
        if( val.length != num.length ){
            limit_mode = true;
        }
        limit = parseInt(num);
    }
    localStorage.setItem('sansu1_limit', val);

    setNewProblem();

    try{ touch_sound(); }catch(e){}
}

function setmode(){
    let elOp = document.querySelector("#operator");
    let ellim = document.querySelector("#select_limit");

    mode = document.querySelector("#select_mode").value;
    console.log("mode: "+mode);
    localStorage.setItem('sansu1_mode', mode);
    if(mode == "x"){
        elOp.textContent = "×";
        if(limit != "past"){
            ellim.value = "9";
        }

    }else if(mode == "-"){
        elOp.textContent = "−";

    }else{
        elOp.textContent = "＋";
    }
    setNewProblem();
    try{ touch_sound(); }catch(e){}
}
function sethissan(){
    let elHissan = document.querySelector("#hissan");
    let elPrb = document.querySelector("#problem");
    let elOp = document.querySelector("#operator");
    let elOp1 = document.querySelector("#operand1");
    let elOp2 = document.querySelector("#operand2");
    let elBar = document.querySelector("#bar");
    let elEq = document.querySelector("#equal");
    let elRslt = document.querySelector("#result");

    if(elHissan.checked){
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

        localStorage.setItem('sansu1_hissan',"true");
    }else{
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

        localStorage.setItem('sansu1_hissan',"false");
    }

    try{ touch_sound(); }catch(e){}
}


function touch_sound(){
    let audio = document.getElementById("touch_sound")
    audio.muted = false;
    audio.play();
}
