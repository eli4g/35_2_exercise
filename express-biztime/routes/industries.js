/** Routes for industries **/

const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");




router.get('/', async (req,res,next) =>{

    try{
        const results = await db.query('SELECT industries.ind_code ind_code, industry, array_agg(code) companies from industries LEFT JOIN industries_companies on industries_companies.ind_code =  industries.ind_code LEFT JOIN companies on industries_companies.comp_code = companies.code GROUP BY industries.ind_code;');
        
          
       return res.json ({industries: results.rows});
       
    } catch(e){
        return next(e);
    }


})


router.post('/', async (req,res,next) =>{

    try{
        const{ind_code, industry}  = req.body;
        const results = await db.query('insert into industries (ind_code, industry) values ($1,$2) returning ind_code, industry', [ind_code, industry]);
        return res.status(201).json({industry: results.rows[0]});
    }catch(e){
        return next(e);
    }



})


router.post('/companies/', async (req,res,next) =>{

    try{
        const{ind_code, comp_code}  = req.body;
        const results = await db.query('insert into industries_companies (ind_code, comp_code) values ($1,$2) returning ind_code, comp_code', [ind_code, comp_code]);
        return res.status(201).json({industries_companies: results.rows[0]});
    }catch(e){
        return next(e);
    }



})






module.exports = router;
