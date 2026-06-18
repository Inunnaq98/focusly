// Beskyt dashboardet
if(window.location.pathname.includes("dashboard.html")){
    const user = localStorage.getItem("focuslyUser");

    if(!user){
        window.location.href = "log-in.html";
    }
}

// Login
function loginUser(event){
    event.preventDefault();

    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    let savedUser = JSON.parse(localStorage.getItem("focuslyAccount"));

    if(!savedUser){
        alert("Der findes ingen konto. Opret en konto først.");
        return;
    }

    if(email === savedUser.email && password === savedUser.password){
        localStorage.setItem("focuslyUser", savedUser.email);
        localStorage.setItem("focuslyUserName", savedUser.name);
        window.location.href = "dashboard.html";
    }
    else{
        alert("Forkert email eller adgangskode");
    }
}


// Logout
function logoutUser(){
    localStorage.removeItem("focuslyUser");
    localStorage.removeItem("focuslyUserName");

    updateNavbar();

    window.location.href = "log-in.html";
}

/*register*/
function registerUser(event){
    event.preventDefault();

    let name = document.getElementById("registerName").value;
    let email = document.getElementById("registerEmail").value;
    let password = document.getElementById("registerPassword").value;

    if(name === "" || email === "" || password === ""){
        alert("Udfyld alle felter");
        return;
    }

    let account = {
        name: name,
        email: email,
        password: password
    };

    localStorage.setItem("focuslyAccount", JSON.stringify(account));

    alert("Din konto er oprettet! Du kan nu logge ind.");

    window.location.href = "log-in.html";
}

// Velkomst på dashboard
const user = localStorage.getItem("focuslyUser");

if(user){
    const welcomeText = document.getElementById("welcomeUser");

    if(welcomeText){
    let userName = localStorage.getItem("focuslyUserName");

    if(userName){
        welcomeText.innerHTML = "Velkommen tilbage 👋 " + userName;
    }
    else{
        welcomeText.innerHTML = "Velkommen tilbage 👋 " + user;
    }
    }
}

// Opgaver
let tasks = JSON.parse(localStorage.getItem("focuslyTasks")) || [];

function addTask(){
    let taskInput = document.getElementById("taskInput");
    let deadlineInput = document.getElementById("deadlineInput");
    let priorityInput = document.getElementById("priorityInput");

    if(!taskInput || !deadlineInput || !priorityInput){
        return;
    }

    if(taskInput.value === "" || deadlineInput.value === ""){
        alert("Udfyld både opgave og deadline");
        return;
    }

    let task = {
    title: taskInput.value,
    deadline: deadlineInput.value,
    priority: priorityInput.value,
    completed: false
};

    tasks.push(task);
    localStorage.setItem("focuslyTasks", JSON.stringify(tasks));

    taskInput.value = "";
    deadlineInput.value = "";
    priorityInput.value = "Lav";

    showTasks();
    updateDashboardStats();
}

function showTasks(){
    let taskList = document.getElementById("taskList");

    if(!taskList){
        return;
    }

    taskList.innerHTML = "";

    tasks.sort(function(a,b){
        return new Date(a.deadline) - new Date(b.deadline);
    });

    tasks.forEach(function(task, index){

        if(task.completed){
            return;
        }

        let li = document.createElement("li");

        li.innerHTML = `
            <strong>${task.title}</strong><br>
            📅 Deadline: ${task.deadline}<br>
            ⭐ Prioritet: ${task.priority}
            <br>

            <button onclick="completeTask(${index})" class="complete-btn">
                ✓ Færdig
            </button>

            <button onclick="deleteTask(${index})" class="delete-task-btn">
                Slet
            </button>
        `;

        taskList.appendChild(li);
    });

    updateProgress();
    showCompletedTasks();
}



function deleteTask(index){
    tasks.splice(index, 1);
    localStorage.setItem("focuslyTasks", JSON.stringify(tasks));

    showTasks();
    updateDashboardStats();
    updateFocusTasks();
}

function completeTask(index){
    tasks[index].completed = true;

    localStorage.setItem("focuslyTasks", JSON.stringify(tasks));

    showTasks();
    updateDashboardStats();
}

function showCompletedTasks(){
    let completedList = document.getElementById("completedTaskList");

    if(!completedList){
        return;
    }

    completedList.innerHTML = "";

    tasks.forEach(function(task){
        if(task.completed === true){
            let li = document.createElement("li");
            li.innerHTML = "✅ " + task.title;
            completedList.appendChild(li);
        }
    });
}

// Automatisk statistik
function updateDashboardStats(){
    const taskCount = tasks.length;

    const today = new Date().toISOString().split("T")[0];

    const deadlinesToday = tasks.filter(function(task){
        return task.deadline === today;
    }).length;

    const focusTasks = Math.min(taskCount, 3);

    let stressLevel = "Lav";
    let stressWidth = "30%";
    let stressColor = "#4CAF50";

    if(taskCount >= 4 && taskCount <= 6){
        stressLevel = "Medium";
        stressWidth = "60%";
        stressColor = "#FFD43B";
    }

    if(taskCount >= 7){
        stressLevel = "Høj";
        stressWidth = "90%";
        stressColor = "#FF4D4D";
    }

    const taskCountBox = document.getElementById("taskCount");
    const deadlineTodayBox = document.getElementById("deadlineToday");
    const focusCountBox = document.getElementById("focusCount");
    const stressLevelBox = document.getElementById("stressLevel");
    const stressText = document.getElementById("stressText");
    const stressFill = document.getElementById("stressFill");

    if(taskCountBox){
        taskCountBox.innerHTML = taskCount;
    }

    if(deadlineTodayBox){
        deadlineTodayBox.innerHTML = deadlinesToday;
    }

    if(focusCountBox){
        focusCountBox.innerHTML = focusTasks;
    }

    if(stressLevelBox){
        stressLevelBox.innerHTML = stressLevel;
    }

    if(stressText){
        stressText.innerHTML = stressLevel + " belastning";
    }

    if(stressFill){
        stressFill.style.width = stressWidth;
        stressFill.style.background = stressColor;
    }
}

showTasks();
updateDashboardStats();

function updateProgress(){
    let progressBar = document.getElementById("progressBar");

    if(!progressBar){
        return;
    }

    let completedTasks = tasks.filter(function(task){
        return task.completed;
    }).length;

    let percentage = 0;

    if(tasks.length > 0){
        percentage = Math.round((completedTasks / tasks.length) * 100);
    }

    progressBar.style.width = percentage + "%";
    progressBar.innerHTML = percentage + "%";
}

function updateFocusTasks(){
    const focusTaskList = document.getElementById("focusTaskList");

    if(!focusTaskList){
        return;
    }

    focusTaskList.innerHTML = "";

    let activeTasks = tasks.filter(function(task){
        return !task.completed;
    });

    activeTasks.sort(function(a,b){
        return new Date(a.deadline) - new Date(b.deadline);
    });

    let focusTasks = activeTasks.slice(0,3);

    focusTasks.forEach(function(task, index){
        let li = document.createElement("li");

        li.innerHTML = `
            <span>${index + 1}</span>
            ${task.title}
        `;

        focusTaskList.appendChild(li);
    });
}

showTasks();
updateDashboardStats();
showCompletedTasks();


function updateNavbar(){
    const user = localStorage.getItem("focuslyUser");

    const loginNav = document.getElementById("loginNav");
    const logoutNav = document.getElementById("logoutNav");

    if(loginNav && logoutNav){

        if(user){
            loginNav.style.display = "none";
            logoutNav.style.display = "block";
        }
        else{
            loginNav.style.display = "block";
            logoutNav.style.display = "none";
        }

    }
}

updateNavbar();


function sendContactMessage(event){
    event.preventDefault();

    let navn = document.getElementById("navn").value;
    let email = document.getElementById("email").value;
    let besked = document.getElementById("besked").value;
    let success = document.getElementById("contactSuccess");

    if(navn === "" || email === "" || besked === ""){
        alert("Udfyld navn, email og besked");
        return;
    }

    success.innerHTML = "Tak for din besked  Vi vender tilbage hurtigst muligt.";
    success.style.color = "#4CAF50";
    success.style.marginTop = "20px";
    success.style.textAlign = "center";
    success.style.fontWeight = "600";

    document.getElementById("contactForm").reset();
}
