CREATE EXTENSION IF NOT EXISTS pgcrypto;

insert into user_model (email, fullname, password, role) values ('a@a', 'tiburssin tiburssius', 'aa', 'ADMINISTRATOR');
insert into user_model (email, fullname, password, role) values ('s@s', 'aroldo aroldus', 'aa', 'ADMINISTRATOR');
insert into user_model (email, fullname, password, role) values ('d@d', 'cabral cabralzius', 'aa', 'USER');
insert into user_model (email, fullname, password, role) values ('f@f', 'tonin toninhus', 'aa', 'USER');
insert into user_model (email, fullname, password, role) values ('g@g', 'g g', 'aa', 'USER');

-- insert into user_model (email, fullname, password, role) values ('a@a', 'tiburssin tiburssius', crypt('aa', gen_salt('bf')), 'ADMINISTRATOR');
-- insert into user_model (email, fullname, password, role) values ('s@s', 'aroldo aroldus', crypt('aa', gen_salt('bf')), 'ADMINISTRATOR');
-- insert into user_model (email, fullname, password, role) values ('d@d', 'cabral cabralzius', crypt('aa', gen_salt('bf')), 'USER');
-- insert into user_model (email, fullname, password, role) values ('f@f', 'tonin toninhus', crypt('aa', gen_salt('bf')), 'USER');
-- insert into user_model (email, fullname, password, role) values ('g@g', 'g g', crypt('aa', gen_salt('bf')), 'USER');

insert into car (price, model) values (50000, 'gol');
insert into car (price, model) values (60000, 'uno');
insert into car (price, model) values (70000, 'fusca');

