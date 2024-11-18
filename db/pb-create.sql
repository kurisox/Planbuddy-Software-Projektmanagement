create table AUFGABE(
ID_AUFGABE int not null AUTO_INCREMENT,
ID_FACH int,
ID_BESITZER int not null,
NAME varchar(60) not null,
ERLEDIGT bool not null,
WORKLOAD int,
DATUM datetime,
TYP varchar(15),
OEFFENTLICH boolean not null,
NOTIZ longtext,
primary key(ID_AUFGABE)
);

create table FACH(
ID_FACH int not null AUTO_INCREMENT,
ID_STUDIENGANG int,
NAME varchar(100) not null,
SEMESTER int not null,
CP double,
primary key(ID_FACH)
);

create table STUDIENGANG(
ID_STUDIENGANG int not null AUTO_INCREMENT,
NAME varchar(50) not null,
REGELSEMESTER int, 
primary key(ID_STUDIENGANG)
);

create table TERMIN(
ID_TERMIN int not null AUTO_INCREMENT,
ID_FACH int,
ID_BESITZER int not null,
START_DATUM_UHRZEIT datetime not null,
END_DATUM_UHRZEIT datetime not null,
NAME varchar(100) not null,
TYP varchar(25),
OEFFENTLICH boolean not null,
NOTIZ longtext,
primary key (ID_TERMIN)
);

create table TERMIN_USER(
ID_USER int not null,
ID_TERMIN int not null,
primary key(ID_USER,ID_TERMIN)
);

create table USER(
ID_USER int not null AUTO_INCREMENT,
ID_STUDIENGANG int,
USERNAME varchar(50) not null,
EMAIL varchar(50) not null,
PASSWORT varchar(200) not null,
XP int,
ROLLE varchar(50),
primary key (ID_USER)
);

create table USER_AUFGABE(
ID_USER int not null,
ID_AUFGABE int not null,
primary key(ID_USER,ID_AUFGABE)
);

create table USER_FACH(
ID_USER int not null,
ID_FACH int not null,
primary key(ID_USER,ID_FACH)
);

alter table AUFGABE add constraint FK_AUFGABE_REFERENCE_FACH foreign key(ID_FACH)
	references FACH (ID_FACH) on delete cascade on update cascade;


alter table FACH add constraint FK_FACH_REFERENCE_STUDIENG foreign key(ID_STUDIENGANG)
	references STUDIENGANG(ID_STUDIENGANG) on delete cascade on update cascade;


alter table TERMIN add constraint FK_TERMIN_REFERENCE_FACH foreign key(ID_FACH)
	references FACH (ID_FACH) on delete cascade on update cascade;


alter table TERMIN_USER add constraint FK_TERMIN_U_REFERENCE_TERMIN foreign key(ID_TERMIN)
	references TERMIN (ID_TERMIN) on delete cascade on update cascade;


alter table TERMIN_USER add constraint FK_TERMIN_U_REFERENCE_USER foreign key(ID_USER)
	references USER (ID_USER) on delete cascade on update cascade;


alter table USER add constraint FK_USER_REFERENCE_STUDIENG foreign key(ID_STUDIENGANG)
	references STUDIENGANG (ID_STUDIENGANG) on delete SET NULL on update SET NULL;


alter table USER_AUFGABE add constraint FK_USER_AUF_REFERENCE_AUFGABE foreign key(ID_AUFGABE)
	references AUFGABE (ID_AUFGABE) on delete cascade on update cascade;


alter table USER_AUFGABE add constraint FK_USER_AUF_REFERENCE_USER foreign key(ID_USER)
	references USER (ID_USER) on delete cascade on update cascade;


alter table USER_FACH add constraint FK_USER_FAC_REFERENCE_USER foreign key(ID_USER)
	references USER (ID_USER) on delete cascade on update cascade;


alter table USER_FACH add constraint FK_USER_FAC_REFERENCE_FACH foreign key(ID_FACH)
	references FACH (ID_FACH) on delete cascade on update cascade;

alter table AUFGABE add constraint FK_AUFG_REFERENCE_USER foreign key(ID_BESITZER)
	references USER (ID_USER) on delete cascade on update cascade;
	
alter table TERMIN add constraint FK_TERMIN_REFERENCES_USER foreign key(ID_BESITZER)
	references USER (ID_USER) on delete cascade on update cascade;


-- Sample Data will be created past this Point

insert into STUDIENGANG(NAME,REGELSEMESTER) VALUES('Informatik',7);
insert into STUDIENGANG(NAME,REGELSEMESTER) VALUES('Architektur',7);
insert into STUDIENGANG(NAME,REGELSEMESTER) VALUES('Medizin',10);
insert into STUDIENGANG(NAME,REGELSEMESTER) VALUES('Jura',10);

insert into USER (ID_STUDIENGANG, USERNAME, EMAIL, PASSWORT, XP, ROLLE) values(1, 'Peter_Wattkins', 'Peter_Wattkins@gmail.com', '$2a$10$jyVVRXmAPGozuMrbBuHw9u90bHwcM1YBlNhTbpmN7KLBqc5KR7exi', 150, 'User');
insert into USER (ID_STUDIENGANG, USERNAME, EMAIL, PASSWORT, XP, ROLLE) values(3, 'Opa-Kalle23', 'Karsten.Maier@gmail.com', '$2a$10$jyVVRXmAPGozuMrbBuHw9u90bHwcM1YBlNhTbpmN7KLBqc5KR7exi', 373, 'User');
insert into USER (ID_STUDIENGANG, USERNAME, EMAIL, PASSWORT, XP, ROLLE) values(4, 'Ignatio Varga', 'Martin43@gmail.com', '$2a$10$jyVVRXmAPGozuMrbBuHw9u90bHwcM1YBlNhTbpmN7KLBqc5KR7exi', 50, 'User');
insert into USER (ID_STUDIENGANG, USERNAME, EMAIL, PASSWORT, XP, ROLLE) values(1, 'DerWissende', 'hammerman938@gmail.com', '$2a$10$jyVVRXmAPGozuMrbBuHw9u90bHwcM1YBlNhTbpmN7KLBqc5KR7exi', 0, 'User');
insert into USER (ID_STUDIENGANG, USERNAME, EMAIL, PASSWORT, XP, ROLLE) values(2, 'Anna99', 'Anna-Ziegler@t-online.de', '$2a$10$jyVVRXmAPGozuMrbBuHw9u90bHwcM1YBlNhTbpmN7KLBqc5KR7exi', 989, 'User');
insert into USER (ID_STUDIENGANG, USERNAME, EMAIL, PASSWORT, XP, ROLLE) values(4, 'RodrigoGonzales', 'keinname3103@gmx.com', '$2a$10$jyVVRXmAPGozuMrbBuHw9u90bHwcM1YBlNhTbpmN7KLBqc5KR7exi', 0, 'User');
insert into USER (ID_STUDIENGANG, USERNAME, EMAIL, PASSWORT, XP, ROLLE) values(3, 'Hannes_Kleinmann', 'Hannes_Kleinmann@gmail.com', '$2a$10$jyVVRXmAPGozuMrbBuHw9u90bHwcM1YBlNhTbpmN7KLBqc5KR7exi', 150, 'User');
insert into USER (ID_STUDIENGANG, USERNAME, EMAIL, PASSWORT, XP, ROLLE) values(2, 'ErenJaeger', 'ErenJaeger6665324@web.de', '$2a$10$jyVVRXmAPGozuMrbBuHw9u90bHwcM1YBlNhTbpmN7KLBqc5KR7exi', 10, 'User');
insert into USER (ID_STUDIENGANG, USERNAME, EMAIL, PASSWORT, XP, ROLLE) values(1, 'MarcellSchreiber', 'MarcellSchreiber@gmail.com', '$2a$10$jyVVRXmAPGozuMrbBuHw9u90bHwcM1YBlNhTbpmN7KLBqc5KR7exi', 0, 'User');
insert into USER (ID_STUDIENGANG, USERNAME, EMAIL, PASSWORT, XP, ROLLE) values(3, 'Erik1206', 'Erik.Maier@gmail.com', '$2a$10$jyVVRXmAPGozuMrbBuHw9u90bHwcM1YBlNhTbpmN7KLBqc5KR7exi', 609, 'User');
insert into USER (ID_STUDIENGANG, USERNAME, EMAIL, PASSWORT, XP, ROLLE) values(1, 'Mario Luigi', 'marioluigi@kart.de', '$2a$10$jyVVRXmAPGozuMrbBuHw9u90bHwcM1YBlNhTbpmN7KLBqc5KR7exi', 25, 'User');
insert into USER (ID_STUDIENGANG, USERNAME, EMAIL, PASSWORT, XP, ROLLE) values(2, 'Berta die krasse', 'berta@gmail.com', '$2a$10$jyVVRXmAPGozuMrbBuHw9u90bHwcM1YBlNhTbpmN7KLBqc5KR7exi', 250, 'Admin');
insert into USER (ID_STUDIENGANG, USERNAME, EMAIL, PASSWORT, XP, ROLLE) values(4, 'Peter Pfanne', 'peterpan@wonderland.de', '$2a$10$jyVVRXmAPGozuMrbBuHw9u90bHwcM1YBlNhTbpmN7KLBqc5KR7exi', 215, 'User');
insert into USER (ID_STUDIENGANG, USERNAME, EMAIL, PASSWORT, XP, ROLLE) values(4, 'Lucius Malfoy', 'lucius@harrypotter.net', '$2a$10$jyVVRXmAPGozuMrbBuHw9u90bHwcM1YBlNhTbpmN7KLBqc5KR7exi', 125, 'User');
insert into USER (ID_STUDIENGANG, USERNAME, EMAIL, PASSWORT, XP, ROLLE) values(1, 'Annegret Kramp Karrenbauer', 'akk@bundeswehr.de', '$2a$10$jyVVRXmAPGozuMrbBuHw9u90bHwcM1YBlNhTbpmN7KLBqc5KR7exi', 251, 'Verteidigungsministerin');
insert into USER (ID_STUDIENGANG, USERNAME, EMAIL, PASSWORT, XP, ROLLE) values(2, 'User_26', 'noname@live.com', '$2a$10$jyVVRXmAPGozuMrbBuHw9u90bHwcM1YBlNhTbpmN7KLBqc5KR7exi', 1259, 'Admin');
insert into USER (ID_STUDIENGANG, USERNAME, EMAIL, PASSWORT, XP, ROLLE) values(3, 'Infostudi15', 'carstenstudent@hotmail.com', '$2a$10$jyVVRXmAPGozuMrbBuHw9u90bHwcM1YBlNhTbpmN7KLBqc5KR7exi', 1215, 'User');
insert into USER (ID_STUDIENGANG, USERNAME, EMAIL, PASSWORT, XP, ROLLE) values(4, 'TheLegend27', 'thelegend@27.net', '$2a$10$jyVVRXmAPGozuMrbBuHw9u90bHwcM1YBlNhTbpmN7KLBqc5KR7exi', 1825, 'User');
insert into USER (ID_STUDIENGANG, USERNAME, EMAIL, PASSWORT, XP, ROLLE) values(2, 'Knuckles', 'knuckles@sonic.com', '$2a$10$jyVVRXmAPGozuMrbBuHw9u90bHwcM1YBlNhTbpmN7KLBqc5KR7exi', 15, 'User');
insert into USER (ID_STUDIENGANG, USERNAME, EMAIL, PASSWORT, XP, ROLLE) values(1, 'Planbuddy', 'planbuddy@gmail.com', '$2a$10$jyVVRXmAPGozuMrbBuHw9u90bHwcM1YBlNhTbpmN7KLBqc5KR7exi', 5, 'User');

insert into FACH (ID_STUDIENGANG, NAME, SEMESTER, CP) values(1, 'Einfuehrung in die Informatik', 1, 5.0);
insert into FACH (ID_STUDIENGANG, NAME, SEMESTER, CP) values(1, 'Mathe fuer Informatiker 1', 1, 8.0);
insert into FACH (ID_STUDIENGANG, NAME, SEMESTER, CP) values(1, 'Objektorientierte Programmierung', 1, 7.0);
insert into FACH (ID_STUDIENGANG, NAME, SEMESTER, CP) values(2, 'Programmierung mit Skriptsprachen', 1, 5.0);
insert into FACH (ID_STUDIENGANG, NAME, SEMESTER, CP) values(2, 'Technische Informatik', 1, 5.0);
insert into FACH (ID_STUDIENGANG, NAME, SEMESTER, CP) values(2, 'Mathe fuer Informatiker II', 2, 8.0);
insert into FACH (ID_STUDIENGANG, NAME, SEMESTER, CP) values(3, 'Programmiermethoden', 2, 7.0);
insert into FACH (ID_STUDIENGANG, NAME, SEMESTER, CP) values(3, 'Algorithmen und Datenstrukturen', 2, 5.0);
insert into FACH (ID_STUDIENGANG, NAME, SEMESTER, CP) values(3, 'Theoretische Informatik', 2, 5.0);
insert into FACH (ID_STUDIENGANG, NAME, SEMESTER, CP) values(4, 'IT-Recht', 2, 5.0);
insert into FACH (ID_STUDIENGANG, NAME, SEMESTER, CP) values(4, 'Software Engineering', 3, 7.0);
insert into FACH (ID_STUDIENGANG, NAME, SEMESTER, CP) values(4, 'Embedded Systems', 3, 5.0);
insert into FACH (ID_STUDIENGANG, NAME, SEMESTER, CP) values(1, 'Datenbanken I', 3, 5.0);
insert into FACH (ID_STUDIENGANG, NAME, SEMESTER, CP) values(2, 'Systemprogrammierung', 3, 8.0);
insert into FACH (ID_STUDIENGANG, NAME, SEMESTER, CP) values(3, 'Software-Projektmanagement', 3, 5.0);

insert into AUFGABE (ID_FACH, ID_BESITZER, NAME, ERLEDIGT, WORKLOAD, DATUM, TYP, OEFFENTLICH) VALUES(1, 4,'Uebungsblatt 6', false, 1, '2021-12-14 16:00:00','',true);
insert into AUFGABE (ID_FACH, ID_BESITZER, NAME, ERLEDIGT, WORKLOAD, DATUM, TYP, OEFFENTLICH) VALUES(2, 6,'Polynomdivision 1', false, 1, '2021-11-25 18:59:59','',true);
insert into AUFGABE (ID_FACH, ID_BESITZER, NAME, ERLEDIGT, WORKLOAD, DATUM, TYP, OEFFENTLICH) VALUES(3, 1,'Beispielprojekt erweitern', false, 1, '2021-10-30 8:00:00','',true);
insert into AUFGABE (ID_FACH, ID_BESITZER, NAME, ERLEDIGT, WORKLOAD, DATUM, TYP, OEFFENTLICH, NOTIZ) VALUES(4, 3,'Ueben fuer Klausur', false, 8, '2022-01-15 20:00:00','',false,'Grosse Kanne Kaffee kochen!');
insert into AUFGABE (ID_FACH, ID_BESITZER, NAME, ERLEDIGT, WORKLOAD, DATUM, TYP, OEFFENTLICH) VALUES(9, 13,'Automatentheorie 3', false, 1, '2021-09-30 18:59:59','',true);
insert into AUFGABE (ID_FACH, ID_BESITZER, NAME, ERLEDIGT, WORKLOAD, DATUM, TYP, OEFFENTLICH) VALUES(8, 17,'PM Dungeon', false, 1, '2022-01-25 18:59:59','',true);

insert into TERMIN (ID_FACH, ID_BESITZER, START_DATUM_UHRZEIT, END_DATUM_UHRZEIT, NAME, TYP, NOTIZ, OEFFENTLICH) values(1, 11,'2021-12-14 14:00:00', '2021-12-14 15:30:00' , 'Eidi VL 01', '', 'mit kamera', true);
insert into TERMIN (ID_FACH, ID_BESITZER, START_DATUM_UHRZEIT, END_DATUM_UHRZEIT, NAME, TYP, NOTIZ, OEFFENTLICH) values(2, 2,'2021-12-16 13:30:00', '2021-12-16 15:30:00','Mathe EAssessment 02', '', 'vorher lernen!', true);
insert into TERMIN (ID_FACH, ID_BESITZER, START_DATUM_UHRZEIT, END_DATUM_UHRZEIT, NAME, TYP, NOTIZ, OEFFENTLICH) values(3, 3,'2021-12-11 18:50:00', '2021-12-11 19:20:00', 'OOP Schwimmen abgabe', '', 'dauert lange', false);
insert into TERMIN (ID_FACH, ID_BESITZER, START_DATUM_UHRZEIT, END_DATUM_UHRZEIT, NAME, TYP, NOTIZ, OEFFENTLICH) values(4, 9,'2023-12-14 14:20:00', '2023-12-14 17:20:00' ,'EPS wiederholen', '', 'leider durchgefallen', false);
insert into TERMIN (ID_FACH, ID_BESITZER, START_DATUM_UHRZEIT, END_DATUM_UHRZEIT, NAME, TYP, NOTIZ, OEFFENTLICH) values(5, 16,'2022-02-14 14:00:00','2022-02-14 15:30:00' ,'TI Uebung', '', 'ohne kamera = freizeit', false);

insert into TERMIN_USER values(5,1);
insert into TERMIN_USER values(8,2);
insert into TERMIN_USER values(2,3);
insert into TERMIN_USER values(13,4);
insert into TERMIN_USER values(17,5);


insert into USER_AUFGABE values(1, 1);
insert into USER_AUFGABE values(1, 2);
insert into USER_AUFGABE values(1, 3);
insert into USER_AUFGABE values(1, 6);
insert into USER_AUFGABE values(1, 5);

insert into USER_AUFGABE values(4, 1);
insert into USER_AUFGABE values(4, 2);
insert into USER_AUFGABE values(4, 3);
insert into USER_AUFGABE values(4, 4);
insert into USER_AUFGABE values(4, 5);

insert into USER_AUFGABE values(9, 1);
insert into USER_AUFGABE values(9, 2);
insert into USER_AUFGABE values(9, 3);
insert into USER_AUFGABE values(9, 6);
insert into USER_AUFGABE values(9, 5);

insert into USER_AUFGABE values(11, 1);
insert into USER_AUFGABE values(11, 2);
insert into USER_AUFGABE values(11, 3);
insert into USER_AUFGABE values(11, 6);
insert into USER_AUFGABE values(11, 5);

insert into USER_AUFGABE values(15, 1);
insert into USER_AUFGABE values(15, 2);
insert into USER_AUFGABE values(15, 3);
insert into USER_AUFGABE values(15, 6);
insert into USER_AUFGABE values(15, 5);

insert into USER_AUFGABE values(20, 1);
insert into USER_AUFGABE values(20, 2);
insert into USER_AUFGABE values(20, 3);
insert into USER_AUFGABE values(20, 6);
insert into USER_AUFGABE values(20, 5);


insert into USER_FACH values(1, 1);
insert into USER_FACH values(1, 2);
insert into USER_FACH values(1, 3);
insert into USER_FACH values(1, 15);

insert into USER_FACH values(4, 1);
insert into USER_FACH values(4, 2);
insert into USER_FACH values(4, 3);

insert into USER_FACH values(9, 1);
insert into USER_FACH values(9, 2);
insert into USER_FACH values(9, 3);

insert into USER_FACH values(11, 1);
insert into USER_FACH values(11, 2);
insert into USER_FACH values(11, 3);

insert into USER_FACH values(15, 1);
insert into USER_FACH values(15, 2);
insert into USER_FACH values(15, 3);

insert into USER_FACH values(20, 1);
insert into USER_FACH values(20, 2);
insert into USER_FACH values(20, 3);

insert into USER_FACH values(5, 4);
insert into USER_FACH values(5, 5);
insert into USER_FACH values(5, 6);
insert into USER_FACH values(8, 4);
insert into USER_FACH values(8, 5);
insert into USER_FACH values(8, 6);
insert into USER_FACH values(12, 4);
insert into USER_FACH values(12, 5);
insert into USER_FACH values(12, 6);
insert into USER_FACH values(16, 4);
insert into USER_FACH values(16, 5);
insert into USER_FACH values(16, 6);
insert into USER_FACH values(19, 4);
insert into USER_FACH values(19, 5);
insert into USER_FACH values(19, 6);

insert into USER_FACH values(2, 7);
insert into USER_FACH values(2, 8);
insert into USER_FACH values(2, 9);
insert into USER_FACH values(7, 7);
insert into USER_FACH values(7, 8);
insert into USER_FACH values(7, 9);
insert into USER_FACH values(10, 7);
insert into USER_FACH values(10, 8);
insert into USER_FACH values(10, 9);
insert into USER_FACH values(17, 7);
insert into USER_FACH values(17, 8);
insert into USER_FACH values(17, 9);

insert into USER_FACH values(3, 10);
insert into USER_FACH values(3, 11);
insert into USER_FACH values(3, 12);
insert into USER_FACH values(6, 10);
insert into USER_FACH values(6, 11);
insert into USER_FACH values(6, 12);
insert into USER_FACH values(13, 10);
insert into USER_FACH values(13, 11);
insert into USER_FACH values(13, 12);
insert into USER_FACH values(14, 10);
insert into USER_FACH values(14, 11);
insert into USER_FACH values(14, 12);
insert into USER_FACH values(18, 10);
insert into USER_FACH values(18, 11);
insert into USER_FACH values(18, 12);
