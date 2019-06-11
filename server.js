const express = require('express');
const app = express();
const mongoose = require('mongoose');
// nodeMailer = require('nodemailer');
// const objectid = require('objectid'); 
const ObjectId = require('mongodb').ObjectID;
//body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

//view enginen
app.set("view engine","ejs");

//for database mongoose connect
mongoose.connect('mongodb://localhost/demoForm',{useNewUrlParser:true});
var db = mongoose.connection;
db.on('error',console.error.bind(console, 'connection-error'));
db.once('open',()=>{
    console.log('database connection succesfully');
});

//database schema
var schema = mongoose.Schema({
    name:String,
    phone:String,
    email:String
})
const formData = mongoose.model('formData',schema);


var flag = false;
var search = "";
//root 
app.get('/',(req,res)=>{


    if(!flag){

        formData.find({},(err,value)=>{
            if(err){
                console.log(err)
            }
            else{
                // console.log(value);
        res.render("home",{datas:value,flag:flag});
    
            }
        })


    }else{
        formData.find({},(err,value)=>{
            if(err){
                console.log(err)
            }
            else{
                // console.log(value);
        res.render("home",{datas:value,flag:flag,search:search});
                flag=false;
            }
        })
    }

    
})

app.post('/',(req,res)=>{
    var name = req.body.name;
    var phone = req.body.phone;
    var email  = req.body.email;
    console.log(name,email,phone)
    var fullData = {
        name:name,
        phone:phone,
        email:email
    }
    var dataAdd = new formData(fullData);
    dataAdd.save((err,value)=>{
        if(err){
            console.log(`error occur `);
        }
        else{
            console.log("data store succesfully")
        }
    })
    res.redirect('/');

})


app.get('/delete',(req,res)=>{
    // res.send(req.query.id)
    formData.remove({_id:req.query.id},(err)=>{
        if(err){
            throw err;
        }
        else{
            res.redirect('/');
        }
    })
})



app.get('/edit',(req,res)=>{
    console.log(req.query.id)
    var id = req.query.id;
    formData.findById(id, function (err, adventure) {
        if(err) throw err;
        else{
            res.render('edit',{data:adventure});

        }
    });



})
app.post('/edit',(req,res)=>{
    // var id =  req.body.id ;
    // var name = req.body.name;
    // var phone = req.body.phone;
    // var email  = req.body.email;
    // var fullData = {
    //     name:name,
    //     phone:phone,
    //     email:email
    // }
    // var setData = { $set : { fullData }};
    

    const updateData = formData.updateOne({_id: new ObjectId(req.body.id)},{
        $set: {
            name: req.body.name,
            phone:req.body.phone,
            email: req.body.email
        }
    }).then(result=>{ console.log("succes "+result["name"])
        res.redirect('/')
}).catch(err=>{console.log("error")});


    
})



//search
app.get('/search',(req,res)=>{
    var data = req.query.search;
    flag = true;
    search = data;
    console.log(search);
    res.redirect('/');
})


let port = 3000;
app.listen(port,()=>{
    console.log(`server started ${port}`);
});