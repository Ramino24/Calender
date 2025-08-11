document.addEventListener('DOMContentLoaded', function () {
    const monthYear = document.getElementById('month-year');
    const daysContainer = document.getElementById('days');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    let currentDate = new Date();
    let today = new Date();



    // ADD THESE NEW VARIABLES HERE:
    const selectedDateEl = document.getElementById('selected-date');
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    let selectedDate = null;
    let tasks = {}; // Store tasks in memory
    let taskIdCounter = 0;

    function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDay = new Date(year, month + 1, 0).getDate();

        monthYear.textContent = `${months[month]} ${year}`;

        daysContainer.innerHTML = '';

        // previous month's dates
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = firstDay; i > 0; i--) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = prevMonthLastDay - i + 1;
            dayDiv.classList.add('fade');
            daysContainer.appendChild(dayDiv);
        }

        // Current month's dates
        // for(let i = 1; i <= lastDay; i++) {
        //     const dayDiv = document.createElement('div');
        //     dayDiv.textContent = i;
        //     if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
        //         dayDiv.classList.add('today');
        //     }
        //     daysContainer.appendChild(dayDiv);
        // }



        // Current month's dates
for(let i = 1; i <= lastDay; i++) {
    const dayDiv = document.createElement('div');
    const dayNumber = document.createElement('span');
    dayNumber.textContent = i;
    dayDiv.appendChild(dayNumber);
    
    const dateString = getDateString(year, month, i);
    dayDiv.dataset.date = dateString;
    
    if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
        dayDiv.classList.add('today');
    }
    
    // Check if this date has tasks
    if (tasks[dateString] && tasks[dateString].length > 0) {
        dayDiv.classList.add('has-tasks');
        // const indicator = document.createElement('div');
        // indicator.classList.add('task-indicator');
        // dayDiv.appendChild(indicator);
    }
    
    // Add click event listener
    dayDiv.addEventListener('click', function() {
        selectDate(year, month, i);
    });
    
    daysContainer.appendChild(dayDiv);
}

        // Next month's dates
        const nextMonthStartDay = 7 - new Date(year, month + 1, 0).getDay() - 1;
        for (let i = 1; i <= nextMonthStartDay; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = i;
            dayDiv.classList.add('fade');
            daysContainer.appendChild(dayDiv);
        }
    }



        function getDateString(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function selectDate(year, month, day) {
    selectedDate = { year, month, day };
    const dateString = getDateString(year, month, day);
    
    selectedDateEl.textContent = `Tasks for ${months[month]} ${day}, ${year}`;
    taskInput.disabled = false;
    addTaskBtn.disabled = false;
    
    renderTasks(dateString);
    
    // Highlight selected date
    document.querySelectorAll('.days div').forEach(d => d.classList.remove('selected'));
    const selectedDayEl = document.querySelector(`[data-date="${dateString}"]`);
    if (selectedDayEl) {
        selectedDayEl.style.backgroundColor = '#444';
    }
}

function renderTasks(dateString) {
    const dayTasks = tasks[dateString] || [];
    taskList.innerHTML = '';
    
    if (dayTasks.length === 0) {
        const noTasksMsg = document.createElement('div');
        noTasksMsg.classList.add('no-tasks');
        noTasksMsg.textContent = 'No tasks for this date';
        taskList.appendChild(noTasksMsg);
        return;
    }
    
    dayTasks.forEach(task => {
        const li = document.createElement('li');
        li.classList.add('task-item');
        
        const taskText = document.createElement('span');
        taskText.classList.add('task-text');
        if (task.completed) taskText.classList.add('completed');
        taskText.textContent = task.text;
        
        const actions = document.createElement('div');
        actions.classList.add('task-actions');
        
        const completeBtn = document.createElement('button');
        completeBtn.classList.add('task-btn', 'complete-btn');
        completeBtn.innerHTML = task.completed ? '<i class="fa-solid fa-undo"></i>' : '<i class="fa-solid fa-check"></i>';
        completeBtn.onclick = () => toggleTask(dateString, task.id);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('task-btn', 'delete-btn');
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
        deleteBtn.onclick = () => deleteTask(dateString, task.id);
        
        actions.appendChild(completeBtn);
        actions.appendChild(deleteBtn);
        
        li.appendChild(taskText);
        li.appendChild(actions);
        taskList.appendChild(li);
    });
}

function addTask() {
    if (!selectedDate || !taskInput.value.trim()) return;
    
    const dateString = getDateString(selectedDate.year, selectedDate.month, selectedDate.day);
    
    if (!tasks[dateString]) {
        tasks[dateString] = [];
    }
    
    tasks[dateString].push({
        id: ++taskIdCounter,
        text: taskInput.value.trim(),
        completed: false
    });
    
    taskInput.value = '';
    renderTasks(dateString);
    renderCalendar(currentDate); // Re-render to show task indicator
}

function toggleTask(dateString, taskId) {
    const dayTasks = tasks[dateString];
    const task = dayTasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderTasks(dateString);
    }
}

function deleteTask(dateString, taskId) {
    tasks[dateString] = tasks[dateString].filter(t => t.id !== taskId);
    if (tasks[dateString].length === 0) {
        delete tasks[dateString];
    }
    renderTasks(dateString);
    renderCalendar(currentDate); // Re-render to remove task indicator if needed
}


    prevButton.addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    
    nextButton.addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });


    renderCalendar(currentDate);

     addTaskBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});