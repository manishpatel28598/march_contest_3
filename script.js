const todayDiv = document.querySelector('.today');
const futureDiv = document.querySelector('.future');
const completedDiv = document.querySelector('.completed'); 

const itemInput = document.getElementById('itemName');
const priorityInput = document.getElementById('selectPriority');
const dateInput = document.getElementById('calendar');
const addItemBtn = document.querySelector('.btn');

// Adding task already present in local storage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
tasks.forEach((obj,idx)=>{
    let {name, date, priority} = obj;
    let taskDiv = makeItem(name,priority,date);
    if(obj.completed==true){
        addTaskToList(taskDiv,date,name,priority,true);
    }else{
        addTaskToList(taskDiv,date,name,priority,false);
    }
});


// adding task on clicking add Item Button
addItemBtn.addEventListener('click',(e)=>{
    console.log('add item pressed');
    let itemName = itemInput.value;
    let priority = priorityInput[priorityInput.selectedIndex].textContent;
    let date = dateInput.value;
    if(itemName && priority && date){
        console.log('all values entered');
        let formattedDate = new Date(date).toLocaleDateString('en-GB', {day: 'numeric', month: 'numeric', year: 'numeric'});
        let taskDiv = makeItem(itemName,priority,formattedDate);
        addTaskToList(taskDiv,formattedDate,itemName,priority,false);
        // set added task to local storage
        let arr = JSON.parse(localStorage.getItem('tasks'))||[];
        let obj = {
            name:itemName,
            date:formattedDate,
            priority:priority,
            completed:false
        }
        arr.push(obj);
        localStorage.setItem('tasks',JSON.stringify(arr));
        }else{
            throw Error('Enter all values');
        }
})



function makeItem(itemName,priority,date){
    let div = document.createElement('div');
    div.innerHTML=`
        <div>${itemName}</div>
        <div>Priority: ${priority}</div>
        <div>${date}</div>
        <div id="taskIcon">
            <img src="./icons/check-circle.png" id="check" alt="mark complete">
            <img src="./icons/trash.png" id="trash" alt="delete">
        </div>
    `;

    return div;
}

function addTaskToList(taskDiv,date,itemName,priority,completed){
    taskDiv.classList.add('task');
    const today = new Date();
    const todayDateString = today.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }); // Format: dd-mm-yyyy

    const parts = date.split('-');
    const formattedDate = `${parts[0]}-${parts[1]}-${parts[2]}`; // Format: dd-mm-yyyy

    const selectedDateString = formattedDate;

    let checkBtn = taskDiv.querySelector('#check');
    let trashBtn = taskDiv.querySelector('#trash');
    if (completed) {
        completedDiv.append(taskDiv);
        checkBtn.classList.add('hide');
        taskDiv.style.color='black';
        taskDiv.style.backgroundColor='white';
        trashBtn.setAttribute('src', 'images/trash-black.png');
    } else {
        if (todayDateString === selectedDateString) todayDiv.append(taskDiv);
        else futureDiv.append(taskDiv);
    }


    addEventToBtns(checkBtn,trashBtn,taskDiv,itemName,priority,formattedDate);
}

function addEventToBtns(checkBtn,trashBtn,taskDiv,itemName,priority,date){
    checkBtn.addEventListener('click',(e)=>{//move task to completed tasks
        completedDiv.appendChild(taskDiv);
        checkBtn.classList.add('hide');
        taskDiv.style.color='black';
        taskDiv.style.backgroundColor='white';
        trashBtn.setAttribute('src', 'images/trash-black.png');
        //change localStorage completes:true
        let arr = JSON.parse(localStorage.getItem('tasks')) || [];
        for (let obj of arr) {
            if (obj.name === itemName) {
                obj.completed = true;
                break;
            }
        }
        localStorage.setItem('tasks', JSON.stringify(arr));
;
    })
    trashBtn.addEventListener('click',(e)=>{//delete tasks
        taskDiv.remove();
        //remove from localStorage
        let arr = JSON.parse(localStorage.getItem('tasks')) || [];
        arr = arr.filter(obj=>obj.name!==itemName);
        localStorage.setItem('tasks',JSON.stringify(arr));
    })
}