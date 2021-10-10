const firebaseConfig = {
  apiKey: "AIzaSyDhHfdxTkg_nUK_Ycv74ZXNXaRxcgVlN4U",
  authDomain: "todo-list-f2769.firebaseapp.com",
  projectId: "todo-list-f2769",
  storageBucket: "todo-list-f2769.appspot.com",
  messagingSenderId: "869541598247",
  appId: "1:869541598247:web:2466929a0dc681f8f02a02",
  measurementId: "G-RYV60YJYJ2",
};

// Initialize Firebase
// const analytics = getAnalytics(app);

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

// console.log(db);

function addItem(event) {
  event.preventDefault();

  const text = document.getElementById("todo-input");

  db.collection("todo-items").add({
    status: "active",
    text: text.value,
  });

  text.value = "";
}

function getItems() {
  db.collection("todo-items").onSnapshot((snapshot) => {
    // console.log(snapshot.docs);
    let items = [];
    snapshot.docs.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    document.querySelector(".item-number").innerText = items.length;
    generateIte(items);
  });
}

function generateIte(items) {
  let itemsHTML = "";
  items.forEach((item) => {
    itemsHTML += `
      <div class="todo-item">
          <div class="check">
            <div class="checkmark ${
              item.status == "complete" ? "checked" : ""
            } " data-id="${item.id}">
              <img src="images/icon-check.svg" alt="">
            </div>
          </div>
          <div class="todo-text ${
            item.status == "complete" ? "checked" : ""
          }">${item.text}</div>
      </div>
      
      `;
  });

  document.querySelector(".todo-items").innerHTML = itemsHTML;
  createEventListeners();
}

function createEventListeners() {
  let todoCheckMarks = document.querySelectorAll(".todo-item .checkmark");
  todoCheckMarks.forEach((checkmark) => {
    checkmark.addEventListener("click", () => {
      console.log(checkmark.dataset.id);
      markCompleted(checkmark.dataset.id);
    });
  });
}

const markCompleted = (id) => {
  // from a database
  let item = db.collection("todo-items").doc(id);
  item.get().then((doc) => {
    // console.log("inside then()");
    if (doc.exists) {
      console.log("it is active");
      let status = doc.data().status;
      console.log(status);
      if (status == "active") {
        item.update({
          status: "complete",
        });
      } else if (status == "complete") {
        console.log("it is completed");
        item.update({
          status: "active",
        });
      }
    }
  });
};

getItems();
