
let taskIdCounter = 1;
let array = [];
//הוספת אירוע להגשת הטופס
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("taskForm").addEventListener("submit", function (event) {
        event.preventDefault(); // מונע שליחה רגילה
        addTask(); // רק אם כל השדות מולאו, כי required כבר נבדק אוטומטית
    });
});

// פונקציה לטעינת המשימות מה-localStorage
document.addEventListener('DOMContentLoaded', function() {
    loadTasks(); // קריאה לפונקציה loadPage אחרי שהדף נטען
});



function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks'));

    if (Array.isArray(tasks) && tasks.length > 0) {
        const now = new Date();
        array = [];

        const validTasks = tasks.filter(task => {
            // בניית אובייקט תאריך מלא מהתאריך והשעה של המשימה
            const taskDateTime = new Date(`${task.date}T${task.time}`);
            
            // מחזיר true רק אם זמן המשימה עוד לא עבר
            return taskDateTime.getTime() > now.getTime();
        });

        // עדכון המערך הפנימי
        array = validTasks;

        // חישוב ה-ID הגבוה ביותר רק מהמשימות התקפות
        const maxId = Math.max(
            0,
            ...validTasks.map(task => {
                const idMatch = task.id.match(/\d+/);
                return idMatch ? parseInt(idMatch[0]) : 0;
            })
        );
        taskIdCounter = maxId + 1;

        // הוספת המשימות התקפות בלבד
        validTasks.forEach(task => {
            createTaskElement(task);
        });

        // עדכון ב-localStorage (אם תרצה למחוק גם את המשימות הלא רלוונטיות)
        localStorage.setItem('tasks', JSON.stringify(validTasks));
    } else {
        taskIdCounter = 1;
    }
}




// פונקציה ליצירת משימה בדף
function createTaskElement(task) {
    let newTask = document.createElement('div');
    newTask.id = task.id;
    newTask.innerHTML = `
        <div class="newTask" >
           <p class="contents"> ${task.taskD}</p>
            <div class="timeDate">${task.date } ${task.time}</div>
            <i class="fas fa-times delete-btn"></i> 
        </div> `;
    let addTheTasks = document.getElementById('addTheTasks');
    addTheTasks.appendChild(newTask);

    //לפי הID  הוספת אירוע למחיקת משימה
    let deleteBtn = newTask.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function() {
      removeTask(newTask);
    });
    
}
// פונקציה להוספת משימה
function addTask() {
    //לוקחים את הנתונים מהטופס
    let data = document.getElementById('data');
    let date = document.getElementById('date');
    let time = document.getElementById('time');

    //הגדרת האזור שאליו יכנסו המסימות
    let addTheTasks = document.getElementById('addTheTasks');
    let newTask = document.createElement('div');
    //הוספת העיצוב של הפתקית
    newTask.classList.add('newTask');
    let contents = document.createElement('div');
    contents.innerText=data.value;
    newTask.appendChild(contents);

    newTask.innerText = data.value;
    contents.classList.add('contents');


    // הוספת ID ייחודי
    newTask.id = `task-${taskIdCounter}`;
    taskIdCounter++;

    //יצירת האיזור של הזמן והשעה
    let timeDate = document.createElement('div');
    timeDate.classList.add('timeDate');
    timeDate.innerText = `${date.value}`;
    timeDate.innerText = `${date.value} ${time.value}`;

    newTask.appendChild(timeDate);
    //הכנסת  הפתקית לתוך אזור המשימות
    addTheTasks.appendChild(newTask);

    //יצירת כפתור סגירה לפתקית
             icon = document.createElement('i');
         icon.classList.add('fas' ,'fa-times');
         newTask.appendChild(icon);
          icon.classList.add('icon');
//יצירת אירוע  בעת לחיצה על כפתור סגירה
          icon.addEventListener('click', function () {
            removeTask(newTask);
        });
    let timeTask = new Date(date.value + " " + time.value).getTime();
    let now = new Date();
        let obj = { taskD: data.value, date: date.value, time: time.value , id: newTask.id};
        array.push(obj);
  
    updateLocalStorage();
}

// עדכון ה-localStorage אחרי שינוי במערך המשימות
function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(array));
}


function removeTask(newTask){
    newTask.remove();  
     // הסרת המשימה מתוך המערך לפי ה-id
    array = array.filter(task => task.id !== newTask.id);
    updateLocalStorage();
}


