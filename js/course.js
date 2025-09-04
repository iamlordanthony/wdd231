// Example course array
const courses = [
    { code: "WDD 130", name: "Web Fundamentals", credits: 2, completed: true },
    { code: "WDD 131", name: "Dynamic Web Fundamentals", credits: 2, completed: true },
    { code: "WDD 231", name: "Web Frontend Development", credits: 2, completed: false },
    { code: "CSE 210", name: "Programming with Classes", credits: 2, completed: false }
];

// Function to render courses
function displayCourses(courseArray) {
    const container = document.getElementById("course-container");
    container.innerHTML = "";

    let totalCredits = 0;

    courseArray.forEach(course => {
        const courseCard = document.createElement("div");
        courseCard.classList.add("course-card");
        if (course.completed) courseCard.classList.add("completed");

        courseCard.innerHTML = `
      <h3>${course.code}</h3>
      <p>${course.name}</p>
      <p>Credits: ${course.credits}</p>
    `;

        container.appendChild(courseCard);
        totalCredits += course.credits;
    });

    document.getElementById("total-credits").textContent = totalCredits;
}

// Default view: all courses
displayCourses(courses);

// Filtering
document.getElementById("all-courses").addEventListener("click", () => displayCourses(courses));
document.getElementById("wdd-courses").addEventListener("click", () => displayCourses(courses.filter(c => c.code.startsWith("WDD"))));
document.getElementById("cse-courses").addEventListener("click", () => displayCourses(courses.filter(c => c.code.startsWith("CSE"))));
