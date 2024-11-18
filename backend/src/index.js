const express = require('express');
const cors = require('cors')
const models = require('./helpers/model.middelware')
const auth = require('./middelware/user.middelware')
const app = express();
const port = process.env.PORT || 80;

var userRouter = require('./routes/user.route');
var eventRouter = require('./routes/event.route');
var todoRouter = require('./routes/todo.route');
var courseRouter = require('./routes/course.route');
var noAuthRouter = require('./routes/noauth.route')
var degreeprogramRouter = require('./routes/degreeprogram.route');


app.use(cors({
  origin: '*'
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/user', models.userModel)
app.use('/user', auth)
app.use('/user', userRouter);

app.use('/event', models.eventModel);
app.use('/event', auth);
app.use('/event', eventRouter);

app.use('/todo', models.todoModel);
app.use('/todo', auth);
app.use('/todo', todoRouter);

app.use('/course', models.courseModel)
app.use('/course', auth)
app.use('/course', courseRouter);

app.use('/degreeprogram', models.degreeprogramModel)
app.use('/degreeprogram', auth)
app.use('/degreeprogram', degreeprogramRouter);

app.use('/noauth', models.userModel)
app.use('/noauth', noAuthRouter);

app.get('/', (req, res) => {
  res.send('Hello Backend!')
});

app.listen(port, () => {
  console.log(`Webserver is ready at http://localhost:${port}`)
});