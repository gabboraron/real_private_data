# This is a really simple database,
# It store other local databases.

CREATE TABLE users (
    uid INT,
    userName VARCHAR2,
    password VARCHAR2  # encripted
);

CREATE TABLE datas (
    id INT,
    uid INT, 
    date  VARCHAR2, # encripted
    database TEXT, #encripted sqlite database
);