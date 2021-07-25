let lessons = []
let students = []
let groups = []
let lessonId = 0


getLessons(2)
function getLessons(id) {
    lessonsStr = ``
    const requestURL = `http://localhost:4000/api/get-lessons/`
    const xhr = new XMLHttpRequest()
    xhr.open('GET', requestURL + `${id}`)
    xhr.onload = () => {
        lessons = JSON.parse(xhr.response)
        lessons.forEach((lesson) => {
            lessonsStr += `<input type="button" class="button" value="${lesson.Name}" onclick="getGroups(${lesson.Id})" id="${lesson.Id}">`
        })

        $(`.wrapper-lessons`).html(lessonsStr);
    }
    xhr.send()
}

function getGroups(id) {
    lessonId = id;
    groupsStr = ``
    const requestURL = `http://localhost:4000/api/get-groups/`
    const xhr = new XMLHttpRequest()
    xhr.open('GET', requestURL + `${id}`)
    xhr.onload = () => {
        groups = JSON.parse(xhr.response)
        groups.forEach((group) => {
            groupsStr += `<input class="button" type="button" value="${group.GroupName}" onclick="getStudents(${group.GroupId})" id="${group.GroupId}">`
        })
        $(`.wrapper-groups`).html(groupsStr);
    }
    xhr.send()
}

function getStudents(id) {
    studentsStr = ``
    const requestURL = `http://localhost:4000/api/students/`
    const xhr = new XMLHttpRequest()
    xhr.open('GET', requestURL + `${id}`)
    xhr.onload = () => {
        students = JSON.parse(xhr.response)
        students.forEach((student) => {
            studentsStr += `<a href="./student.html?${student.CardCode}&${lessonId}">
			${student.Surname} ${student.Name}</a><br>`
        })

        $(`.students`).html(studentsStr);
    }
    xhr.send()
}