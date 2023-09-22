const express = require('express')
const app = express()
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const dataList = require('./views/data')
const connectDB = require('./utils/connectDB')
const User = require('./model/registrationSchema')
const admin = require('./model/adminreg')
const bcrypt = require('bcrypt')
connectDB()
// connecting to database

// const { Console } = require('console')
// console.log(dataList)
// function dataa() {
//      dataList.forEach(el => {
//         name(el.name)
//         let nam = el.name
//         let mail = el.email
//         const total = `${nam} ${mail}`
//         return{
//             total
//         }
//     });
// }


// console.log(dataa(dataList[2]))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
app.use(express.static(path.join(__dirname, 'public')))

// helps in parsing data to the server from the user
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({extended: true}))
app.use(session({
secret: 'keyboardcat',
    saveUninitialized: true,
    resave: true
}))
app.use(flash())


const rand = Math.floor(Math.random()*10)+1
const username = 'joseph'
const allCourses = ['WDD', 'AutoCad', 'Grapics Design']
const data = {
    allCourses: allCourses,
    username: username,
    rand: rand
}

app.get('/about.ejs', (req,res)=>{
    res.render('about.ejs', {data} )
})
app.get('/courses.ejs', (req,res)=>{
    res.render('courses.ejs', {data})
})
// app.get('/userData', (req,res) =>{
//     res.render('userData.ejs',{dataList})
// })
app.get('/allUser', (req,res) =>{
    res.render('allUser.ejs',{dataList})
})
app.get('/register', (req,res) =>{
    res.render('register.ejs', { messages: req.flash('info') })
})
app.get('/login', (req,res) =>{
    res.render('login.ejs', { messages: req.flash('info') })
})
app.get('/weather', (req,res) =>{
    res.render('weather.ejs')
})
app.get('/weather', (req,res) =>{
    res.render('weather.ejs')
})
app.get('/adminreg', (req,res) =>{
    res.render('adminreg.ejs', { messages: req.flash('info') } )
})
app.get('/adminDashboard', async(req, res)=>{
    const allUsers = await User.find()
    // console.log(allUsers)
    res.render('adminDashboard.ejs', {allUsers})
})
app.get('/forgetpassword', async(req, res)=>{
       res.render('forgetpassword.ejs', { messages: req.flash('info') } )
})
// app.get('/userlogin', async(req, res)=>{
//     const allUsers = await User.findOne({username: username})
//     // console.log(allUsers)
//     if(allUsers){
//     res.render('userlogin.ejs', {...allUsers})}
// })
// app.get('/:userLogin', async(req, res)=>{
//     const{username} = req.body
//     const userInfo = await User.findOne({username: username})
//     console.log(userInfo)
//     if(userInfo){
//     res.render('userlogin.ejs', {...userInfo})}
// })
app.post('/forgetpassword', async(req,res)=>{
    const {username, newpassword} = req.body
    // console.log({username,newpassword})
    if(username.length<10 ||  newpassword.length<7){
        req.flash('info', 'username must be greater than 10 and password must be greater than 7!')
        res.redirect('/forgetpassword')
    }else{
        const hashedPassword = await bcrypt.hash(newpassword, 10)
        const user = await User.findOneAndUpdate({username: username}, {$set:{password: hashedPassword}})
        // console.log(user)
        req.flash('info', 'password sucessfully updated!')
        res.redirect('/login')
    }
})
  let foundUser  // logining in the user into his or her dashbord 
app.post('/login', async(req,res) => {
    const{username, password} = req.body
    // console.log({username, password})
     foundUser = await User.findOne({username: username})
    // console.log(foundUser)
    if(foundUser){
        const user = await bcrypt.compare(password, foundUser.password)
        if (user){
            res.redirect('/')
        }else{
            req.flash('info', 'Username or paswword is not found')
            res.redirect('/login')
        }} else{
            const foundAdmin = await admin.findOne({username: username})
            if(foundAdmin){
                const user = await bcrypt.compare(password, foundAdmin.password)
                if(user){
                    res.redirect('/adminreg')
                } else{
                    req.flash('info','Username or paswword is not found')
                    res.redirect('/login')
               }
            }}
        })
        app.get('/', (req,res)=>{
            // console.log(foundUser)
            res.render("index.ejs", {foundUser})
        })
    //    await deleteOne()
    
// } else{
//         req.flash('info', 'Username or password is incorect')
//         res.redirect('/login')
//     }
// })

app.post('/registration', async(req,res)=>{ 
    try{
    const{username, password, fullname, passport, phone} = req.body
    // console.log({username, password})
    const foundUser = await User.findOne({username: username})
    if(foundUser){
        req.flash('info', 'User Already Exist')
        res.redirect('/register')
    }
    const hashedPassword = await bcrypt.hash(password, 10)// the high the salt rounds the long=er time it takes for it to deliver 
    const user = new User({
        username: username,
        password: hashedPassword,
        role: 'user',
        active: true,
        fullname: fullname,
        passport: passport,
        phone:phone
    })
      await user.save()
      res.redirect('/login')
}
catch(error){
    console.log(error)
  }
})


  app.post('/adminreg', async(req,res)=>{ 
    try{
    const{username, password} = req.body
    // console.log({username, password})
    const foundUser = await admin.findOne({username: username})
    if(foundUser){
        req.flash('info', 'User Already Exist')
        res.redirect('/adminreg')
    }
    const hashedPassword = await bcrypt.hash(password, 10)// the high the salt rounds the long=er time it takes for it to deliver 
    const user = new admin({
        username: username,
        password: hashedPassword,
        role: 'admin',
        active: true
    })
      await user.save()
      res.redirect('/login')
}
      catch(error){
        console.log(error)
      }
    })
  
// app.post('/registration', (req,res)=>{
//     const{username, password} = req.body
//     console.log({username, password})
//     if(username.length<4 || password.length<7){
//         res.status(403).json({message: "invalid credentials"})}
//             // res.redirect('/register')}
//     // }else {res.status(200).json({message:"user registration is successfull"})
//     else{res.redirect('/')}
//     })

// app.get('/:username', (req,res) => {
//     const{username} = req.params
//     // console.log(username)
//     const userInfo = dataList.find((el) => {
//         return el.username === username
//     })
//     console.log(userInfo)
//     if(userInfo&&userInfo){
//         console.log(userInfo)
//         res.render("userData.ejs", {...userInfo})
//     }
//     // res.render('userData.ejs', {...userInfo})
// })
app.get('/:username', async(req,res) => {
    const{username} = req.params
    console.log(username)
   const userds = await User.findOneAndDelete({username:username})
   console.log(userds)
    res.redirect('/adminDashboard')
    
    })
  
// app.get('*', (req,res)=>{
//     res.render('404.ejs')
// })
const port = 2080
app.listen(port, ()=>{
    console.log(`listening to port ${port}`)
})    