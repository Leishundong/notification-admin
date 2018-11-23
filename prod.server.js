/**
 * Created by Administrator on 2018/5/28.
 */

//上线调试
const express=require('express');


const app=express();

app.use(express.static('./dist'));

let port=7071;

app.listen(port,()=>{
  console.log(`http://localhost:${port}`)
});
