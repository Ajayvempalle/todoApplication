const express = require('express')

const path = require('path')
const sqlite3 = require('sqlite3')

const {open} = require('sqlite')
const dataPath = path.join(__dirname, 'todoApplication.db')
const app = express()
let db = null

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dataPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server is running')
    })
  } catch (e) {
    console.log(`error at ${e.message}`)
    process.exit(1)
  }
}
initializeDbAndServer()

const hasPriorityAndStatus = request => {
  return request.status !== undefined && request.priority !== undefined
}

const hasPriority = request => {
  return request.priority !== undefined
}

const hasStatus = request => {
  return request.priority !== undefined
}

app.get('/todos/', async (request, response) => {
  let data = null
  let getTodosQuery = ''
  const {search_q = '', priority, status} = request.query
  switch (true) {
    case hasPriorityAndStatus(request.query):
      getTodosQuery = `select * from todo where todo like '%${search_q}%'
      and priority='${priority}' and status='${status}'`
      break
    case hasPriority(request.query):
      getTodosQuery = `select * from todo where todo like '%${search_q}%'
      and priority='${priority}'`
      break
    case hasStatus(request.query):
      getTodosQuery = `select * from todo where todo like '%${search_q}%'
      and status='${status}'`
      break
    default:
      getTodosQuery = `select * from todo where todo like '%${search_q}%'`
  }

  data = await db.all(getTodosQuery)
  response.send(data)
})
