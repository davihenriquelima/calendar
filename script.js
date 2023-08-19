// Seleção de elementos do DOM
let currentDateEl = document.querySelector('.actual-date');
let currentDateSelected = document.querySelector('.current-date-selected');
let currentHourEl = document.querySelector('.actual-hour');
let controlNext = document.querySelector('.control.next');
let controlPrev = document.querySelector('.control.prev');
let monthDayCells = document.querySelectorAll('.month-day--cell');
let monthAndYearCalendar = document.querySelector('.month-calendar');

// Arrays de dias da semana e meses
const weekDaysArray = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
const monthsArray = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro', 'Outubro', 'Novembro', 'Dezembro'];

// Atribuição do atributo week-day-cell às células dos dias da semana. Servirá para pegar o primeiro dia de cada mês e armazenar na célula correta, para a partir dela os outros dias serem adicionados nas células
for(let cell in monthDayCells) {
    if(monthDayCells.hasOwnProperty(cell)) { // *explicação no final
        let weekdayAtt = weekDaysArray[cell % weekDaysArray.length];
        monthDayCells[cell].setAttribute('week-day-cell', weekdayAtt.toLowerCase());
    }
}

// Variáveis globais
const date = new Date();
let currentYear = 0; // Ano atual de fato
let currentMonthNumber = 0; // número do mes atual
let currentDay = 0; // dia atual 
let currentWeekDayNumber = 0; // número do dia da semana atual
let hour = 0;
let minutes = 0;
let seconds = 0;
let currentMonth; // mês atual
let currentWeekDay; // dia da semana atual

let firstDayOfMonth = 0;// variável que vai receber o primeiro dia do mês atual, ex: 01/05/2023
let weekDayFirstDay = 0; // vai receber o numero do dia da semana em que cai o dia 1 do mês (1 = segunda)
let lastDayOfMonth = 0; // vai receber o último dia do mês atual baseado no próximo mes menos 1 (0)
let currentMonthDaysCalendar ; // variável que vai receber array onde serão colocados todos os dias do mês atual

let currentYearCalendar; // usada em currentDateCalendar
let currentMonthCalendarNum; // usada em currentDateCalendar
let currentMonthCalendar; // usada em fillCalendar

let selectedDayCell = null; // será usada em fillCalendar para armazenar a célula selecionada
let selectedDay = null; // será usada em fillCalendar para armazenar o dia da célula selecionada
let clickedDay = null; // será usada em fillCalendar para armazenar o dia da célula clicada
// podem ter o valor alterado conforme a necessidade do trecho do código

// functions

// Função para formatar números menores que 10 com um zero à esquerda
function fix(time) {
    return time < 10 ? `0${time}` : time;
}

// Função para exibir a data e hora atual
function todaysDate() {

    const date = new Date();
    currentYear = date.getFullYear();
    currentDay = date.getDate();
    currentMonthNumber = date.getMonth();
    currentWeekDayNumber = date.getDay();
    hour = date.getHours();
    minutes = date.getMinutes();
    seconds = date.getSeconds();

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

// Função para preencher o calendário com os dias do mês
function fillCalendar(year, monthNum) {
    
    for(let i in monthsArray) {
        if(monthsArray.indexOf(monthsArray[i % monthsArray.length]) === monthNum % monthsArray.length) {
            currentMonthCalendar = monthsArray[i];
        }
    }
    monthAndYearCalendar.innerHTML = `${currentMonthCalendar} de ${year}`;

    firstDayOfMonth = new Date(year, monthNum, 1);// definindo o primeiro dia do mês atual, ex: 01/05/2023
    weekDayFirstDay = firstDayOfMonth.getDay(); // numero do dia da semana em que cai o dia 1 do mês (1 = segunda)
    lastDayOfMonth = new Date(year, monthNum+1,0).getDate(); // último dia do mês atual baseado no próximo mes menos 1 (0)
    currentMonthDaysCalendar = []; // array com todos os dias do mês atual

    for (let i = firstDayOfMonth.getDate(); i <= lastDayOfMonth; i++) {
        currentMonthDaysCalendar.splice(i-1,1, i); // replaces and adds each day of the month to the array
    }
    
    let weekDayCells = []; // array que vai receber o valor do week-day-cell attribute setado antes
    let weekDayIndex; // variável que vai receber o index equivalente em weeDayFirstDay e weekDayCells[i]
    
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

    let qtOfPrevItems = 0;
    let prevMonthDays = [];
    let actualPrevDate = 0;
    let qtOfNextItems = 0;
    let nextMonthDays = [];
    let actualNextDate = 0;

    for(let i=0; i<=monthDayCells.length;i++) {
    
        if(monthDayCells.hasOwnProperty(i)){
            monthDayCells[i].classList.remove('previous-days', 'next-days');

            if(i<weekDayIndex) {

                qtOfPrevItems++;
                actualPrevDate = new Date(year, monthNum, 1-qtOfPrevItems).getDate();
                prevMonthDays.push(actualPrevDate);
                prevMonthDays.sort((a,b)=> a-b);
                prevMonthDays.forEach((day, index)=>{
                    monthDayCells[index].innerHTML = day;
                })
                monthDayCells[i].classList.add('previous-days');

            } else if ((i-qtOfPrevItems) >= lastDayOfMonth){

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

    monthDayCells.forEach((i)=> {
        i.classList.remove('today');
        
        if(i.classList.contains('previous-days') || i.classList.contains('next-days')){
            
            i.addEventListener('click', changeMonth);
           
            return;

        } else {
            i.removeEventListener('click', changeMonth);

            let stringCurrentMonth = monthAndYearCalendar.innerHTML;

            if(currentMonthNumber === monthNum && parseInt(i.innerHTML) === currentDay && stringCurrentMonth.includes(currentYear.toString())){
                i.classList.add('today');
            }

            if(selectedDayCell === null && i.classList.contains('today')){
                i.classList.add('selected');
                selectedDayCell = i;
            }

            if(selectedDayCell !== null) {
                selectedDay = selectedDayCell.innerHTML;
                currentDateSelected.innerHTML = `${parseInt(selectedDay)} de ${currentMonthCalendar} de ${year} `;
            }

            i.addEventListener('click', (e)=>{
                const clickedCell = e.target;

                if(selectedDayCell !== null) {
                    selectedDayCell.classList.remove('selected');
                }

                clickedCell.classList.add('selected');
                selectedDayCell = clickedCell;

                selectedDay = clickedCell.innerHTML;
                currentDateSelected.innerHTML = `${parseInt(selectedDay)} de ${currentMonthCalendar} de ${year}`;
            })
        }
    })
}

// Função para atualizar as variáveis do calendário com a data atual
function updateCalendarVariables(realYear, realMonthNum) {
    currentYearCalendar = realYear;
    currentMonthCalendarNum = realMonthNum;
    fillCalendar(currentYearCalendar, currentMonthCalendarNum);
}

// Função para atualizar o calendário com a data atual
function currentDateCalendar() {
    let realDate = new Date();
    let realYear = realDate.getFullYear();
    let realMonthNum = realDate.getMonth();

    if(typeof currentYearCalendar == 'number' && typeof currentMonthCalendarNum == 'number') {
        if (currentYearCalendar !== realYear || currentMonthCalendarNum !== realMonthNum) {
            fillCalendar(currentYearCalendar, currentMonthCalendarNum);
        } else {
            updateCalendarVariables(realYear, realMonthNum);
        }
    } else {
        updateCalendarVariables(realYear, realMonthNum);
    }
}

// Função para mudar de mês no calendário
function changeMonth(e) {
    let isControlButton = false;
    
    monthDayCells.forEach((cell) => {
        if (selectedDayCell !== null && cell === selectedDayCell) {
            selectedDay = selectedDayCell.innerHTML;
            selectedDayCell.classList.remove('selected');
            selectedDayCell = null;
        }
    });

    const clickedElement = e.currentTarget;

    if(clickedElement.classList.contains('previous-days') || clickedElement.classList.contains('next-days')) {
        clickedDay = clickedElement.innerHTML;
    } else if (clickedElement.classList.contains('control')) {
        isControlButton = true;
    }

    if(clickedElement.classList.contains('previous-days') || clickedElement.classList.contains('prev')) {
        currentMonthCalendarNum--;
        if(currentMonthCalendarNum < 0) {
            currentMonthCalendarNum = 11;
            currentYearCalendar--;
        }

    } else if(clickedElement.classList.contains('next-days') || clickedElement.classList.contains('next')) {
        currentMonthCalendarNum++;
        if(currentMonthCalendarNum > 11) {
            currentMonthCalendarNum = 0;
            currentYearCalendar++;
        }
    }

    fillCalendar(currentYearCalendar, currentMonthCalendarNum);
    
    monthDayCells.forEach((cell)=>{
        if(!cell.classList.contains('previous-days') && !cell.classList.contains('next-days')){
            if(isControlButton) {
                if(cell.innerHTML === selectedDay) {
                    cell.classList.add('selected');
                    selectedDayCell = cell;
                    selectedDay = selectedDayCell.innerHTML;
                } else if(parseInt(selectedDay) > parseInt(cell.innerHTML) && cell.innerHTML === lastDayOfMonth.toString()){
                    cell.classList.add('selected');
                    selectedDayCell = cell;
                    selectedDay = selectedDayCell.innerHTML;
                }
            } else if (!isControlButton && cell.innerHTML === clickedDay) {
                cell.classList.add('selected');
                selectedDayCell = cell;
                selectedDay = selectedDayCell.innerHTML;
            }
        }
    })

    currentDateSelected.innerHTML = `${parseInt(selectedDay)} de ${monthsArray[currentMonthCalendarNum]} de ${currentYearCalendar}`;
}

// Exibe a data atual e inicia os intervalos para atualizar a data e o calendário
todaysDate();
setInterval(todaysDate, 500);
setInterval(currentDateCalendar, 500);

controlNext.addEventListener('click', (e)=>{changeMonth(e)});
controlPrev.addEventListener('click', (e)=>{changeMonth(e)});

/* 
Foi necessário fazer essa verificação com hasOwnProperty porque usamos a iteração "for...in",
que percorre também sobre propriedades herdadas de um objeto Nodelist,como por exemplo: length, keys... 
Verificando assim, o código dentro do "if" usa apenas as propriedades não herdadas do objeto, ou seja,
os itens armazenados na Nodelist e não as propriedades herdadas de um objeto.prototype. 
Usei apenas como teste, em outros momentos usei o for..of, ou até mesmo o forEach, para a iteração 
ser mais efetiva. Usar ou não, depende da intenção do seu código e contexto.
*/