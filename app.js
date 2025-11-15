const API_URL = "https://your-project.mockapi.io/api/students"; // o'zingniki bilan almashtir

const studentForm = document.getElementById("studentForm");
const submitBtn = document.getElementById("submitBtn");
const studentList = document.getElementById("studentList");

const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const levelInput = document.getElementById("level");

// Hozir tahrirlayotgan student ID (update uchun)
let editingId = null;

// --- GET: ro'yxatni yuklash ---
async function loadStudents() {
  studentList.innerHTML = "Yuklanmoqda... ⏳";

  try {
    const res = await fetch(API_URL);
    const students = await res.json();

    studentList.innerHTML = "";

    students.forEach((st) => {
      const li = document.createElement("li");
      li.textContent = `${st.name} (${st.age} yosh) - ${st.level}`;

      // EDIT tugmasi
      const editBtn = document.createElement("button");
      editBtn.textContent = "Tahrirlash ✏️";
      editBtn.addEventListener("click", () => {
        startEdit(st);
      });

      // DELETE tugmasi
      const delBtn = document.createElement("button");
      delBtn.textContent = "O'chirish 🗑️";
      delBtn.addEventListener("click", () => deleteStudent(st.id));

      li.append(" ", editBtn, " ", delBtn);
      studentList.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    studentList.innerHTML = "Xatolik yuz berdi 😢";
  }
}

// --- POST: yangi student yaratish ---
async function createStudent(name, age, level) {
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, age, level }),
  });

  loadStudents();
}

// --- DELETE: studentni o'chirish ---
async function deleteStudent(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  loadStudents();
}

// --- UPDATE: studentni yangilash (PATCH) ---
async function updateStudent(id, updatedData) {
  await fetch(`${API_URL}/${id}`, {
    method: "PATCH", // xohlasang PUT ham bo'ladi
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });

  loadStudents();
}

// Tahrirlashni boshlash: formga ma'lumotlarni joylash
function startEdit(student) {
  editingId = student.id;
  nameInput.value = student.name;
  ageInput.value = student.age;
  levelInput.value = student.level;
  submitBtn.textContent = "Yangilash ✅";
}

// Form submit: create yoki update rejimi
studentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const age = ageInput.value;
  const level = levelInput.value.trim();

  if (!name || !age || !level) {
    return alert("Iltimos, barcha maydonlarni to'ldiring 🙂");
  }

  // Agar editingId bor bo'lsa → UPDATE
  if (editingId) {
    updateStudent(editingId, { name, age, level });
    editingId = null;
    submitBtn.textContent = "Qo'shish ➕";
  } else {
    // Aks holda → CREATE
    createStudent(name, age, level);
  }

  studentForm.reset();
});

// Dastlab ro'yxatni yuklash
loadStudents();
