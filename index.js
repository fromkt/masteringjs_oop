/*
요구사항
다음처럼 동작하는 할일관리 프로그램을 만듭니다.


const todo = new Todo();
todo.command("add$자바스크립트 공부하기");
> id: 5,  "자바스크립트 공부하기" 항목이 새로 추가됐습니다.  //추가된 결과 메시지를 출력
> 현재상태 :  todo:1개, doing:2개, done:2개

todo.command("shOW     $doing");   //공백도 제거되고, 대문자가 섞여있어도 잘 동작되게 한다.
> "1, 그래픽스공부", "4, 블로그쓰기"  //id값과 함께 task제목이 출력된다.

todo.command("update$3$done");
> 현재상태 :  todo:1개, doing:1개, done:3개  //변경된 모든 상태가 노출.

todo.command("show$done");
> '1, iOS공부하기, 3시간10분',  '5, 자바스크립트공부하기, 9시간31분',  '7, 주간회의 1시간40분'
*/
const Todo = class {
  constructor ( options={}) {
    this.list = [];
    this.inputTask = {};
    this.defaults = Object.assign( this.getDefaults() , options);
    this.convertTask = new convertCommand();
  }
  getDefaults () {
    return {
      statusBeforeText : "현재상태 : ",
      todoIndex : 0, // add method에 todo index위치
      stateShowIndex : 0 , // show method에 state index위치
      idIndex : 0 , // update method에 id index위치
      stateIndex : 1// update method에 state index위치
    };
  }

  command ( task) {
    const cmd = this.convertTask.setTask( task);
    [this.inputTask.order , ...this.inputTask.args] =  cmd.trim().strtoupper().get();
    this.order();  
  }

  order () {
    this[ this.inputTask.order] && this[ this.inputTask.order]();
  }
  add () {
    let added = { id : this.list.length+1 , todo : this.inputTask.args[ this.defaults.todoIndex] , state : 'todo' , time : new timeClass() };
    this.list.push( added);

    this.outPrint( `id: ${added.id},  "${added.todo}" 항목이 새로 추가됐습니다.` ).nowStatus().outPrint();
  }

  stateFilter ( state) {
    return item => item.state === state;
  }

  nowStatus(){
    let statuses = { done : 0 , doing : 0 , todo:0};
    let result = '';
    this.list.forEach( ( item)=>{
      if( statuses[ item.state] !== undefined ) statuses[ item.state]++;
    });

    for( let k in statuses) {
        result += (result!==''?', ':'')+ `${k}:${statuses[k]}개`;
    }
    this.log = this.defaults.statusBeforeText + result;
    return this;
  }

  outPrint ( message) {
    if( message===undefined && this.log !== undefined) {
      console.log( this.log);
      delete this.log;
    } else {
      console.log( message);
    }
    return this;
  }
  show () {
    const that = this;
    const state = that.inputTask.args[ that.defaults.stateShowIndex];
//    const result = this.list.filter( this.stateFilter( state));
    const stateCompare = function( object){
      return object.state === state;
    };
    const itemOutput = function( item){
      that.log = item.id +', '+ item.todo + ( item.state==='done'?', '+item.time.diffTime:'');
      that.outPrint();
    };

    Object.assign( [] , that.list.filter( stateCompare)).forEach( itemOutput);
  }
  
  update () {    
    const target =  this.list[ this.inputTask.args[ this.defaults.idIndex] -1];
    if( !target) return;
    const beforeState = target.state;
    target.state = this.inputTask.args[ this.defaults.stateIndex];
    if( beforeState !== target.state) {
      target.time.update( target.state +'Time').setDiff();
    }
    this.nowStatus().outPrint();
  }
}

const timeClass = class {
  constructor ( options={}) {
    this.defaults = Object.assign( this.getDefaults() , options);

//    this[ this.defaults.startTime] = undefined;
//    this[ this.defaults.endTime] = undefined;
    this.diffTime = '';
  }
  getDefaults () {
    return {
      startTime : 'doing',//시작시간
      endTime : 'done',//끝나는시간
      convert : '시분'
    };
  }

  update( current , now = new Date()) {
    if( typeof this[ current] !== undefined) this[ current] = now;
    return this;
  }
  check( ...args) {
    const tostring = Object.prototype.toString;
    const result = args.filter( (time)=>tostring.call( time)=== "[object Date]");
    return result.length === args.length;
    //this.doingTime
  }
  setDiff(){
    let diffseconds = 0;
    const startTime = this[ this.defaults.startTime],
          endTime = this[ this.defaults.endTime];

    if( this.check([ startTime,endTime]) )
        diffseconds = ( startTime - endTime) / 1000;
    switch ( this.defaults.convert) {
      case '시분' :
        let hours = Math.floor((diffseconds % 86400) / 3600); // hours
        let minute = Math.round(((diffseconds % 86400) % 3600) / 60); // minutes
        this.diffTime = hours + '시간 ' + minute + '분';
        break;
      default :
        this.diffTime = '';
        break;
    }
  }
}

const convertCommand = class {
  constructor ( options = {}) {
    this.defaults = Object.assign( this.getDefaults() , options);
    this.arrayCommand = [];
  }
  setTask ( task) {
    this.arrayCommand = this.explode.bind( task)( this.defaults.separator);
    return this;
  }
  getDefaults () {
    return {
      separator : '$'
    };
  }
  explode( separator) {
    return this.split( separator);
  }

  trim () {
    this.arrayCommand = this.arrayCommand.map( ( str)=>str.trim());
    return this;
  }
  strtoupper () {
    this.arrayCommand = this.arrayCommand.map( ( str)=>str.toLowerCase());
    return this;
  }
  get () {
    return this.arrayCommand;
  }
}

const todo = new Todo();

///*테스트 코드
todo.command("add$자바스크립트 공부하기");
todo.command("add$Todo test");
todo.command("add$Todo 실행");
todo.command("update$3$doing");
todo.command("shOW     $doing");
todo.command("update$3$done");
todo.command("show$done");

//*/
