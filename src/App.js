import React, {useState, useEffect} from "react";
import './App.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';


const arrowUp = <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-caret-up-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
</svg>;

const arrowDown = <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-caret-down-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
</svg>;

const resetbtn = <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-arrow-clockwise" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
<path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
</svg>;

const play = <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-play-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
</svg>;

const pause = <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-pause-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
</svg>;






function App() {
  let audio = document.getElementById('beep');
  const [breaklength, setBreak] = useState(5);
  const [session, setSession] = useState(25);
  const [start, setStart] = useState(true);
  const [timer, setTimer] = useState(25*60);
  const [timerState, setTimerState] = useState("Session");
  
  
  const playSound = () => {
    audio.currentTime=0;
    audio.play();
  }

  
 
  const formatTime = (time) => {
    let minutes = Math.floor ( time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) + ':' +
      ( seconds < 10 ? "0" + seconds : seconds)
    );
  }

  const brekBtn = (x) =>{
   if(start){
        if(x === "+")
        {
          breaklength < 60 ? setBreak(breaklength + 1) : setBreak(breaklength);
        }else if(x === "-"){
          breaklength > 1 ? setBreak(breaklength - 1) : setBreak(breaklength);
        }
        }else{
          return;
        }
  }

  const sessionBtn = (x) =>{
    if(start){
        if(x === "+" && session < 60)
        { 
            setSession(session + 1);
            setTimer((session * 60) + 60);

        }else if(x === "-" && session > 1 ){
          setSession(session - 1);
          setTimer((session *60) -60 );
        
        }
      }else{
        return;
      }
  }

  const reset = () =>{
    setTimer(25*60);
    setSession(25);
    setBreak(5);
    setStart(true);
    setTimerState("Session");
    clearInterval(localStorage.getItem("interval-id"));
    audio.pause();
    audio.currentTime=0;
  }

  useEffect((()=>{
    if(timer == 0 && timerState == "Session"){
      playSound();
      setTimerState("Break");
      setTimer(breaklength*60);
    }else if (timer == 0 && timerState == "Break") {
      playSound();
      setTimerState("Session");
      setTimer(session*60);
    }
  }),[timer]);
  

  const calculateTime = () =>{ 
    if(start){
      let interval = setInterval(()=>{
        setTimer((prev)=>{
            if(prev > 0){
              return prev -1;
            }   
        });
      },1000);
      localStorage.clear();
      localStorage.setItem("interval-id",interval);
    }
    
    if(!start){
      clearInterval(localStorage.getItem("interval-id"));
    }
  
    setStart(!start);
  };

  return (
  <div className="container">
    <div className="row text-center mt-5">


      <div className="break col-6 row ">

        <div id="break-label" className="col-12">Break
        
        <Button id="break-length" className="btn btn-info btn-lg btn-block" disabled>{breaklength}</Button>
        
        </div>

        <div className="col-12 mt-1">

        <Button id="break-increment" onClick={()=>brekBtn("+")} className="btn btn-warning btn-outline-dark btn-m">
          {arrowUp}
        </Button>
          
          <Button id="break-decrement" onClick={()=>brekBtn("-")} className="btn btn-danger btn-outline-dark btn-m">
            {arrowDown}
          </Button>

        </div>
      </div>


      

      <div className="session col-6 row ">
        <div id="session-label" className="col-12">Session
        
         <Button id="session-length" className="btn btn-info btn-lg btn-block" disabled>{session}</Button> 
        
        </div>
        <div className="col-12 mt-1">
          <Button id="session-increment" onClick={()=>sessionBtn("+")} className="btn btn-warning btn-outline-dark btn-m">{arrowUp}</Button>
          
          <Button id="session-decrement" onClick={()=>sessionBtn("-")} className="btn btn-danger btn-outline-dark btn-m ">{arrowDown}</Button>
        </div>
      </div>

    
    <div className="timer col-12 row mt-5">
      <div className="col-12">
       <Button id="timer-label" className="btn btn-parimary btn-lg btn-block" disabled>{timerState}</Button>
      </div>

      <div  className="col-12 mt-1"  >
        <Button id="time-left" className="btn btn-secondary btn-lg btn-block" disabled>{formatTime(timer)}</Button>
      </div>


      <div className="col-12 row mt-1">

        <Button id="start_stop"  onClick={()=>calculateTime()} className="btn btn-light btn-outline-dark btn-lg col-6 btn-block">{start? play : pause}</Button>

        <Button id="reset" onClick={()=>reset()} className="btn btn-light btn-outline-dark btn-lg col-6 btn-block">
            {resetbtn}
        </Button>

      </div>
    </div>
    </div>
  </div>
  );
}

export default App;
