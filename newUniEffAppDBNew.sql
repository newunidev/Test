create database newUniEffApp;
use newUniEffApp;

CREATE TABLE efficiency (
    
    date DATETIME,
    branch_id VARCHAR(255),
    line_no INT,
    style VARCHAR(255),
    po_no VARCHAR(255),
    qty INT,
    mo INT,
    hel INT,
    iron INT,
    smv double,
    cm double,
    forcast_pcs INT,
    forcast_sah double,
    forcast_eff double,
    actual_pcs INT,
    actual_sah double,
    actual_eff double,
    income double,
    PRIMARY KEY (style, date)
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    salt VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    factory varchar(225),
     
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);




CREATE TABLE daily_figures (
    
    date DATETIME not null,
    branch_id VARCHAR(255)not null,
    line_no INT not null,
    style VARCHAR(255) not null,
    po_no VARCHAR(255)not null,
    qty_range VARCHAR(255) not null,
    qty INT not null,
    mo INT not null,
    hel INT not null,
    iron INT not null,
    smv double not null,
	wMin INT not null,
    forcast_pcs INT not null,
     
    
    PRIMARY KEY (style, date) -- this should be change as style and date so that same style cannot add daily
);
-- remember to execute this 
ALTER TABLE daily_figures
DROP PRIMARY KEY, 
ADD PRIMARY KEY (style, date, line_no);


CREATE TABLE hourly_figures (
    date DATETIME NOT NULL,
    branch_id VARCHAR(255) NOT NULL,
    line_no INT NOT NULL,
    style VARCHAR(255) NOT NULL,
    hourqty INT NOT NULL,
    hourslot VARCHAR(255) NOT NULL,
    
    PRIMARY KEY (date, line_no, style,hourslot)  -- this should be update as 
);

CREATE TABLE monthly_target(
	branch_id VARCHAR(255) NOT NULL,
    inc_month int NOT NULL,
    income double not null,
    
    primary key(inc_month,branch_id)
);
 
select * from monthly_target;
SELECT income from monthly_target where income=400&branch_id="Hettipola Factory";








select * from efficiency;
select * from efficiency;
select * from daily_figures;

select * from daily_figures where line_no=3 and style='Sto06' and date='2024-03-05';
select * from hourly_figures;
select * from hourly_figures where line_no=1 and style='STO1';
select * from hourly_figures where line_no = 2 && style = "STO074" && branch_id="Hettipola Factory";




SELECT
    hf.date,
    hf.branch_id,
    hf.line_no,
    hf.style,
    hf.hourqty,
    hf.hourslot,
    df.qty,
    df.mo,
    df.hel,
    df.iron,
    df.smv,
    df.forcast_pcs
FROM
    hourly_figures hf
JOIN
    daily_figures df ON hf.date = df.date
    AND hf.branch_id = df.branch_id
    AND hf.line_no = df.line_no
    AND hf.style = df.style
WHERE
    hf.branch_id ='Hettipola Factory'  -- Replace ? with the actual branchId value
    AND hf.date = '2024-03-02' 
    AND df.line_no = '2'
    AND df.style = 'ST01'-- Replace ? with the actual date value
     -- Additional condition for style filtering
ORDER BY
    hf.hourslot;


select * from hourly_figures;

SELECT DISTINCT
    line_no,
    style
FROM
    hourly_figures
WHERE
    date = '2024-03-02'
    AND branch_id = 'Hettipola Factory'
ORDER BY
    line_no, style;


-- check 

select * from efficiency;
SELECT 
    DATE_FORMAT(date, '%Y-%m-%d') AS `Date`,
    SUM(income) AS `Total Income`
FROM 
    efficiency
WHERE 
    branch_id = 'Hettipola Factory'
    AND MONTH(date) = '03' -- Change '03' to the desired month
GROUP BY 
    DATE_FORMAT(date, '%Y-%m-%d')
ORDER BY 
    `Date` ASC;
