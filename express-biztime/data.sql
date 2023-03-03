\c biztime_2

DROP TABLE IF EXISTS industries_companies;
DROP TABLE IF EXISTS industries;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);


CREATE TABLE industries (

    ind_code text PRIMARY KEY,
    industry text

);

CREATE TABLE industries_companies (

    comp_code text NOT NULL REFERENCES companies,
    ind_code TEXT NOT NULL REFERENCES industries,
    PRIMARY KEY(comp_code, ind_code)

);

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.');

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);

INSERT INTO industries (ind_code, industry)
  VALUES ('ce', 'Consumer Electronics'),
          ('pc', 'Personal Computers'),
          ('bcc', 'Business Cloud Computing');

INSERT INTO industries_companies (comp_code, ind_code)
  VALUES  ('apple', 'ce'),
          ('apple', 'pc'),
          ('ibm', 'bcc'),
          ('ibm', 'pc');
