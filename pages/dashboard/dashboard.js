// Check the user is logged in

const isLogin = () => {
  let isAuth = JSON.parse(localStorage.getItem("auth"));
  if (isAuth === null) {
    window.location.href = "/login.html";
  } else {
    return isAuth;
  }
};

const isAuth = isLogin();

if (document.getElementById("profile-tag")) {
  let userName, userEmail, userCity, userAddress, userGender, userDOB;
  const user = JSON.parse(localStorage.getItem("auth"));
  let userLastName = "";

  document.getElementById("navbar-brand").innerHTML = `${user.lastName}`;
  document.getElementById(
    "profile-tag"
  ).innerHTML = `<span class="material-symbols-outlined">
  person
  </span>`;

  document.getElementById(
    "userFullName"
  ).innerHTML = `${user.firstName} ${user.lastName}`;
  document.getElementById("userEmail").innerHTML = user.email;
  document.getElementById("userGender").innerHTML = user.gender;
}

// logout method
const handleLogout = () => {
  localStorage.removeItem("auth");
  localStorage.removeItem("chat");
  localStorage.removeItem("chatUser");
  localStorage.removeItem("authSession");

  window.location.href = "/pages/auth/login.html";
};

// Get user chat into localstorage
let userChatList;
const getUserChat = () => {
  let userChat = isAuth.chat;
  userChatList = JSON.parse(localStorage.getItem("chat")) || [];
  const updatedUsers = JSON.parse(localStorage.getItem("users")).map((user) => {
    if (user.id === isAuth.id) {
      userChatList = [...user.chat];
    }
    return user;
  });
  localStorage.setItem("chat", JSON.stringify(userChatList));
};

// Send message method
const handleMessageForm = (event) => {
  event.preventDefault();

  const userMessage = document.getElementById("userMessage").value;
  const recevierUserId = JSON.parse(localStorage.getItem("chatUser"));
  let sender, receiver;

  if (userMessage !== "") {
    const users = JSON.parse(localStorage.getItem("users"));

    const updatedUsers = users.map((user) => {
      if (user.id === isAuth.id) {
        sender = user.id;
        if (user.chat.length === 0) {
          user.chat.push({
            id: user.chat.length + 1,
            textMessage: userMessage,
            userId: user.id,
            status: "send",
            recevierId: recevierUserId,
            timeStamp: new Date(),
          });
        } else if (user.chat.length > 0) {
          debugger;
          const clone = [...user.chat];
          const userArr = clone.sort((a, b) => b.id - a.id);
          user.chat.sort((a, b) => a.id - b.id);
          user.chat.push({
            id: userArr[0].id + 1,
            textMessage: userMessage,
            userId: user.id,
            status: "send",
            recevierId: recevierUserId,
            timeStamp: new Date(),
          });
        }
      } else if (user.id === recevierUserId) {
        if (user.chat.length === 0) {
          user.chat.push({
            id: user.chat.length + 1,
            textMessage: userMessage,
            userId: user.id,
            recevierId: isAuth.id,
            status: "receive",
            timeStamp: new Date(),
          });
        } else if (user.chat.length > 0) {
          const clone = [...user.chat];
          const userArr = clone.sort((a, b) => b.id - a.id);
          user.chat.sort((a, b) => a.id - b.id);
          user.chat.push({
            id: userArr[0].id + 1,
            textMessage: userMessage,
            userId: user.id,
            recevierId: isAuth.id,
            status: "receive",
            timeStamp: new Date(),
          });
        }
      }
      return user;
    });

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    userChatList.push({
      id: userChatList.length + 1,
      textMessage: userMessage,
      userId: isAuth.id,
      status: "send",
      recevierId: recevierUserId,
      timeStamp: new Date(),
    });
    localStorage.setItem("chat", JSON.stringify(userChatList));
    document.getElementById("userMessage").value = "";
    // Update chat
    getUserChat();
    updateChat(recevierUserId);
    dashboardUserList();
  }
};

// Remove message for me
const deleteMyMessage = (chatId, userId, recevierId) => {
  const users = JSON.parse(localStorage.getItem("users"));

  const updatedUsers = users.map((user) => {
    if (user.id === userId) {
      user.chat.map((chat) => {
        if (
          chat.id === chatId &&
          chat.userId === userId &&
          chat.recevierId === recevierId
        ) {
          user.chat.splice(user.chat.indexOf(chat), 1);
        }
      });
      return user;
      //   user.chat.push({
      //     id: user.chat.length + 1,
      //     textMessage: userMessage,
      //     userId: user.id,
      //     status: "send",
      //     recevierId: recevierUserId,
      //     timeStamp: new Date(),
      //   });
      // } else if (user.id === recevierUserId) {
      //   user.chat.push({
      //     id: user.chat.length + 1,
      //     textMessage: userMessage,
      //     userId: user.id,
      //     recevierId: isAuth.id,
      //     status: "receive",
      //     timeStamp: new Date(),
      //   });
      // }
      // return user;
    }
    return user;
  });

  localStorage.setItem("users", JSON.stringify(updatedUsers));
  getUserChat();
  dashboardUserList();
  updateChat(recevierId);
};

// Delete Message for All
const deleteMessageForAll = (chatId, userId, recevierId) => {
  const users = JSON.parse(localStorage.getItem("users"));
  let chatMessage;
  users.map((user) => {
    if (user.id === userId) {
      user.chat.map((chat) => {
        if (chat.id === chatId) {
          chatMessage = chat;
        }
      });
    }
  });
  const updatedUsers = users.map((user) => {
    if (user.id === recevierId) {
      user.chat.map((chat) => {
        if (
          chat.textMessage === chatMessage.textMessage &&
          chat.userId === recevierId &&
          chat.recevierId === userId
        ) {
          user.chat.splice(user.chat.indexOf(chat), 1);
        }
      });
      return user;
    } else if (user.id === userId) {
      user.chat.map((chat) => {
        if (
          chat.textMessage === chatMessage.textMessage &&
          chat.userId === userId &&
          chat.recevierId === recevierId
        ) {
          user.chat.splice(user.chat.indexOf(chat), 1);
        }
      });
      return user;
    }
    return user;
  });

  localStorage.setItem("users", JSON.stringify(updatedUsers));
  getUserChat();
  dashboardUserList();
  updateChat(recevierId);
};

// Edit Message
const editMessage = (chatId, userId, receiverId) => {};

const createEditElement = (chatId, userId, recevierId) => {
  const users = JSON.parse(localStorage.getItem("users"));
  let chatMessage;
  users.map((user) => {
    if (user.id === userId) {
      user.chat.map((chat) => {
        if (chat.id === chatId) {
          chatMessage = chat;
        }
      });
    }
  });
  const existElement = document.getElementById("");
  const inputElement = document.createElement("input");
  inputElement.value = chatMessage;
};

const updateChat = (id) => {
  let listHTML = `<div id="user-list">`;
  let getUser;
  JSON.parse(localStorage.getItem("users")).filter((users) => {
    if (users.id === id) {
      getUser = users;
    }
  });
  document.getElementById(
    "userFullName"
  ).innerHTML = `${getUser.firstName} ${getUser.lastName}`;
  for (const chat of userChatList) {
    const time = new Date(chat.timeStamp);
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedTime = `${hours % 12}:${
      minutes < 10 ? "0" : ""
    }${minutes} ${ampm}`;

    if (chat.recevierId === id) {
      let userData = {
        chatId: chat.id,
        userId: chat.userId,
        recevierId: chat.recevierId,
      };
      if (chat.status === "receive") {
        listHTML += `
        <div class="message received w-25 d-flex justify-content-between align-items-end">
          <span>${chat.textMessage}</span>
          <span class="sent-time" style="font-size: 10px">${formattedTime}</span>
        </div>`;
      } else if (chat.status === "send") {
        listHTML += `
        <div class="d-flex align-items-center ms-auto justify-content-center" style="max-width:370px;">
            <div class="message sent d-flex flex-column justify-content-between align-items-end">
              <span class="editMessage text-break">${chat.textMessage}</span>
              <span class="sent-time" style="font-size: 10px">${formattedTime}</span>
            </div>
            <div class="dropstart">
                <button class="btn p-1"  data-bs-toggle="dropdown" aria-expanded="false"> <span class="material-symbols-outlined menu-button">more_vert</span> </button>
                <ul class="dropdown-menu">
                    <div class="list-group border-0">
                        <a href="#" class="list-group-item list-group-item-action"onclick="createEditElement(${chat.id},${chat.userId},${chat.recevierId})">Edit</a>
                        <a href="#" class="list-group-item list-group-item-action" onclick="deleteMyMessage(
                      ${chat.id},${chat.userId}, ${chat.recevierId}
                        )" >Delete for me</a>
                        <a href="#" class="list-group-item list-group-item-action" onclick="deleteMessageForAll(
                          ${chat.id},${chat.userId}, ${chat.recevierId}
                          )" >Delete for everyone</a>
                  </div>
              </ul>
            </div>
        </div>
        `;
      }
    }
  }

  listHTML += `</div>`;
  document.getElementById("chat-box-list").innerHTML = listHTML;
};

document
  .getElementById("send-button")
  .addEventListener("click", handleMessageForm);

getUserChat();

const openUserChat = (id) => {
  localStorage.setItem("chatUser", JSON.stringify(id));
  let listHTML = `<div id="user-list">`;
  for (const chat of userChatList) {
    const time = new Date(chat.timeStamp);
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedTime = `${hours % 12}:${
      minutes < 10 ? "0" : ""
    }${minutes} ${ampm}`;
    if (chat.recevierId === id) {
      if (chat.status === "receive") {
        listHTML += `
        <div class="message received w-25 d-flex justify-content-between align-items-end">
          <span>${chat.textMessage}</span>
          <span class="sent-time" style="font-size: 10px">${formattedTime}</span>
        </div>`;
      } else if (chat.status === "send") {
        listHTML += `
        <div class="d-flex align-items-center ms-auto justify-content-center">
        
        <div class="message sent w-25  d-flex justify-content-between align-items-end">
          <span>${chat.textMessage}</span>
          <span class="sent-time" style="font-size: 10px">${formattedTime}</span>
        </div>
        <div class="dropstart">
       <button class="btn p-1"  data-bs-toggle="dropdown" aria-expanded="false"> <span class="material-symbols-outlined menu-button">more_vert</span> </button>
        <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Edit</a></li>
            <li id="deleteMyMessage"  ><a class="dropdown-item" href="#" >Delete for me</a></li>
            <li><a class="dropdown-item" href="#" >Delete for everyone</a></li>
      </ul>
      </div>
        </div>
        `;
      }
    }
  }

  listHTML += `</div>`;
  document.getElementById("chat-box-list").innerHTML = listHTML;
  updateChat(id);
};
// get user list of chat
const dashobardUsers = JSON.parse(localStorage.getItem("users")).filter(
  (users) => {
    if (users.id !== isAuth.id) {
      return users;
    }
  }
);

const dashboardUserList = () => {
  let userListHTML = "";

  for (const user of dashobardUsers) {
    let recevierId = userChatList.filter((chat) => {
      if (user.id === chat.recevierId) {
        return chat;
      } else {
        return null;
      }
    });

    if (user.id) {
      const lastMessage =
        recevierId.length > 0
          ? recevierId[recevierId.length - 1].textMessage
          : "Click to Message";
      userListHTML += ` <a
        class="list-group-item border-0 border-bottom list-group-item-action list-group-item-dark text-dark p-2 d-flex align-items-center isActive"
        style="width: 290px" onclick="openUserChat(${user.id})"
        href="#"
        >
        <div>
          <img
            src="https://pngall.com/wp-content/uploads/5/User-Profile-PNG-Image.png"
            width="50"
            alt=""
            class="me-2"
          />
        </div>
        <div class="w-100">
          <div
            class="d-flex justify-content-between align-items-center"
          >
            <span style="font-size: 16px"
              >${user.firstName} ${user.lastName}</span
            ><span
              class="fw-light text-secondary me-1"
              style="font-size: 10px"
              >8:19 AM</span
            >
          </div>
          <div>
            <div style="max-width: 200px; overflow: hidden">
              <span
                class="text-secondary"
                style="
                  font-size: 14px;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  white-space: nowrap;
                  display: inline-block;
                  max-width: 100%;
                "
              >
               ${
                 user.id === recevierId[0]?.recevierId
                   ? lastMessage
                   : "Click to Message"
               }
              </span>
            </div>
          </div>
        </div></a
        >`;
    }
  }

  document.getElementById("user-list").innerHTML = userListHTML;
};

const handleClearChat = () => {
  const getReceiverId = JSON.parse(localStorage.getItem("chatUser"));
  const users = JSON.parse(localStorage.getItem("users"));
  let userChat;
  const getUser = users.filter((user) => {
    if (user.id === isAuth.id) {
      userChat = user.chat.filter((chat) => {
        if (chat.recevierId !== getReceiverId) {
          return chat;
        }
      });
    }
  });

  const updatedUsers = users.map((user) => {
    if (user.id === isAuth.id) {
      sender = user.id;
      user.chat = userChat;
    }
    return user;
  });
  localStorage.setItem("users", JSON.stringify(updatedUsers));
  getUserChat();
  updateChat(getReceiverId);
  dashboardUserList();
};
document
  .getElementById("removeUserChat")
  .addEventListener("click", handleClearChat);
dashboardUserList();
