// elements
let currentDateEl = document.querySelector('.actual-date');
let currentHourEl = document.querySelector('.actual-hour');
let controlNext = document.querySelector('.control.next');
let controlPrev = document.querySelector('.control.prev');


// fixed global variables
let weekDaysArray = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
let monthsArray = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro', 'Outubro', 'Novembro', 'Dezembro'];


// Atributo fixo das células dos dias das semanas
let monthDayCells = document.querySelectorAll('.month-day--cell');
for(let cell in monthDayCells) {
    if(monthDayCells.hasOwnProperty(cell)) { // Se o objeto possui a propriedade não herdada "cell"(argumento que recebe o item do objeto definido no for) **
        let weekdayAtt = weekDaysArray[cell % weekDaysArray.length];
        monthDayCells[cell].setAttribute('week-day-cell', weekdayAtt.toLowerCase());
    }
}


// functions
function update() {
    //preenchendo a data e hora atual
    const date = new Date();
    let currentYear = date.getFullYear();
    let currentMonthNumber = date.getMonth();
    let currentDay = date.getDate();
    let currentWeekDayNumber = date.getDay();
    let currentMonth;
    let currentWeekDay;
    let hour = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    for(let i in monthsArray) {
        if(monthsArray.indexOf(monthsArray[i]) === currentMonthNumber) {
            currentMonth = monthsArray[i];
        }
    }
    for(let i in weekDaysArray) {
        if(weekDaysArray.indexOf(weekDaysArray[i]) === currentWeekDayNumber) {
            currentWeekDay = weekDaysArray[i];
        }
    }

    currentDateEl.innerHTML = `${currentWeekDay}, ${currentDay} de ${currentMonth} de ${currentYear}`;
    currentHourEl.innerHTML = `${fix(hour)}:${fix(minutes)}:${fix(seconds)}`;

}
function fix(time) {
    return time < 10 ? `0${time}` : time;
}
update()
setInterval(()=>{
    update()
}, 050);


function fillCalendar(year, monthNum) {
    let currentMonthCalendar;
    
    for(let i in monthsArray) {
        if(monthsArray.indexOf(monthsArray[i % monthsArray.length]) === monthNum % monthsArray.length) {
            currentMonthCalendar = monthsArray[i];
        }
    }
    document.querySelector('.month-calendar').innerHTML = `${currentMonthCalendar} de ${year}`;

    let firstDayOfMonth = new Date(year, monthNum, 1);// setando o primeiro dia do mês atual, ex: 01/05/2023 
    let weekDayFirstDay = firstDayOfMonth.getDay(); // número do dia da semana em que cai o primeiro dia do mês (1 = segunda)
    let lastDayOfMonth = new Date(year, monthNum+1,0).getDate(); // último dia do mês atual, baseado no próximo mês - 1 dia
    let currentMonthDaysCalendar = []; // array com todos os dias do mês atual
    for (let i = firstDayOfMonth.getDate(); i <= lastDayOfMonth; i++) {
        currentMonthDaysCalendar.splice(i-1,1, i); // substitui e adiciona cada dia do mês no array
    }
    
    let weekDayCells = []; // array que vai receber o value do atributo week-day-cell
    let weekDayIndex; // variável que vai receber o índice equivalente em weeDayFirstDay e weekDayCells[i]
    for(let i of monthDayCells) {
        weekDayCells.push(i.getAttribute('week-day-cell'));
    }
    for (let i = 0; i < weekDayCells.length; i++) {
        if (i === weekDayFirstDay) {
          weekDayIndex = i;
          break;
        }
    }
    
    let currentDayIndex = weekDayIndex;
    for(let i in currentMonthDaysCalendar) {
        if(currentDayIndex < monthDayCells.length) {
            monthDayCells[currentDayIndex].innerHTML = currentMonthDaysCalendar[i];
            currentDayIndex++;
        }
    }

    for (let i = 0; i < monthDayCells.length; i++) {
        monthDayCells[i].classList.remove('previous-days', 'next-days');
    }
    let qtOfPrevItems = 0;
    let prevMonthDays = []
    let actualPrevDate = 0
    for(let i=0; i<=monthDayCells.length;i++) {
        if(monthDayCells.hasOwnProperty(i)){
            if(i<weekDayIndex) {
                qtOfPrevItems++;
                actualPrevDate = new Date(year, monthNum, 1-qtOfPrevItems).getDate()
                prevMonthDays.push(actualPrevDate)
                prevMonthDays.sort((a,b)=> a-b)
                prevMonthDays.forEach((day, index)=>{
                    monthDayCells[index].innerHTML = day
                })
                monthDayCells[i].classList.add('previous-days')
            }
        }
    }
    let qtOfNextItems = 0;
    let nextMonthDays = [];
    let actualNextDate = [];
    for(let i=0; i<=monthDayCells.length;i++) {
        if(monthDayCells.hasOwnProperty(i)){
            if ((i-qtOfPrevItems) >= lastDayOfMonth){
                qtOfNextItems++;
                actualNextDate = new Date(year, monthNum, lastDayOfMonth+qtOfNextItems).getDate();
                nextMonthDays.push(actualNextDate);
                nextMonthDays.forEach((day)=> {
                    monthDayCells[i].innerHTML = day;
                })
                monthDayCells[i].classList.add('next-days');
            }
        }
    }
}


let currentYearCalendar;
let currentMonthCalendarNum;
function currentDateCalendar() {
    let realDate = new Date();
    let realYear = realDate.getFullYear();
    let realMonthNum = realDate.getMonth();

    if(typeof currentYearCalendar == 'number' && typeof currentMonthCalendarNum == 'number') {
        if (currentYearCalendar !== realYear || currentMonthCalendarNum !== realMonthNum) {
            fillCalendar(currentYearCalendar, currentMonthCalendarNum);
        } else {
            currentYearCalendar = realYear
            currentMonthCalendarNum = realMonthNum
            fillCalendar(currentYearCalendar, currentMonthCalendarNum);
        }
    } else {
        currentYearCalendar = realYear
        currentMonthCalendarNum = realMonthNum
        fillCalendar(currentYearCalendar, currentMonthCalendarNum);
    }
}
setInterval(() => {
    currentDateCalendar();
}, 050);


//Events
controlNext.addEventListener('click', ()=>{
    currentMonthCalendarNum++
    if(currentMonthCalendarNum > 11) {
        currentMonthCalendarNum = 0
        currentYearCalendar++
    }
    fillCalendar(currentYearCalendar, currentMonthCalendarNum)
})
controlPrev.addEventListener('click', ()=>{
    currentMonthCalendarNum--
    if(currentMonthCalendarNum < 0) {
        currentMonthCalendarNum = 11
        currentYearCalendar--
    }
    fillCalendar(currentYearCalendar, currentMonthCalendarNum)
})


/* 
Foi necessário fazer essa verificação com hasOwnProperty pois a iteração "for... in" ocorreu
também sobre as propriedades herdadas de um object Nodelist, 
como por exemplo: length, keys... verificando dessa forma, o código dentro 
do "if" usa apenas as propriedades não herdadas do objeto, ou seja, 
os itens armazenados na Nodelist e não as propriedades de um object.prototype
*/