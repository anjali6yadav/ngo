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

/* 
add(1,-1).then((sum)=>{
    console.log(sum)

    add(sum,-5).then((sum2)=>{
        console.log(sum2)
    }).catch((e)=>{
        console.log(e)
    })
}).catch((e)=>{
    console.log(e)
}) */


add(1,2).then((sum)=>{
    console.log(sum)
    return add(sum,5)

}).then((sum2)=>{
    console.log(sum2)
    return add(sum2,-7)
}).then((sum3)=>{
    console.log(sum3)
    
}).catch((e)=>{
    console.log(e)
    
})