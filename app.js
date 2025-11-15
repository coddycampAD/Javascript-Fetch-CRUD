const API_URL = "https://your-project.mockapi.io/api/students"; // o'zingning URL'ing

const studentForm = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");

async function loadStudents() {
  studentList.innerHTML = "Yuklanmoqda... ⏳";

  const res = await fetch(API_URL);
  const students = await res.json();

  studentList.innerHTML = "";

  students.forEach((st) => {
    const li = document.createElement("li");
    li.textContent = `${st.name} (${st.age} yosh) - ${st.level}`;

    const delBtn = document.createElement("button");
    delBtn.textContent = "O'chirish 🗑️";
    delBtn.addEventListener("click", () => deleteStudent(st.id));

    li.appendChild(delBtn);
    studentList.appendChild(li);
  });
}

async function createStudent(name, age, level) {
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, age, level }),
  });

  loadStudents();
}

async function deleteStudent(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  loadStudents();
}

studentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const age = document.getElementById("age").value;
  const level = document.getElementById("level").value.trim();

  if (!name || !age || !level) {
    return alert("Iltimos, barcha maydonlarni to'ldiring 🙂");
  }

  createStudent(name, age, level);
  studentForm.reset();
});

loadStudents();
