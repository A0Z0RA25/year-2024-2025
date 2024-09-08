let students = JSON.parse(localStorage.getItem('students')) || [{
    img: "https://cdn.pixabay.com/photo/2021/03/14/12/19/sukuna-6094183_1280.jpg",
    name: "Yuji Itadori",
    moto: "My name is CJ an my motto in lie is you can do it.",
    author: "Itadori"
},{
    img: "https://practicaltyping.com/wp-content/uploads/2024/01/megumi.jpg",
    name: "Megumi Fushiguro",
    moto: "My name is CJ an my motto in lie is you can do it.",
    author: "Megumi"
},{
    img: "https://staticg.sportskeeda.com/editor/2023/12/ecc9f-17026418706654-1920.jpg?w=640",
    name: "Maki Zenin",
    moto: "My name is CJ an my motto in lie is you can do it.",
    author: "Maki"
},{
    img: "https://i.pinimg.com/736x/ba/5a/70/ba5a7064b4b1f9b260df25901008e21c.jpg",
    name: "Kugisaki Nobara",
    moto: "My name is CJ an my motto in lie is you can do it.",
    author: "Kugisaki"
},{
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnDtUcBqTskg3dzjMclFLHvXWMUJhsPVad3g&s",
    name: "Yuta Okkutsu",
    moto: "My name is CJ an my motto in lie is you can do it.",
    author: "Yuta"
},{
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRB_XQ9Jmr6lfaKmSwGiuxmREcqGQ14d3WPqw&s",
    name: "Toji Fushiguro",
    moto: "My name is CJ an my motto in lie is you can do it.",
    author: "Toji"
},{
    img: "https://c4.wallpaperflare.com/wallpaper/787/854/424/jujutsu-kaisen-satoru-gojo-anime-boys-anime-girls-hd-wallpaper-preview.jpg",
    name: "Gojo Saturo",
    moto: "My name is CJ an my motto in lie is you can do it.",
    author: "Gojo"
},{
    img: "https://i.pinimg.com/736x/7c/9f/57/7c9f57d0ca7d7b99f09c2b481731f62a.jpg",
    name: "Panda",
    moto: "My name is CJ an my motto in lie is you can do it.",
    author: "Panda"
},{
    img: "https://storage.moemate.io/951e6c9e6950cff1f2b436063a744c0bc4696a79/1_bZBRwP4ojL6YpvxFBWEHow.jpg",
    name: "Mai Zenin",
    moto: "My name is CJ an my motto in lie is you can do it.",
    author: "Mai"
},{
    img: "https://cdn.pixabay.com/photo/2021/03/14/12/19/sukuna-6094183_1280.jpg",
    name: "Carl Jasper A. Ramos",
    moto: "My name is CJ an my motto in lie is you can do it.",
    author: "CJ"
}];

// Function to save students array to local storage
function saveToLocalStorage() {
    localStorage.setItem('students', JSON.stringify(students));
}

// Render the student profiles
function renderStudents() {
    let html = '';
    students.forEach((student, index) => {
        html += `
            <div class="cj flex flex-col align-middle items-center sm:m-10 justify-center" data-index="${index}"> 
                <div class="px-0 flex flex-col items-center my-2 sm:justify-center">
                    <div class="relative h-44 w-48">
                        <img id="studentPRF" class="absolute z-10 top-1 left-0 p-10 my-2 h-full w-full bg-cover bg-center" src="${student.img}" alt="">
                        <img class="absolute top-0 left-0 h-48 w-48 m-0 p-0" src="border2.png" alt="">
                    </div>
                    <h1 id="student-name" class="text-center px-2 bg-white">${student.name}</h1> 
                </div>
                <div class="moto">
                    <div class="backdrop-blur-sm bg-white/30 rounded-sm flex flex-col w-52 h-48 py-2 px-4">
                        <p id="message-${index}" class="px-2 pt-3.5 h-full flex break-words">"${student.moto}"</p>
                        <textarea id="saveMessage-${index}" class="studentMessage hidden h-full px-2">${student.moto}</textarea>
                        <p class="text-end">- ${student.author}</p> 
                    </div> 
                    <div class="flex flex-col pt-2 gap-1">
                        <button id="editImage-${index}" class="bg-gray-200 px-2">Edit Image</button>
                        <input type="file" class="hidden w-20 text-xs mx-auto" id="uploadImage-${index}">
                        <button id="editMessage-${index}" class="bg-gray-200 px-2">Edit Message</button>
                        
                    </div>
                </div>  
            </div>
        `;
    });
    document.getElementById('students-info-container').innerHTML = html;

    // Attach event listeners for edit actions
    attachEventListeners();
}

// Your Firebase configuration (get this from Firebase console)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };

  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  // Function to display saved messages from Firestore
  async function displaySavedMessages() {
    const wall = document.getElementById('theWall');
    const messagesSnapshot = await db.collection('messages').get();
    
    messagesSnapshot.forEach(doc => {
      const msg = doc.data();
      const messageElement = document.createElement('div');
      messageElement.textContent = msg.text;
      messageElement.className = 'absolute bg-white p-2 rounded shadow text-black';
      messageElement.style.left = msg.x;
      messageElement.style.top = msg.y;

      wall.appendChild(messageElement);
    });
  }

  // Function to post a new message and save to Firestore
  async function postMessage() {
    const message = document.getElementById('sayText').value;
    const wall = document.getElementById('theWall');
    
    if (message.trim() === '') return; // Avoid empty messages

    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.className = 'absolute bg-white p-2 rounded shadow text-black text-sm';
    
    // Get wall dimensions
    const wallWidth = wall.clientWidth;
    const wallHeight = wall.clientHeight;

    let randomX, randomY;
    let isPositionValid = false;
    
    // Generate random positions that don't overlap with existing messages
    while (!isPositionValid) {
      randomX = Math.random() * (wallWidth - 100) + 'px'; // Adjust 100 for padding/margin
      randomY = Math.random() * (wallHeight - 100) + 'px'; // Adjust 100 for padding/margin
      
      // Check if the new position overlaps with any existing message
      isPositionValid = true; // You'd implement overlap checking if needed.
    }

    // Set the message position
    messageElement.style.left = randomX;
    messageElement.style.top = randomY;

    // Append the new message to the wall
    wall.appendChild(messageElement);

    // Save the message with its position to Firestore
    await db.collection('messages').add({
      text: message,
      x: randomX,
      y: randomY
    });

    // Clear the textarea
    document.getElementById('sayText').value = '';
  }

  // Load saved messages when the page loads
  window.onload = displaySavedMessages;




// Attach event listeners to buttons
function attachEventListeners() {
    // Functionality to handle Edit Message
    document.querySelectorAll('[id^="editMessage-"]').forEach((button, index) => {
        button.addEventListener('click', () => {
            const parent = button.closest('.cj');
            const inputField = parent.querySelector(`#saveMessage-${index}`);
            const motoText = parent.querySelector(`#message-${index}`);

            // Close other open textareas
            document.querySelectorAll('.studentMessage').forEach((textarea, i) => {
                if (i !== index) {
                    textarea.classList.add('hidden');
                    const otherButton = document.querySelector(`#editMessage-${i}`);
                    otherButton.textContent = 'Edit Message';
                    document.querySelector(`#message-${i}`).style.display = '';
                }
            });

            if (button.textContent === 'Edit Message') {
                motoText.style.display = "none";
                inputField.classList.remove('hidden');
                inputField.focus();
                button.textContent = 'Save';
            } else {
                const newMoto = inputField.value;
                students[index].moto = newMoto;
                motoText.textContent = `"${newMoto}"`;
                inputField.classList.add('hidden');
                motoText.style.display = "";
                button.textContent = 'Edit Message';
                saveToLocalStorage(); // Save updated array to local storage
            }
        });
    });

    // Functionality to handle Edit Image
    document.querySelectorAll('[id^="editImage-"]').forEach((button, index) => {
        button.addEventListener('click', () => {
            const uploadInput = button.nextElementSibling;
            uploadInput.classList.toggle('hidden');

            uploadInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const imgElement = button.closest('.cj').querySelector('img');
                        imgElement.src = reader.result;
                        students[index].img = reader.result; // Update array
                        saveToLocalStorage(); // Save updated array to local storage
                    };
                    reader.readAsDataURL(file);
                }
            });
        });
    });
}

// Initialize the student profiles on page load
renderStudents();

// Search functionality remains the same
const inputName = document.getElementById("findName");
inputName.addEventListener("keyup", () => {
    const studentElements = document.querySelectorAll("#student-name");

    studentElements.forEach(studentElement => {
        const fullName = studentElement.textContent.toLowerCase(); // Correctly get the text content of each element

        if (fullName.includes(inputName.value.toLowerCase())) {
            studentElement.parentElement.parentElement.style.display = ''; // Show the element
        } else {
            studentElement.parentElement.parentElement.style.display = "none"; // Hide the element
        }
    });
});


const inputNameDev = document.getElementById("nameInputDev");
const devMessage = document.querySelector(".devMessage");

function sorry(){
    devMessage.innerHTML += 
    `sorry na kase😣😣😣😣😣😣`
}
function yey(){
    devMessage.innerHTML += 
    `Wala na masaya nanaman ako, pinatawad nako ng isang lorrain eh 🤗🤗🤗🤗🤗`
}

function sendDevName() {

    if(inputNameDev.value == "CJ"){
        devMessage.innerHTML = 
        `Hi ${inputNameDev.value}, musta love life pre? kaya paba? `
    } else if(inputNameDev.value == "Lorrain"){
        devMessage.innerHTML = 
        `Hi musta na ${inputNameDev.value}, long time no talk ah, hoping na maing ok tayo, masama parin ba loob mo saken? 😔
        <button class="bg-red-500 px-2" onclick="sorry()">Masama parin</button>
        <button class="bg-green-400 px-2 " onclick="yey()">Hindi na</button>
        `
    }


}
