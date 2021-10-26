const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const customers = require('./customer.json');
const { response } = require('express');

app.get('/api/customers',(req,res)=>{
    res.send(customers);
});

app.get('/api/customers/:id',(req,res)=>{
    let customer = customers.find(c => c.id === parseInt(req.params.id));
    if(!customer){
        res.status(404).send('Not found');
        return;
    }
    res.send(customer);
});


app.post('/api/customers',(req,res)=>{
    
    const schema = Joi.object({
        id : Joi.number().required(),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        city : Joi.string().regex(/^(Ahmedabad|Vadodara|Surat)$/).required(),
        company : Joi.string().equal("SublimeDataSystems").required()
    });
    const result = schema.validate(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const customer = {
        id: req.body.id, 
        name: req.body.first_name,
        last_name: req.body.last_name,
        city : req.body.city,
        company : req.body.company
    };
    customers.push(customer);
    res.send(customers);
});

app.get('/api/cities',(req,res)=>{
    
    const cities = new Map();

    customers.forEach(element => {
        const x = cities.get(element.city);
        if (x == undefined){
            // current city is not present in map
            // add current city

            cities.set(element.city, 1);
        }
        else {
            cities.set(element.city, x + 1);
            }
    }); 
    res.send(Array.from(cities, ([name, value]) => ({ name, value })))
});

const port = process.env.PORT || 7777
app.listen(port,()=>{
    console.log('Server is running on http://localhost:'+port);
});
