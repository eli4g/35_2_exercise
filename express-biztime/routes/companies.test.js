// Tell Node that we're in test "mode"
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');


let testCompany;
let testInvoice;

beforeEach(async() =>{
    const companyResult = await db.query("INSERT INTO companies (code,name,description) values ('amz', 'amazon','amazon online marketplace')  RETURNING code, name, description");
    testCompany = companyResult.rows[0];
    
    const invoiceResult = await db.query("INSERT INTO invoices (comp_code, amt, paid, add_date,paid_date) values ('amz',150,false,'2023-01-15T05:00:00.000Z',null) RETURNING id,comp_code, amt, paid, add_date,paid_date");
    testInvoice = invoiceResult.rows[0];
})

afterEach(async () => {
    await db.query(`DELETE FROM companies`)
    await db.query(`DELETE FROM invoices`)
  })



afterAll(async () => {
    await db.end()
})


describe("GET /companies", () =>{

    test("Get list of all companies", async () =>{
        const res = await request(app).get('/companies');
       
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({companies: [testCompany]})

    })



})



describe("GET /companies/:code", ()=>{

    test("Get a single company by the code", async() =>{
        const res = await request(app).get(`/companies/${testCompany.code}`);
        expect(res.statusCode).toBe(200);

        let invoiceObj = {invoices: [testInvoice]};
        let finalResults = testCompany;

        
        Object.assign(finalResults, invoiceObj);
        console.log(res.body);

        
        expect(res.body).toEqual({company: finalResults});


    })

    test("Responds with 404 for invalid code", async () => {
        const res = await request(app).get(`/companies/abcdefg`)
        expect(res.statusCode).toBe(404);
    })


})


describe("POST /companies", () =>{

    test("Create a new company", async() => {

        const res = await request(app).post('/companies').send({code: "apple", name: "apple corp" , description:  "apple corporation"});

        expect(res.statusCode).toBe(201);

        expect(res.body).toEqual({company: {code: "apple", name: "apple corp" , description: "apple corporation"} });



    })


})


describe("PATCH /companies/:code", () =>{

    test("Update a company", async() =>{

        const res = await request(app).patch(`/companies/${testCompany.code}`).send({code:"amz", name:"amazon corp", description: "amazon corporation"});

        expect(res.statusCode).toBe(200);


        expect(res.body).toEqual({company: {code: testCompany.code, name:"amazon corp", description: "amazon corporation"} });




    })


    test("Responds with 404 for invalid code", async () => {
        const res = await request(app).patch(`/companies/abcdefg`)
        expect(res.statusCode).toBe(404);
    })


})

describe("DELETE /companies/:code",() =>{

    test("Delete a company", async() =>{

        const res = await request(app).delete(`/companies/${testCompany.code}`)

        expect(res.body).toEqual({message: `Company ${testCompany.code} has been deleted.`})


    })

    test("Responds with 404 for invalid code", async () => {
        const res = await request(app).delete(`/companies/abcdefg`)
        expect(res.statusCode).toBe(404);
    })


})


describe("GET /invoices", () =>{

    test("Get list of all invoices", async () =>{
        const res = await request(app).get('/invoices');
       
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({invoices: [testInvoice]})

    })



})



describe("GET /invoice/:id", ()=>{

    test("Get a single invoice by the id", async() =>{
        const res = await request(app).get(`/invoices/${testInvoice.id}`);
        expect(res.statusCode).toBe(200);

              
        expect(res.body).toEqual({invoice: testInvoice});


    })

    test("Responds with 404 for invalid invoice id", async () => {
        const res = await request(app).get(`/invoices/0`)
        expect(res.statusCode).toBe(404);
    })


})


describe("POST /invoice", () =>{

    test("Create a new invoice", async() => {

        const res = await request(app).post('/invoices').send({comp_code: "amz", amt: "200" , paid:  false, add_date: '2023-01-15T05:00:00.000Z', paid_date: null});
        //comp_code, amt, paid, add_date,paid_date
        expect(res.statusCode).toBe(201);

        expect(res.body).toEqual({invoice: {id: expect.any(Integer), comp_code: "amz", amt: 200 , paid:  false, add_date: "2023-01-15T05:00:00.000Z", paid_date: null} });



    })


})


describe("PATCH /invoice/:id", () =>{

    test("Update an invoice", async() =>{

        const res = await request(app).patch(`/invoices/${testInvoice.id}`).send({id: expect.any(Integer),comp_code: "amz", amt: 200 , paid:  true, add_date: '2023-01-15T05:00:00.000Z', paid_date: '2023-01-20T05:00:00.000Z'});

        expect(res.statusCode).toBe(200);


        expect(res.body).toEqual({invoice: {comp_code: "amz", amt: 200 , paid:  true, add_date: '2023-01-15T05:00:00.000Z', paid_date: '2023-01-20T05:00:00.000Z'} });




    })


    test("Responds with 404 for invalid invoice id", async () => {
        const res = await request(app).patch(`/invoices/0`)
        expect(res.statusCode).toBe(404);
    })


})

describe("DELETE /invoices/:id",() =>{

    test("Delete an invoice", async() =>{

        const res = await request(app).delete(`/invoices/${testInvoice.id}`)

        expect(res.body).toEqual({message: `Invoice ${testInvoice.id} has been deleted.`})


    })

    test("Responds with 404 for invalid id", async () => {
        const res = await request(app).delete(`/invoices/0`)
        expect(res.statusCode).toBe(404);
    })


})
