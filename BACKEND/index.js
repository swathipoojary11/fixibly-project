const express=require('express');
const cors =require('cors');

const app=express();
app.use(cors());
app.use(express.json());
app.post('/api/login',(request,response)=>{
    const{email,password}=request.body;

     if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }
  return res.status(200).json({
    message: 'login successful'
  });

});
app.listen(3000,()=>{
    console.log("server started ");
});
