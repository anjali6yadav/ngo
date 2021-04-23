const add = (a,b)=>{
     
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{

            if(a<0||b<0){
              return  reject("numbers must be positive")
            }
            resolve(a+b)
        },2000)
    })
}




const dowork = async ()=>{

const sum = await add(1,10)

//return sum
const sum2 = await add(sum,5)
const sum3 = await add(sum2,8)
return sum3
}

dowork().then((result)=>{

    console.log(result)
}).catch((e)=>{
    console.log(e)
})