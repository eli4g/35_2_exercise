/** Routes for invoices **/

const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");



router.get('/', async(req,res,next) =>{

    try{

        const results = await db.query('SELECT * from invoices order by id;')
        return res.json({invoices: results.rows})

    }catch(e){
        return next(e);
    }


})


router.get('/:id', async(req,res,next) =>{


    try{
        const {id} = req.params;
        const results = await db.query('SELECT * from invoices where id = $1',[id]);
        if (results.rows.length ===0){
            throw new ExpressError(`Cannot find invoice with id: ${id}`,404);
        }
        return res.json({invoice: results.rows[0]})
    }catch(e){

        return next(e);
    }


})

router.post('/', async(req,res,next) =>{

    try{
        const{comp_code, amt, paid, add_date,paid_date} = req.body;
        const results = await db.query('INSERT INTO invoices (comp_code, amt, paid, add_date,paid_date) values ($1,$2,$3,$4,$5) RETURNING id,comp_code, amt, paid, add_date,paid_date', [comp_code, amt, paid, add_date,paid_date]);
        return res.status(201).json({invoice: results.rows[0]});

    }catch(e){
        return next(e);
    }


})



router.patch('/:id', async(req,res,next)=>{

    try{
        const{id} = req.params;
        const{comp_code, amt, paid, add_date,paid_date} = req.body;
        const results = await db.query('UPDATE invoices  set comp_code = $1, amt = $2, paid = $3, add_date = $4 ,paid_date = $5 where id = $6 RETURNING id,comp_code, amt, paid, add_date,paid_date', [comp_code, amt, paid, add_date,paid_date,id]);
        if (results.rows.length ===0){
            throw new ExpressError(`Cannot update invoice with id: ${id}, as it does not exist`,404);
        }
        return res.status(200).json({invoice:results.rows[0]})

    }catch(e){
        return next(e);
    }

})


router.delete('/:id', async(req,res,next) =>{

    try{
        const{id} = req.params;
        const resultsCheck = await db.query("SELECT * from invoices where id = $1",[id]);
        if (resultsCheck.rows.length ===0){
            throw new ExpressError(`Cannot delete invoice with id: ${id}, as it does not exist`,404);
        }
                
        const results = await db.query('delete from invoices where id = $1', [id]);

        return res.send({message: `Invoice ${id} has been deleted.`});

    }catch(e){
        return next(e);
    }

    


})



module.exports = router;