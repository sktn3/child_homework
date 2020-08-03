
var who = "";

var mode = "+";//足し算,引き算 + or -
var limit = 1;//数字の上限。０は制限なし。pastは過去問
var past_num = 0;//過去問の難問目を表示するか
var limit_mode = false;//第一オペランドの数字を固定するかどうか
var inputClass = 1;

var startTime;
var intervalStartTime;

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


    //#で別のJSONPを指定可能
    if( window.location.hash != "" && window.location.hash != "#" ){
        who = window.location.hash.substring(1);
    }

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
    },500);

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
    changeCursor(0);

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
//const randTimeReverse = (max) => Math.floor( (1 - Math.random() * Math.random()) * max);

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

        for(let i=0; i<30; i++){
            console.log("setNewProblem(limit:"+limit+") i:"+i);
            let random;

            if(limit_mode){//limitの数字で固定
                operand1 = limit;
            }else{
                //operand1 = randTimeReverse(limit);
                operand1 = parseInt(Math.random() * Math.pow(10, String(limit).length)) % limit +1;
            }


            //console.log("op2:" + random +", "+parseInt(random * String(limit).length * 10) );
            operand2 = parseInt(Math.random() * Math.pow(10, String(limit).length)) % limit +1;

            //if(mode == "-" && operand1 < operand2){
            if(operand1 < operand2){
                let tempOperand = operand1;
                operand1 = operand2;
                operand2 = tempOperand;
            }
            //console.log(" ope1: "+operand1+", ope2: "+operand2);

            if(operand1 == oldOperand1 &&  operand2 == oldOperand2){
                console.log(" continue 1");

            }else if( (limit*0.7) > operand1){ //難しさパラメータ その１
                console.log(" continue 2 ("+operand1+", "+operand2+ ")");
            }else if( (operand1/6) > operand2){ //難しさパラメータ その２
                console.log(" continue 3 ("+operand1+", "+operand2+ ")");
            }else{
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

function setNum(n){
    console.log(">> setNum")
    try{ touch_sound(); }catch(e){}
    const elRslt = document.querySelector("#result");

    let num = elRslt.textContent;
    num = num.replace(/\s/,"");

    const numLen = String(num).length;

    if( numLen == 0 ){
        elRslt.textContent = n;
    }else if( numLen < 4 ){
        elRslt.textContent =  n + num;
    }
    changeCursor(numLen+1);
    checkCalc();
}
function setBackSpace(){
    try{ touch_sound(); }catch(e){}
    let elRslt = document.querySelector("#result");
    let num = elRslt.textContent;
    num = num.replace(/\s/,"");
    let numLen = String(num).length;
    if( numLen == 0 || numLen == 1 ){
        elRslt.textContent = " ";
        numLen = 0;
    }else{
        elRslt.textContent = num.slice(1,numLen);
        numLen--;
    }
    changeCursor(numLen);
    //checkCalc();
}

function changeCursor(numLen){
    console.log(">> changeCursor");
    const ResultWidth = 280;//px
    const ResultMaxLen = 4;

    const w = (ResultWidth/ResultMaxLen)*(ResultMaxLen-numLen);
    console.log("numLen: "+ numLen);
    console.log("ResultWhidth: "+ w);

    const elRslt = document.querySelector("#result");
    const elRsltCsr = document.querySelector("#result_cursor");
    elRsltCsr.style.width = String(w)+"px";

    elRsltCsr.style.top = String(elRslt.offsetTop) + "px";
    elRsltCsr.style.left = String(elRslt.offsetLeft) + "px";
    elRsltCsr.style.height = String(elRslt.offsetHeight) + "px";

}

function checkCalc(){
    console.log(">> checkCalc");
    const elOp1 = document.querySelector("#operand1");
    const elOp2 = document.querySelector("#operand2");
    const elRslt = document.querySelector("#result");

    const operand1 = parseInt( elOp1.textContent );
    const operand2 = parseInt( elOp2.textContent );
    const result = parseInt( elRslt.textContent );

    const count = document.querySelector("#count_num").textContent;
    let hissan = "no";
    if( document.querySelector("#hissan").checked ){
        hissan = "筆算";
    }
 
    const sec = Math.round((new Date() - intervalStartTime)/1000);

    if(mode == "+"){
        try{
            if( (operand1 + operand2) == result){
                //console.log(" OK");
                checkOk( getStrForURL([count,hissan,operand1,"＋",operand2, sec])
                );
            }else{
                console.log(" NG");
            }
        }catch(e){
                console.log(" checkCacl "+e);
        }
    }else if(mode == "-"){
        try{
            if( (operand1 - operand2) == result){
                //console.log(" OK");
                checkOk( getStrForURL([count,hissan,operand1,"−",operand2, sec]));
            }else{
                console.log(" NG");
            }
        }catch(e){
                console.log(" checkCacl "+e);
        }
    }else if(mode == "x"){
        try{
            if( (operand1 * operand2) == result){
                //console.log(" OK");
                checkOk( getStrForURL([count,hissan,operand1,"x",operand2, sec]));
            }else{
                console.log(" NG");
            }
        }catch(e){
                console.log(" checkCacl "+e);
        }
    }
}

function getStrForURL(array){
    console.log(">> getStrForURL " + array);
    const str = "str="+encodeURIComponent(array.join(","));
    return str;
}

function checkOk(sansu1){
    console.log(">> checkOk");


    const elOK = document.querySelector("#ok");
    elOK.style.display = "block";
    ganba_sound();
    setTimeout(()=>{
        elOK.style.display = "none";
        setNewProblem();
        setCountIncriment();
    },1000);

    access(getURL()+"&"+sansu1);
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
    const elHissan = document.querySelector("#hissan");
    const elPrb = document.querySelector("#problem");
    const elOp = document.querySelector("#operator");
    const elOp1 = document.querySelector("#operand1");
    const elOp2 = document.querySelector("#operand2");
    const elBar = document.querySelector("#bar");
    const elEq = document.querySelector("#equal");
    const elRslt = document.querySelector("#result");
    const elRsltCsr = document.querySelector("#result_cursor");

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

        //elRsltCsr.classList.remove("result");
        //elRsltCsr.classList.add("resulthissan");

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

        //elRsltCsr.classList.remove("resulthissan");
        //elRsltCsr.classList.add("result");

        localStorage.setItem('sansu1_hissan',"false");
    }

    changeCursor(0);

    try{ touch_sound(); }catch(e){}
}


function audio_sound(id){
    console.log(">> "+id);
    let audio = document.getElementById(id)
    audio.pause();
    audio.currentTime = 0;
    audio.muted = false;
    audio.play();
}
function ganba_sound(){ audio_sound("ganba_sound") }
function touch_sound(){ audio_sound("touch_sound") }


function getURL(){
    return "https://script.google.com/macros/s/AKfycbzSWGe4qVF3em2ymmuHXc-HLJdewuRX-5xIv0Pj913NuS3JBOvW/exec?type=append&who="+who;
}
function access(url){
    console.log(">> Call access");
    console.log(" URL " +url);

    const script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);

    window.addEventListener('error', (event) => {
        console.log(" error access "+event)
    });
}

