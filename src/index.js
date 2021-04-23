const express = require('express')
const db = require('./queries')
const session = require('express-session')
const bodyParser = require('body-parser');
const app = express()


app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false})); 

const port = process.env.port || 8081

app.get('', (req,res) => {
    res.status(200).send("Nothing to display")
})

app.use(session({
    secret: 'konvergejj',
    resave: false,
    saveUninitialized: true,
      cookie: {
         secure:false,
         httpOnly:true,
         maxAge:1000*60*30

     } 
}
  
  ))



/////////All demo Route here start

/* app.get('/users', (req,res) => {
    res.status(200).send("No lists to display")
}) */

/* app.post('/login', db.getLogin) */

app.get('/users', db.getUser)

app.get('/users/:id', (req,res) => {
    console.log(req.params.id)
    res.status(401).send("user not found")
})


/*  app.post('/users',(req,res) => {
    console.log(req.body)
    res.status(201).send("user created")
    
}) */


app.put('/users/:id', (req,res) => {
    
    console.log(req.params.id)
    res.send("updated record")
})

/////////All demo Route here end




///////alll routes for   signupstart

app.post('/usersreg', db.createUser)
app.get('/useremail/:emailid', db.emailVerify)
app.put('/forgetpwd/:userid', db.forgetPWD)
///////alll routes for   signup end

///////alll routes for   login start
app.post('/logauthprofile', db.getLoginForProfile)
app.put('/profileupt/:userid', db.updateProfile)
app.get('/fetchemail', db.getUserEmail)
app.post('/login', db.getLogin)
app.post('/loginauth', db.getLoginAuth)

///////alll routes for login  end




///////alll routes for ngo reg start

app.post('/logauthngoreg', db.getLoginAuthngoreg)
app.post('/ngousers/:ngoemailid', db.getUserNgoReg)
app.post('/ngoreg', db.createUserNgo)
app.put('/ngousers/:id', db.updateUserNgo)
app.delete('/ngousersdel/:id', db.deleteUserNgo)

///////alll routes for ngo reg end




///////alll routes for ngo project start
app.post('/getproname/:projectname', db.getproname)

app.post('/logauthngoproject', db.getLoginAuthngoproject)

app.get('/ngoprousers/:ngoemailid', db.getUserNgoPro)

app.post('/ngoprousers', db.createUserNgoPro)

app.put('/ngoprousers/:ngoproid', db.updateUserPro)

app.delete('/ngoprousersdel/:id', db.deleteUserPro)

///////alll routes for ngo project end




///////alll routes for ngo pitch start
app.post('/getpitchname/:ngoproid', db.getpitchname)
app.post('/getpitchdata/:pitchproname', db.getpitchdata)
app.post('/logauthngopitch', db.getLoginAuthngopitch)

app.get('/ngopitchusers', db.getUserNgoPitch)

app.get('/ngopitchusers/:id', db.getUserNgoPitchbyid)

app.post('/ngopitchusers', db.createUserPitch)

app.put('/ngopitchusers/:ngopitchid', db.updateUserPitch)

app.delete('/ngopitchusersdel/:id', db.deleteUserPitch)

///////alll routes for ngo pitch end



app.get('/sales', db.getsales)



app.listen(port, () => {
    console.log("Server is up and running on port "+ port)
})

