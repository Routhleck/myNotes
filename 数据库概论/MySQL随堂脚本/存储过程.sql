-- 存储过程

-- 创建数据库
create database db_test3;

-- 使用数据库
use db_test3;

-- 创建图书信息表：
create table books(
   book_id int primary key auto_increment,
	 book_name varchar(50) not null,
	 book_author varchar(20) not null,
	 book_price decimal(10,2) not null,
	 book_stock int not null,
	 book_desc varchar(200)
);

-- 添加图书信息
insert into books(book_name,book_author,book_price,book_stock,book_desc)
values('Java程序设计','亮亮',38.80,12,'亮亮老师带你学Java');
insert into books(book_name,book_author,book_price,book_stock,book_desc)
values('Java王者之路','威哥',44.40,9,'千锋威哥，Java王者领路人');

-- 创建学生信息表
create table students(
	stu_num char(8) primary key,
	stu_name varchar(20) not null,
	stu_gender char(2) not null,
	stu_age int not null
);

-- 添加学生信息
insert into students(stu_num,stu_name,stu_gender,stu_age) values('1001','张三','男',20);
insert into students(stu_num,stu_name,stu_gender,stu_age) values('1002','李四','女',20);
insert into students(stu_num,stu_name,stu_gender,stu_age) values('1003','王五','男',20);


select * from books;
select * from students;


delimiter //
create procedure proc_test1(in a int,out b int)
begin 
declare  c int default 10;
declare d int default 5;
  set b= c/d+a;
end;
delimiter ;


set @m=0;
call proc_test1(12,@m);
select @m from dual;
