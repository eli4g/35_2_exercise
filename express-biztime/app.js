/** BizTime express application. */

const express = require("express");
const app = express();
const ExpressError = require("./expressError")

app.use(express.json());


// Company routes
const compRoutes = require("./routes/companies");
app.use("/companies", compRoutes);

//Invoice routes
const invRoutes = require("./routes/invoices");
app.use("/invoices", invRoutes);


//Industry routes
const indRoutes = require("./routes/industries");
app.use("/industries", indRoutes);

/** 404 handler */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});


module.exports = app;
