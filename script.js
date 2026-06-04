// Smooth scroll til navigation links

document.querySelectorAll('a.nav-link').forEach(link => {

    link.addEventListener('click', function(e){

        e.preventDefault();

        const targetId = this.getAttribute('href');

        const targetSection = document.querySelector(targetId);

        if(targetSection){

            window.scrollTo({
                top: targetSection.offsetTop - 70,
                behavior: 'smooth'
            });

        }

    });

});


// Knap animation

const button = document.querySelector('.main-btn');

button.addEventListener('mouseenter', function(){

    button.style.transform = 'scale(1.05)';

});

button.addEventListener('mouseleave', function(){

    button.style.transform = 'scale(1)';

});

/* Mine Opgaver Section */
function addTask(){

    let input = document.getElementById("taskInput");

    let taskText = input.value;

    if(taskText === ""){
        alert("Skriv en opgave først");
        return;
    }

    let li = document.createElement("li");

    li.textContent = taskText;

    document.getElementById("taskList").appendChild(li);

    input.value = "";

}
/* Dashborad-side */
function addTask(){

    let input = document.getElementById("taskInput");
    let taskList = document.getElementById("taskList");

    if(input.value === ""){
        alert("Skriv en opgave først");
        return;
    }

    let li = document.createElement("li");
    li.textContent = input.value;

    taskList.appendChild(li);

    input.value = "";
}