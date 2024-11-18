SET FOREIGN_KEY_CHECKS=0; 

alter table AUFGABE 
   drop foreign key if exists FK_AUFGABE_REFERENCE_FACH;

alter table AUFGABE 
   drop foreign key if exists FK_AUFG_REFERENCE_USER;
   
alter table TERMIN 
   drop foreign key if exists FK_TERMIN_REFERENCES_USER;
   
alter table FACH 
   drop foreign key if exists FK_FACH_REFERENCE_STUDIENG;

alter table TERMIN 
   drop foreign key if exists FK_TERMIN_REFERENCE_FACH;

alter table TERMIN_USER 
   drop foreign key if exists FK_TERMIN_U_REFERENCE_USER;

alter table TERMIN_USER 
   drop foreign key if exists FK_TERMIN_U_REFERENCE_TERMIN;

alter table USER 
   drop foreign key if exists FK_USER_REFERENCE_STUDIENG;

alter table USER_AUFGABE 
   drop foreign key if exists FK_USER_AUF_REFERENCE_AUFGABE;

alter table USER_AUFGABE 
   drop foreign key if exists FK_USER_AUF_REFERENCE_USER;

alter table USER_FACH 
   drop foreign key if exists FK_USER_FAC_REFERENCE_USER;

alter table USER_FACH 
   drop foreign key if exists FK_USER_FAC_REFERENCE_FACH;


drop table if exists AUFGABE;

drop table if exists FACH;

drop table if exists STUDIENGANG;

drop table if exists TERMIN;

drop table if exists TERMIN_USER;

drop table if exists USER;

drop table if exists USER_AUFGABE;

drop table if exists USER_FACH;

