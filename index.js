/*
요구사항
다음처럼 동작하는 할일관리 프로그램을 만듭니다.

할일을 추가할 수 있다.
할일이 추가되면 id 값을 생성하고 결과를 알려준다.
상태는 3가지로 관리된다. todo, doing, done.
각 일(task)는 상태값을 가지고 있고, 그 상태값을 변경할 수 있다.
각 상태에 있는 task는 show함수를 통해서 볼 수 있다.
명령어를 입력시 command함수를 사용해야하고, '$'를 구분자로 사용해서 넣는다.
done의 경우 소요시간이 함께 표시된다 (소요시간은 doing에서 done까지의 시간이다)
구분자($) 사이에 공백이 있다면 공백을 제거하고 실행되도록 한다.
대/소문자입력은 프로그램에서는 소문자만 처리하도록 코드를 구현한다. (대문자는 소문자로 변경)
유효하지 않은 입력은 오류를 발생시킨다.
code 형태는 es class를 기반으로 개발한다.

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
  constructor ( ...args) {
    this.list = args || [];
    this.inputTask = {};
  }

  command ( task) {
    const cmd = new convertCommand( task);
    [this.inputTask.order , ...this.inputTask.args] =  cmd.trim().strtoupper().get();
    this.order();  
  }

  order () {
    this[ this.inputTask.order] && this[ this.inputTask.order]();
  }
  add () {
    this.list.push( { todo : this.inputTask.args[0] , state : 'todo' , time : new timeClass() });
  }

  stateFilter ( state) {
    return item => item.state === state;
  }

  show () {
    const state = this.inputTask.args[0];
    const result = this.list.filter( this.stateFilter( state));
//    const result = this.list.filter( function( item) { return state === item.state;});
  }
  
  update () {    
    const target =  this.list[ this.inputTask.args[0] -1];
    if( !target) return;
    const beforeState = target.state;
    [ ,target.state ] = this.inputTask.args;
    if( beforeState !== target.state) {
      target.time.update( target.state +'Time').setDiff();
    }
  }
}

const timeClass = class {
  constructor () {
    this.doingTime = undefined;
    this.doneTime = undefined;
    this.diffTime = '';
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
  setDiff( convert = "시분"){
    let diffseconds = 0;
    if( this.check([this.doingTime,this.doneTime]) )
        diffseconds = ( this.end_date - this.start_date) / 1000;
    switch ( convert) {
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
  constructor ( stringCommand) {
    this.arrayCommand = this.explode.bind( stringCommand)() || [];
  }

  explode( separator = '$') {
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
//todo.command("show$done");

//*/
