const API_URL = "https://sizning-api-manzilingiz";

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

    if (!res.ok) {
      throw new Error("GET xato: " + res.status);
    }

    const students = await res.json();

    studentList.innerHTML = "";

    students.forEach((st) => {
      const li = document.createElement("li");

      const infoSpan = document.createElement("span");
      infoSpan.textContent = `${st.name} (${st.age} yosh) - ${st.level}`;

      // EDIT tugmasi
      const editBtn = document.createElement("button");
      editBtn.textContent = "Tahrirlash ✏️";
      editBtn.className = "btn btn-edit";
      editBtn.addEventListener("click", () => {
        startEdit(st);
      });

      // DELETE tugmasi
      const delBtn = document.createElement("button");
      delBtn.textContent = "O'chirish 🗑️";
      delBtn.className = "btn btn-delete";
      delBtn.addEventListener("click", () => deleteStudent(st.id));

      const btnWrapper = document.createElement("div");
      btnWrapper.append(editBtn, delBtn);

      li.append(infoSpan, btnWrapper);
      studentList.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    studentList.innerHTML = "Xatolik yuz berdi 😢";
  }
}

// --- POST: yangi student yaratish ---
async function createStudent(name, age, level) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, age: Number(age), level }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("POST xato:", res.status, text);
      alert("Yangi student yaratishda xato bo'ldi");
      return;
    }

    await loadStudents();
  } catch (err) {
    console.error(err);
    alert("Server bilan bog'lanishda xato (POST)");
  }
}

// --- DELETE: studentni o'chirish ---
async function deleteStudent(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("DELETE xato:", res.status, text);
      alert("O'chirishda xato bo'ldi");
      return;
    }

    await loadStudents();
  } catch (err) {
    console.error(err);
    alert("Server bilan bog'lanishda xato (DELETE)");
  }
}

// --- UPDATE: studentni yangilash (PUT) ---
async function updateStudent(id, updatedData) {
  console.log("UPDATE chaqirildi, id:", id, "data:", updatedData);

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT", // PATCH o'rniga PUT, CORS uchun
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("PUT xato:", res.status, text);
      alert("Yangilashda xato bo'ldi");
      return;
    }

    const data = await res.json();
    console.log("Yangilangan student:", data);

    await loadStudents();
  } catch (err) {
    console.error(err);
    alert("Server bilan bog'lanishda xato (PUT)");
  }
}

// Tahrirlashni boshlash: formga ma'lumotlarni joylash
function startEdit(student) {
  console.log("Tahrirlash boshlandi:", student);

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

  if (editingId) {
    // UPDATE rejimi
    updateStudent(editingId, {
      name,
      age: Number(age),
      level,
    });
    editingId = null;
    submitBtn.textContent = "Qo'shish ➕";
  } else {
    // CREATE rejimi
    createStudent(name, age, level);
  }

  studentForm.reset();
});

// Dastlab ro'yxatni yuklash
loadStudents();
