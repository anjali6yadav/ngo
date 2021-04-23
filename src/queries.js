const Pool = require('pg').Pool
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const session = require('express-session')


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432
})



function getAuthToken(userid) {
    return jwt.sign(userid, 'KonvergeToken', { expiresIn: '9 days' })
}
const createUser = async (req, res) => {


    const { emailid, usertype, hashpwd } = req.body.params
    /* const token= getAuthToken({userid:36})
    console.log(token) */
    console.log(emailid, usertype, hashpwd)

    try {
        result = await pool.query('SELECT * from userlogin WHERE emailid=$1', [emailid])
        if (result.rowCount > 0) {
            return res.status(203).send("duplicate login")
        }

        result = await pool.query('INSERT INTO userlogin (emailid, usertype, hashpwd) VALUES ($1,$2,$3)', [emailid, usertype, hashpwd])

        /*   result = await pool.query('SELECT userid from userlogin WHERE hashpwd=$1', [hashpwd])
          const userid= result.rows[0].userid
           console.log("user create "+userid)
           const token= getAuthToken({userid:userid}) */
        // console.log(token) 
        res.status(201).send("Registration successfull")
        //  res.status(201).send(token)
    } catch (e) {
        res.status(400).send("Something went wrong")
    }




    /*  pool.query('INSERT INTO userlogin (emailid, usertype, hashpwd) VALUES ($1,$2,$3)', [emailid, usertype, hashpwd], (error, result) => {
         try {
             if (error) {
                 throw error
             }
             res.status(201).send(token)
         } catch (e) {
             res.status(400).send("Something went wrong")
         }
     }) */

}


const emailVerify = async (req, res) => {
   const { emailid } = req.params
   console.log(req.params)

    try {
     
        result = await pool.query('SELECT * FROM userlogin  WHERE emailid=$1', [emailid])
        //result = await pool.query('SELECT * FROM userlogin ')
       
        if (result.rowCount === 0) {
          //  console.log(result.rowCount)
            return res.status(203).json({msg:"NO record in table",data:null})
        }
       
       /* let user=  {
        "userid": result.rows[0].userid,

        "emailid": result.rows[0].emailid,
        "usertype": result.rows[0].usertype,
        "pwd": result.rows[0].pwd,
        "hashpwd": result.rows[0].hashpwd
    } 
    return res.status(200).json({msg:"Data Found",data:user}) */
          return res.status(200).send(result.rows)
      //  return res.status(200).json({msg:"Data Found",data:result.rows})
    }
    catch (e) {
        return res.status(404).json({msg:"NO record in table",data:null})

    }

}

const forgetPWD = async (req, res) => {
    const { userid } = req.params
    const useridd = parseInt(userid)
    
    const { hashpwd } = req.body.params
   
    try {

        result = await pool.query('UPDATE userlogin SET hashpwd=$1 WHERE userid=$2', [hashpwd, userid])
        if (result.rowCount === 0) {
            console.log(result.rowCount)
            return res.status(203).send("email not register")
        }

        return res.status(200).send(result.rows)
    }
    catch (e) {
        res.status(404).send("no record")
    }
}


const getUser = (req, res) => {
    console.log("req rec")

    pool.query('SELECT * FROM userlogin', (error, result) => {
        try {
            if (error) {
                throw error
            }
            if (result.rowCount === 0) {
                res.status(400).send("NO record in table")
            }

            res.status(200).send(result.rows)
        } catch (e) {
            res.status(404).send("no record")
        }
    })
}



////////queries for ngo reg start

const getLoginAuthngoreg = async (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '')
    // console.log(`Token: ${token}`)
    const decode = jwt.verify(token, 'KonvergeToken')
    //  console.log(decode.userid)
    const chkuserid = decode.userid
    console.log(chkuserid)
    try {

        result = await pool.query('SELECT * FROM tbl_ngoregistration WHERE userid = $1', [chkuserid])
        if (result.rowCount === 0) {
            console.log(result.rowCount)
            result = await pool.query('SELECT userid FROM userlogin  WHERE userid=$1', [chkuserid])
          //  const uid = result.rows[0].userid
            return res.status(201).send(result.rows)

        }

        return res.status(200).send(result.rows)
        // res.status(200).send(result.rows)
    } catch (e) {
        res.status(404).send("data not found in table")
    }

}






const createUserNgo = async (req, res) => {
    // console.log(req.body)
    
    const { userid, ngoname, ngoemail, ngomobno, address, city, pincode, regno, ngoareaofservice, activity, contpername, contpermobno, contperemailadd } = req.body.params
    console.log(userid, ngoname, ngoemail, ngomobno, address, city, pincode, regno, ngoareaofservice, activity,
        contpername, contpermobno, contperemailadd)
    try {
        result = await pool.query('INSERT INTO tbl_ngoregistration (userid,ngoname, ngoemail, ngomobno, address, city, pincode, regno, ngoareaofservice,activity, contpername, contpermobno,contperemailadd) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)', [userid, ngoname, ngoemail, ngomobno, address, city, pincode, regno, ngoareaofservice, activity, contpername, contpermobno, contperemailadd])
        res.status(201).send("User Created")
    } catch (e) {
        res.status(400).send("Something went wrong")
    }
    /*   pool.query('INSERT INTO tbl_ngoreg (ngoname, ngoemail, ngomobno, address, city, pincode, regno, ngoareaofservice,activity, contpername, contpermobno,contperemailadd) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)', [ngoname, ngoemail, ngomobno, address, city, pincode, regno, ngoareaofservice,activity, contpername,  contpermobno,contperemailadd], (error, result) => {
          try {
              if (error) {
                  throw error
              }
              res.status(201).send("User Created")
          } catch (e) {
              res.status(400).send("Something went wrong")
          }
      }) */
}


const getUserNgoReg = async (req, res) => {
    const { ngoemailid } = req.params

    try {
        result = await pool.query('SELECT * FROM tbl_ngoregistration  WHERE ngoemail = $1', [ngoemailid])
        if (result.rowCount === 0) {
            console.log(result.rowCount)
            return res.status(203).send("NO record in table")
        }
       
        return res.status(200).send(result.rows)
    }
    catch (e) {
        res.status(404).send("no record")
    }

    /*     pool.query('SELECT * FROM tbl_ngoreg WHERE ngoemail = $1', [ngoemailid], (error, result) => {
            try {
                if (error) {
                    throw error
                }
                if (result.rowCount === 0) {
                    console.log(result.rowCount)
                 return   res.status(203).send("NO record in table")
                }
    
               return res.status(200).send(result.rows)
            } catch (e) {
                res.status(404).send("no record")
            }
        }) */
}



const updateUserNgo = async (req, res) => {
    const { id } = req.params
    const ngoid = parseInt(id)
   
    const { userid, ngoname, ngoemail, ngomobno, address, city, pincode, regno, ngoareaofservice, contpername, contperemailadd, contpermobno } = req.body.params
    console.log(userid, ngoname, ngoemail, ngomobno, address, city, pincode, regno, ngoareaofservice,
        contpername, contperemailadd, contpermobno)
    try {
        result = await pool.query('UPDATE tbl_ngoregistration SET userid=$1,ngoname=$2,ngoemail=$3,ngomobno=$4,address=$5,city=$6,pincode=$7,regno=$8,ngoareaofservice=$9,contpername=$10,contperemailadd=$11,contpermobno=$12 WHERE ngoid = $13', [userid, ngoname, ngoemail, ngomobno, address, city, pincode, regno, ngoareaofservice, contpername, contperemailadd, contpermobno, ngoid])
        res.status(201).send("User update")
    } catch (e) {
        res.status(400).send("Something went wrong")
    }
    /*   pool.query('UPDATE tbl_ngoreg SET ngoname=$1,ngoemail=$2,ngomobno=$3,address=$4,city=$5,pincode=$6,regno=$7,ngoareaofservice=$8,contpername=$9,contperemailadd=$10,contpermobno=$11 WHERE ngoid = $12', [ngoname, ngoemail, ngomobno, address, city, pincode, regno, ngoareaofservice, contpername, contperemailadd, contpermobno, ngoid], (error, result) => {
          
           try {
               if (error) {
                   throw error
               }
               res.status(201).send("User update")
           } catch (e) {
               res.status(400).send("Something went wrong")
           }
       }) */

}


const deleteUserNgo = async (req, res) => {
    const { id } = req.params
    const ngoid = parseInt(id)
    try {
        result = await pool.query('DELETE FROM tbl_ngoregistration  WHERE ngoid = $1', [ngoid])

        res.status(200).send(`User deleted `)
    }
    catch (e) {
        res.status(404).send(`unable to  deleted `)
    }


}
////////queries for ngo reg end





////////queries for ngo project start


const getproname = async (req, res) => {
    const { projectname } = req.params
    console.log(projectname)
    try {
        result = await pool.query('SELECT * FROM tbl_ngoproject  WHERE projectname = $1', [projectname])
        if (result.rowCount === 0) {
            console.log(result.rowCount)
            return res.status(203).send("NO record in table")
        }

        return res.status(200).send(result.rows)
    }
    catch (e) {
        res.status(404).send("no record")
    }

    /*     pool.query('SELECT * FROM tbl_ngoreg WHERE ngoemail = $1', [ngoemailid], (error, result) => {
            try {
                if (error) {
                    throw error
                }
                if (result.rowCount === 0) {
                    console.log(result.rowCount)
                 return   res.status(203).send("NO record in table")
                }
    
               return res.status(200).send(result.rows)
            } catch (e) {
                res.status(404).send("no record")
            }
        }) */
}




const getLoginAuthngoproject = async (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decode = jwt.verify(token, 'KonvergeToken')
    const userid = decode.userid
   
    try {
        result = await pool.query('SELECT * FROM tbl_ngoregistration WHERE userid = $1', [userid])
        const ngoidchk = result.rows[0].ngoid
        console.log("ngooidddd" + ngoidchk)


        result = await pool.query('SELECT * FROM tbl_ngoproject WHERE ngoid= $1', [ngoidchk])


        if (result.rowCount === 0) {
            console.log(result.rowCount)
            result = await pool.query('SELECT ngoid FROM tbl_ngoregistration  WHERE ngoid=$1', [ngoidchk])
            const ngoid = result.rows[0].ngoid
            console.log(ngoid)
            return res.status(201).send(result.rows)

        }
      //  console.log(result.rows)

        return res.status(200).send(result.rows)
    } catch (e) {
        res.status(404).send("data not found in table")
    }

}

const createUserNgoPro = async (req, res) => {
    /*  console.log(req.body) */
    const { ngoid, projectname, location, proleadname, description, photos } = req.body.params
    console.log(ngoid, projectname, location, proleadname, description, photos)

    try {
        result = await pool.query('SELECT * from tbl_ngoproject WHERE projectname=$1', [projectname])
        if (result.rowCount > 0) {
            return res.status(203).send("duplicate")
        }
        result = await pool.query('INSERT INTO tbl_ngoproject (ngoid,projectname,location,proleadname,description,photos) VALUES ($1,$2,$3,$4,$5,$6)', [ngoid, projectname, location, proleadname, description, photos])
        res.status(201).send("User Created")

    } catch (e) {
        res.status(400).send("Something went wrong")
    }
    /*  pool.query('INSERT INTO tbl_ngoproject (ngoid,projectname,location,proleadname,description,photos) VALUES ($1,$2,$3,$4,$5,$6)', [ngoid, projectname, location, proleadname, description, photos], (error, result) => {
          try {
              if (error) {
                  throw error
              }
              res.status(201).send("User Created")
          } catch (e) {
              res.status(400).send("Something went wrong")
          }
      }) */

}


const getUserNgoPro = async (req, res) => {
    const { ngoemailid } = req.params
    try {
        result = await pool.query('SELECT * from tbl_ngoproject WHERE projectname=$1', [projectname])
        if (result.rowCount > 0) {
            return res.status(203).send("duplicate")
        }
        result = await pool.query('SELECT * FROM tbl_ngoreg WHERE ngoemail = $1', [ngoemailid])
        if (result.rowCount === 0) {
            res.status(400).send("NO record in table")
        }

        res.status(200).send(result.rows)
    } catch (e) {
        res.status(404).send("no record")
    }
    /*  pool.query('SELECT * FROM tbl_ngoproject', (error, result) => {
         try {
             if (error) {
                 throw error
             }
             if (result.rowCount === 0) {
                 res.status(400).send("NO record in table")
             }
 
             res.status(200).send(result.rows)
         } catch (e) {
             res.status(404).send("no record")
         }
     })
  */
}



const updateUserPro = (req, res) => {
    //const ngoproid = parseInt(req.params.id)
    
    const { ngoproid } = req.params
    const ngoprojectid = parseInt(ngoproid)
    
    const { ngoid, projectname, location, proleadname, description, photos } = req.body.params
    console.log(ngoid, projectname, location, proleadname, description, photos)
    pool.query('UPDATE tbl_ngoproject SET ngoid=$1,projectname=$2,location=$3,proleadname=$4,description=$5,photos=$6 WHERE ngoproid = $7', [ngoid, projectname, location, proleadname, description, photos, ngoprojectid], (error, result) => {

        try {
            if (error) {
                throw error
            }
            res.status(201).send("User update")
        } catch (e) {
            res.status(400).send("Something went wrong")
        }
    })

}


const deleteUserPro = (req, res) => {
    const { id } = req.params
    const ngoproid = parseInt(id)

    pool.query('DELETE FROM tbl_ngoproject WHERE ngoproid = $1', [ngoproid], (error, results) => {

        try {
            if (error) {
                throw error
            }
            res.status(200).send(`User deleted `)
        }
        catch (e) {
            res.status(404).send(`unable to  deleted `)
        }

    })
}

////////queries for ngo project end




////////queries for ngo pitch start

const getpitchname = async (req, res) => {
    const { ngoproid } = req.params
    const projectid = parseInt(ngoproid)
    console.log(projectid)
    try {
        result = await pool.query('SELECT * FROM tbl_ngopitch  WHERE ngoproid = $1', [projectid])
        if (result.rowCount === 0) {
            console.log(result.rowCount)
            return res.status(203).send("NO record in table")
        }

        return res.status(200).send(result.rows)
    }
    catch (e) {
        res.status(404).send("no record")
    }
}

const getpitchdata = async (req, res) => {
    const { pitchproname } = req.params
    console.log(req.params)
   
    try {
        result = await pool.query('SELECT * FROM tbl_ngopitch  WHERE pitchprojectname = $1', [pitchproname])
        if (result.rowCount === 0) {
            console.log(result.rowCount)
            return res.status(203).send("NO record in table")
        }

        return res.status(200).send(result.rows)
    }
    catch (e) {
        res.status(404).send("no record")
    }
}

const getLoginAuthngopitch = async (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decode = jwt.verify(token, 'KonvergeToken')
    const userid = decode.userid
  
    try {
        result = await pool.query('SELECT * FROM tbl_ngoregistration WHERE userid = $1', [userid])
        const ngoidchk = result.rows[0].ngoid
        console.log("ngo id " + ngoidchk)
        result = await pool.query('SELECT * FROM tbl_ngoproject WHERE ngoid= $1', [ngoidchk])
        /*     const ngoproid= result.rows[0].ngoproid
            console.log("ngo pro id "+ngoproid)   
            result = await pool.query('SELECT * FROM tbl_ngopitch  WHERE ngoproid=$1', [ngoproid])
    
           if(result.rowCount === 0){
               console.log(result.rowCount)
               result = await pool.query('SELECT * FROM tbl_ngoproject  WHERE ngoproid=$1', [ngoproid])
               const ngoproject= result.rows[0].ngoproid
               console.log(ngoproject)
             return  res.status(201).send(result.rows)
           } */
        return res.status(200).send(result.rows)

    } catch (e) {
        res.status(404).send("data not found in table")
    }

}

const createUserPitch = (req, res) => {
    console.log(req.body)
    const { ngoproid, pitchprojectname, pitchdescription } = req.body.params
    console.log(ngoproid, pitchprojectname, pitchdescription)
    pool.query('INSERT INTO tbl_ngopitch (ngoproid,pitchprojectname,pitchdescription) VALUES ($1,$2,$3)', [ngoproid, pitchprojectname, pitchdescription], (error, result) => {
        try {
            if (error) {
                throw error
            }
            res.status(201).send("User Created")
        } catch (e) {
            res.status(400).send("Something went wrong")
        }
    })
}



const getUserNgoPitch = async (req, res) => {
    try {
        result = await pool.query('SELECT * FROM tbl_ngoproject ')
        if (result.rowCount === 0) {
            console.log(result.rowCount)
            return res.status(400).send("NO record in table")
        }

        return res.status(200).send(result.rows)
    } catch (e) {
        res.status(404).send("error")
    }
    /* pool.query('SELECT * FROM tbl_ngopitch', (error, result) => {
        try {
            if (error) {
                throw error
            }
            if (result.rowCount === 0) {
                res.status(400).send("NO record in table")
            }

            res.status(200).send(result.rows)
        } catch (e) {
            res.status(404).send("no record")
        }
    }) */
}


const getUserNgoPitchbyid = (req, res) => {
    const { ngopitchid } = req.params
    const pitchid = parseInt(ngopitchid)
    console.log(req.params)
    pool.query('SELECT * FROM tbl_ngopitch WHERE ngopitchid=$1', [pitchid], (error, result) => {
        try {
            if (error) {
                throw error
            }
            if (result.rowCount === 0) {
                res.status(400).send("NO record in table")
            }
            if (result) {
                res.status(200).send(result.rows)
            }
            //res.status(200).send(result.rows)
        } catch (e) {
            res.status(404).send("no record")
        }
    })
}


const updateUserPitch = (req, res) => {
    const { ngopitchid } = req.params
    const pitchid = parseInt(ngopitchid)
    console.log(pitchid)
    const { ngoproid, pitchprojectname, pitchdescription } = req.body.params
    console.log(ngoproid, pitchprojectname, pitchdescription)
    pool.query('UPDATE tbl_ngopitch SET ngoproid=$1,pitchprojectname=$2,pitchdescription=$3 WHERE ngopitchid = $4', [ngoproid, pitchprojectname, pitchdescription, pitchid], (error, result) => {

        try {
            if (error) {
                throw error
            }
            res.status(201).send("User update")
        } catch (e) {
            res.status(400).send("Something went wrong")
        }
    })

}


const deleteUserPitch = (req, res) => {
    const { id } = req.params
    const ngopitchid = parseInt(id)
    pool.query('DELETE FROM tbl_ngopitch WHERE ngopitchid = $1', [ngopitchid], (error, results) => {

        try {
            if (error) {
                throw error
            }
            // res.status(200).send(`User deleted `)

            if (results === ngopitchid) {
                res.status(200).send(`User deleted `)

            }
            res.status(404).send(`User not found `)
        }
        catch (e) {
            res.status(404).send(`unable to  deleted `)
        }

    })
}

////////queries for ngo pitch start


////////login auth


const getLogin = (req, res) => {
    const { emailid, hashpwd } = req.body.params
    console.log(emailid, hashpwd)
    pool.query('SELECT * FROM userlogin  WHERE emailid=$1 AND hashpwd=$2', [emailid, hashpwd], (error, result) => {
        try {
            if (error) {
                throw error
            }
            if (result.rowCount === 0) {
                return res.status(400).send("invalid username and password")
            }
            res.status(200).send("login sucessfully")
        } catch (e) {
            res.status(404).send("invalid login")
        }
    })
}

const getUserEmail = (req, res) => {

    // const ngoemail = req.body.params

    pool.query('SELECT * FROM tbl_ngoreg', (error, result) => {
        try {
            if (error) {
                throw error
            }
            if (result.rowCount === 0) {
                res.status(400).send("NO record in table")
            }
            if (result) {
                res.status(200).send(result.rows)
            }
            //res.status(200).send(result.rows)
        } catch (e) {
            res.status(404).send("no record")
        }
    })
}


/* 
const getLoginAuth = async (req, res) => {
        //console.log(req.header('Authorization')) 
    const { emailid, usertype , hashpwd} = req.body.params
      console.log(req.body.params) 
    const token = req.header('Authorization').replace('Bearer ', '')
  // console.log(`Token: ${token}`)
    const decode = jwt.verify(token, 'KonvergeToken')
     console.log(decode.userid)
    const chkuserid = decode.userid

    try {
      //  result = await pool.query('SELECT * FROM userlogin  WHERE userid=$1 AND emailid=$2 AND  usertype=$3 AND hashpwd=$4  ', [chkuserid,emailid, usertype , hashpwd])
        result = await pool.query('SELECT * FROM userlogin  WHERE userid=$1 ', [chkuserid])
       
        if (result.rowCount === 0) {
            return res.status(400).send("invalid username and password")
        }
        res.status(200).send("login sucessfully")
    } catch (e) {
        res.status(404).send("invalid login")
    }

} */





const getLoginAuth = async (req, res, next) => {
    //console.log(req.header('Authorization')) 

    const { emailid, pwd, usertype, hashpwd } = req.body.params
    /* const token = req.header('Authorization').replace('Bearer ', '')
    const decode = jwt.verify(token, 'KonvergeToken')
    const chkuserid = decode.userid */
    // req.session.loginattempt = 0

    try {

        // result = await pool.query('SELECT * FROM userlogin  WHERE  emailid=$1 AND  usertype=$2 AND hashpwd=$3  ', [emailid, usertype, hashpwd ])
        result = await pool.query('SELECT userid, hashpwd FROM userlogin WHERE emailid = $1', [emailid])
        const hashpwd = result.rows[0].hashpwd

        req.session.emailid = emailid
        console.log(req.session.emailid)
        const isMatch = await bcrypt.compare(pwd, hashpwd)
        if (!isMatch) {
            req.session.loginattempt++
            console.log(req.session.loginattempt)

            if (req.session.loginattempt > 2) {
                return res.status(400).send('login attempts over')
            }

            return res.status(400).send('invalid username and password')
        }
        const userid = result.rows[0].userid

        const token = getAuthToken({ userid: userid })

        res.status(201).send({token, userid})
        // res.status(200).send("login sucessfully")
    } catch (e) {

        res.status(404).send("something went wrong")
    }

}




const getLoginForProfile = async (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '')
    //console.log(`Token: ${token}`)
    const decode = jwt.verify(token, 'KonvergeToken')
    // console.log(decode.userid)
    const chkuserid = decode.userid

    try {

        result = await pool.query('SELECT * FROM userlogin WHERE userid = $1', [chkuserid])
        if (result.rowCount === 0) {
            console.log(result.rowCount)
            return res.status(201).send("result.rows")

        }

        return res.status(200).send(result.rows)
        // res.status(200).send(result.rows)
    } catch (e) {
        res.status(404).send("data not found in table")
    }

}


const updateProfile = (req, res) => {
    const { userid } = req.params
    const useridupt = parseInt(userid)
  
    const { emailid, usertype, hashpwd } = req.body.params
    console.log(emailid, usertype, hashpwd)
    pool.query('UPDATE userlogin SET emailid=$1,usertype=$2,hashpwd=$3 WHERE userid = $4', [emailid, usertype, hashpwd, useridupt], (error, result) => {

        try {
            if (error) {
                throw error
            }
            res.status(201).send("User update")
        } catch (e) {
            res.status(400).send("Something went wrong")
        }
    })

}
////login auth end



const getsales = async (req, res) => {

    try {
        result = await pool.query('SELECT month, proda,prodb from sales')
        res.status(200).send(result.rows)

    } catch (e) {

    }

}


module.exports = {
    createUser,  emailVerify, forgetPWD,  getUser,
    getLoginAuthngoreg, createUserNgo, getUserNgoReg, updateUserNgo, deleteUserNgo,
    getproname, getLoginAuthngoproject, getUserNgoPro, createUserNgoPro, updateUserPro, deleteUserPro,
    getpitchname,getpitchdata, getLoginAuthngopitch, getUserNgoPitch, getUserNgoPitchbyid, createUserPitch, updateUserPitch, deleteUserPitch,
    getLogin, getUserEmail,
    getLoginAuth, getLoginForProfile, updateProfile,
    getsales,
  
}