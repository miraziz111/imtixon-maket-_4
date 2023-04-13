import { Api } from "./api.js";
const users = document.querySelector(`.users`);;
// const elBody = document.querySelector(`.body`);
const select = document.querySelector(`select`);
const form = document.querySelector(`#form`);
const userForm = document.querySelector(`#userForm`);
const removeOut = document.querySelector("#removeOut")
const studentBtn = document.querySelector("#showUserForm")


// Token login

let token = window.localStorage.getItem("token")
if(!token){
  window.location.replace("login.html")
}
removeOut.addEventListener("click",()=>{
  localStorage.removeItem("removeOut")
  window.location.replace("login.html")
})

// modal
studentBtn.addEventListener("click", (evt) => {
  evt.preventDefault()
  if(evt.target.tagName == "BUTTON"){
    let elem = evt.target
    if (elem.textContent == "Open user") {
      userForm.classList.add("class", "d-flex");
      userForm.classList.remove("class", "d-none");
    } else if (elem.textContent == "Close user form") {
      userForm.classList.remove("class", "d-flex");
      userForm.classList.add("class", "d-none");
    }
  }
});

userForm.addEventListener("submit", async evt => {
  evt.preventDefault()
  
  let {user_name, user_username, user_address} = evt.target.elements
  
  let Obj = {
    name: user_name.value,
    username: user_username.value,
    address: {
      city: user_address.value,
    },
  };
  
  let result = await Api.POST("users", Obj);
  // console.log(result);
  if (result){
    let userData = await Api.GET("users");
    let newData = [result, ...userData];
    renderUsers(newData, users);
    
    userForm.classList.remove("class", "d-flex");
    userForm.classList.add("class", "d-none");
  };
});

async function getUsers(elem) {
  let data = await Api.GET("users");
  
  data.forEach((user) => {
    let option = document.createElement("option");
    option.textContent = user.name;
    option.value = user.id;
    select.append(option);
  });
  renderUsers(data, elem);
}
getUsers(users);

function renderUsers(arr, elem) {
  elem.innerHTML = null;
  if (arr) {
    arr.forEach((item) => {
      let li = document.createElement("li");
      li.dataset.id = item.id;
      li.classList.add("list-group-item", "item-users");
      let delBtn = document.createElement("i");
      delBtn.setAttribute("class", " z-0 position-absolute top-0 end-0 bx bxs-message-square-x");
      li.innerText = `
      ${item.id} ${item.name} ${item.address.zipcode}  ${item.username} ${item.address.city} ${item.phone} 
      `;
      li.setAttribute("class"," position-relative items-center p-3 bg-info bg-opacity-10 border border-info border-start-0 rounded-end fs-3")
      li.append(delBtn);
      
      li.addEventListener("click", (e) => {
        const itemUsers = document.querySelectorAll(`.item-users`);
        itemUsers.forEach((e) => {
          e.classList.remove("active");
        });
        
      });
      elem.appendChild(li);
      delBtn.addEventListener("click", async(evt) => {
        evt.preventDefault();
        let parentLi = evt.target.parentNode;
        let parentUl = parentLi.parentNode;
        let delUserId = parentLi.dataset.id;
        
        let response = await Api.DELETE(`users/${delUserId}`);
        if (response){
          parentUl.removeChild(parentLi);
        }
      });
    });
  }
}