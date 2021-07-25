const { response } = require('express');
const express = require('express')  //подключаем библиотеку express, упрощает запуск сервера, готовые функции
const mysql = require('mysql2')     //подключаем библиотеку для работы с базой данных
const cors = require('cors')
const app = express() // мы создаем константу app, вызывает express()
const PORT = 4000     //создаем порт нашего сервера

// подключаемся к базе данных
const connection = mysql.createConnection({
    host: "localhost", //адрес базы данных
    user: "root",
    database: "posl", //название бд
    password: "root"
});

app.use(cors())

let students = []
let lessons = []




app.get('/api/lessons/:id', (req, res) => {//достаю список предметов по id препода из совпадений id в lessons
    const id = req.params.id
    let sql = `SELECT lessonId FROM groups_attendance WHERE groupId=${id}`;
    connection.query(sql, (err, data) => {
        data.forEach((item) => {
            getLessons(item.lessonId)
        })
    })
    res.json(lessons)
    lessons = []
})

function getLessons(id) {
    let sql = `SELECT * FROM lessons WHERE Id=${id}`;
    connection.query(sql, (err, data) => {
        data.forEach((item) => {
            lessons.push(item)
        })
    })
}

app.get('/api/get-lessons/:id', (req, res) => {
    const teacherId = req.params.id;
    let sql = `SELECT * FROM Lessons WHERE TeacherID=${teacherId}`
    connection.query(sql, (err, data) => {
        res.json(data)
    })
})

app.get('/api/get-groups/:id', (req, res) => {// id предмета достаем id группы и все о ней знаем
    const lessonId = req.params.id;
    let sql = `SELECT DISTINCT GroupId , GroupName  FROM Groups INNER JOIN
    timitable ON Groups.Id = timitable.GroupId WHERE LessonId=${lessonId}`
    connection.query(sql, (err, data) => {
        res.json(data)
    })
})


app.get('/api/students/:id', (req, res) => {// id групппы получаем по этому id получаем студентов
    const id = req.params.id
    console.log(id)
    let sql = `SELECT * FROM students WHERE GroupId=${id}`;
    connection.query(sql, (err, data) => {
        console.log(students)
        res.send(data)
    })
})

app.use(
    express.urlencoded({
        extended: true
    })
)


app.use(express.json())

app.post('/api/attendance/', (req, res) => {
  
    const code = req.body.code

    let sql = `SELECT * FROM normal_attendance WHERE CardCode=${code}`

    connection.query(sql, (err, data) => {
        console.log(data)
        res.send(data)
    })
})

app.post('/api/timetable/', (req, res) => {//id пары и предмета но перед этим получаем список всех посещ ст
    
    const id = req.body.id
    const lessonId = req.body.lesson
    console.log(id)

    let sql = `SELECT * FROM timitable  WHERE Id=${id} AND LessonId=${lessonId}`
    connection.query(sql, (err, data) => {
        console.log(data)
        res.send(data)
    })
})

app.post('/api/insert-attendance', (req, res) => {//обработчик для записи в базу
   
    const id = req.body.id

    let allCards = req.body.cards
    let cards = allCards.split(',')

    let sql = ``
    cards.forEach((card) => {
        sql = `INSERT INTO normal_attendance(CardCode, TimetableId, Presence) VALUES (${card.trim()}, ${id}, 1)`
        console.log(sql)
        connection.query(sql, (err, data) => {
            console.log('SQL request has been executed')
        })
    })
})

app.listen(PORT)