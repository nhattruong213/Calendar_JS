const date = new Date();
const dateSave = new Date();
let dataid = '';
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

function showCalendar() {
  
  date.setDate(1);

  const monthDays = document.querySelector(".days");

  const currentDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate(); // số ngày của tháng hiện tại

  const prevDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate(); // số ngày tháng trước đó

  const firstDayIndex = date.getDay(); // trả ngày trong tuần (0 đến 6, cn là 0)

  // console.log(firstDayIndex)

  const lastDayIndex = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDay();

  const nextDays = 7 - (lastDayIndex + 1);

  document.querySelector(".date h1").innerHTML = months[date.getMonth()];
  document.querySelector(".date p").innerHTML = new Date().toDateString();

  let days = "";

  for (let x = firstDayIndex; x > 0; x--) {
    days += `<div class="border-day prev-date border border-dark pt-3 pb-5" data-id="${new Date(date.getFullYear(), date.getMonth() - 1, (prevDay - x + 1)).toDateString()}">
    ${prevDay - x + 1}
      <ul class= "task-menu" > ${showTasksbyday(new Date(date.getFullYear(), date.getMonth() - 1, (prevDay - x + 1)).toDateString())} </ul>
    </div>`;
  }

  for (let i = 1; i <= currentDay; i++) {
    if (
      i === new Date().getDate() &&
      date.getMonth() === new Date().getMonth()
    ) {
      days += `<div class="border-day border border-dark pt-3 pb-5 today" data-id="${new Date(date.getFullYear(), date.getMonth(), i).toDateString()}">
        ${i}
        <ul class= "task-menu-day"> ${showTasksbyday(new Date(date.getFullYear(), date.getMonth(), i).toDateString())} </ul>
      </div>`;
    } else {
      days += `<div class="border-day border border-dark pt-3 pb-5" data-id="${new Date(date.getFullYear(), date.getMonth(), i).toDateString()}">
        ${i}
       <ul class= "task-menu" data-id= "${new Date(date.getFullYear(), date.getMonth(), i).toDateString()}"> ${showTasksbyday(new Date(date.getFullYear(), date.getMonth(), i).toDateString())} </ul>
       </div>`;
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="border-day next-date border border-dark pt-3 pb-5" data-id="${new Date(date.getFullYear(), date.getMonth(), j).toDateString()}">
    ${j}
    <ul class= "task-menu"> ${showTasksbyday(new Date(date.getFullYear(), date.getMonth(), j).toDateString())} </ul>
    </div>`;
  }

  monthDays.innerHTML = days;
}

showCalendar();

document.querySelector(".prev").addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  showCalendar();
});

document.querySelector(".next").addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  showCalendar();
});

////********************************************************* */


const days = document.querySelector('.days');


// click vào ngày
days.addEventListener('click', (event) => {
  let modal = document.querySelector('.modal')
  modal.style.display = 'block';
  var borderday = event.target;
  var data = borderday.dataset.id;

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  }
  dataid = data;
  if (data === undefined) {
    modal.style.display = 'none';
  } else {
    document.querySelector(".aa p").innerHTML = data;
    document.querySelector(".date p").innerHTML = data;
  }
  showTasks();
});

//

const addBtn = document.querySelector(".inputField button");
const inputBox = document.querySelector(".inputField input");
const todoList = document.querySelector(".todoList")

inputBox.onkeyup = () => {
  let value_input = inputBox.value;

  if (value_input.trim() != 0) {
    addBtn.classList.add("active");
  } else {
    addBtn.classList.remove("active");
  }
};

addBtn.addEventListener('click', () => {
  let inputValue = inputBox.value;
  let getLocalStorageData = localStorage.getItem("New todo");
  let listArray = [];
  if (dataid === undefined) {
    return false
  }
  if (inputValue.trim() == 0) {
    return false
  }

  if (getLocalStorageData != null) {
    listArray = JSON.parse(getLocalStorageData);
  } 
  /// kieem tra id da ton tai chua 
  const checkList = listArray.filter(function (item) {
    return item.date === dataid
  });

  if (checkList.length) {
    listArray.map(function (item) {
      const task = { ...item };
      if (task.date === checkList[0].date) {
        task.content.unshift(inputValue);
      }
    });
  }
  else {
    listArray.push({
      date: dataid,
      content: [
        inputValue,
      ]
    })
  }
  localStorage.setItem("New todo", JSON.stringify(listArray));
  showTasks();
  addBtn.classList.remove("active");
  showCalendar();

});
function showTasks() {
  let getLocalStorageData = localStorage.getItem("New todo");
  let listArray = [];
  let newLi = '';
  let dataTask = [];
  if (getLocalStorageData != null) {
    listArray = JSON.parse(getLocalStorageData);
  } 
  const check = listArray.filter(function (item) {
    return item.date === dataid
  });
  if (check.length) {
    check.map((element) => {
      return dataTask.push(element.content);
    });
    dataTask[0].map((element, index) => {
      return newLi += `<li>
      ${element}
      <button onclick="editTask(${index})" class="btnEdit">✔</button>
      <span class="icon" onclick="deleteTask(${index})"><i class="fas fa-trash"></i></span></li>`;
    });
  }
  todoList.innerHTML = newLi;
  inputBox.value = "";
}
function deleteTask(index) {
  let getLocalStorageData = localStorage.getItem("New todo");
  listArray = JSON.parse(getLocalStorageData);

  const findId = listArray.filter(function (item) {
    return item.date === dataid
  });

  if (findId.length) {
    findId.map((item) => {
      item.content.splice(index, 1);
    })
  }
  // xóa nếu content rỗng
  listArray.map((item, index)=> {
    if(item.content == '') {
      listArray.splice(index,1);
    }
  })
  localStorage.setItem("New todo", JSON.stringify(listArray));
  showTasks();
  showCalendar();
}
function showTasksbyday(id) {
  let data = [];
  let newLi = '';
  listArray = [];
  let getLocalStorageData = localStorage.getItem("New todo");
  if (getLocalStorageData) {
    listArray = JSON.parse(getLocalStorageData);
  }
  const checkList = listArray.filter(function (item) {
    return item.date === id
  });

  if (checkList.length) {
    const kqa = checkList.map((item) => {
      return data.push(item.content)
    })
    const kq = data[0].map((element, index) => {

      return newLi += `<li>${element}</li>`;
    });

    return newLi;
  } else {
    return '';
  }
}

document.querySelector('.btnYear').addEventListener('click', () => {
  let modalByYear = document.querySelector('.calendarByYear')
  modalByYear.style.display = 'block';
  window.onclick = function (event) {
    if (event.target == modalByYear) {
      modalByYear.style.display = 'none';
    }
  }
})
function showCalendarbyYear() {
  dateSave.setDate(1);
  const currentDay = new Date(
    dateSave.getFullYear(),
    dateSave.getMonth()+1,
    0
  ).getDate(); // số ngày của tháng hiện tại

  const firstDayIndex = dateSave.getDay(); // trả ngày trong tuần (0 đến 6, cn là 0)

  const lastDayIndex = new Date(
    dateSave.getFullYear(),
    dateSave.getMonth()+1,
    0
  ).getDay();

  const nextDays = 7 - (lastDayIndex + 1);

  let days = "";
  for (let x = firstDayIndex; x > 0; x--) {
    days += `<div> </div>`;
  }

  for (let i = 1; i <= currentDay; i++) {
    if (
      i === new Date().getDate() &&
    dateSave.getMonth() === new Date().getMonth()
    ) {
      days += `<div class="todayByYear">${i}</div>`;
    }else{
      days += `<div>${i}</div>`;
    }
   
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div></div>`;
  }
  return  days
}

let aaaaa= '';

for (i=1; i <= 12; i++) {
  dateSave.setMonth(i-1);
  aaaaa += `<div
              <div class="border border-1 m-2">
                <div class="text-center">${months[i-1]}</div>
                <div class="dayss">
                  <div>Sun</div>
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div>Sat</div>
                </div>
                <div class="monthbyyear">${showCalendarbyYear()}</div>
              </div>
            </div>`
}

document.querySelector('.grid-calendar').innerHTML = aaaaa;

function editTask(idContent) {
  let getLocalStorageData = localStorage.getItem("New todo");
  listArray = JSON.parse(getLocalStorageData);

  const findId = listArray.filter(function (item) {
    return item.date === dataid
  });

  if (findId.length) {
    let check = findId.map((item) => {
      return item.content[idContent];
    })
    var a = prompt("Edit task", `${check}`)
    if (a.trim()!=0){
      findId.map((item) => {
        item.content.splice(idContent, 1);
        item.content.splice(idContent, 0 ,a);
      })
    }
  }
  localStorage.setItem("New todo", JSON.stringify(listArray));
  showTasks();
  showCalendar();
}
document.querySelector('.Year h1').innerHTML = dateSave.getFullYear();
document.querySelector('.btnMonth').addEventListener('click', ()=> {
  let modalByYear = document.querySelector('.calendarByYear')
  modalByYear.style.display = 'none';
  window.onclick = function (event) {
    if (event.target == modalByYear) {
      modalByYear.style.display = 'block';
    }
  }
})