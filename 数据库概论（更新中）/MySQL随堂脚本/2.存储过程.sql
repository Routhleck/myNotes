-- 存储过程：就是将能够完成特定功能的SQL指令进行封装

-- 创建一个存储过程实现加法运算:  Java语法中，方法是有参数和返回值的
--                                存储过程中，是有输入参数 和 输出参数的
create procedure proc_test1(IN a int,IN b int,OUT c int)
begin
   SET c = a+b;
end;

-- 调用存储过程
-- 定义变量@m
set @m = 0;
-- 调用存储过程，将3传递给a，将2传递给b，将@m传递给c
call proc_test1(3,2,@m);
-- 显示变量值
select @m from dual;


-- 创建一个存储过程: 计算 输入参数的平方与 输入参数/2 之和
create procedure proc_test2(IN a int,OUT r int)
begin
 declare x int default 0;  -- 定义x  int类型，默认值为0
 declare y int default 1;
 set x = a*a;
 set y = a/2; 
 set r = x+y;
end;

set @n=1;
call proc_test2(6,@n);
select @n from dual;


-- 创建存储过程：查询学生的数量并返回
create procedure proc_test3(OUT c int)
begin
   select count(stu_num) INTO c from students;
end;

call proc_test3(@n);
select @n from dual;


-- 创建存储过程：添加学生信息
create procedure proc_test4(IN snum char(8),IN sname varchar(20), IN gender char(2), IN age int, IN cid int, IN remark varchar(255))
begin
  insert into students(stu_num,stu_name,stu_gender,stu_age,cid,remark)
	values(snum,sname,gender,age,cid,remark);
end;

call proc_test4('20210108','小丽','女',20,1,'aaa');


-- 创建存储过程，根据学生学号，查询学生姓名
create procedure proc_test5(IN snum char(8),OUT sname varchar(20))
begin
   select stu_name INTO sname from students where stu_num=snum;
end;

set @name='';
call proc_test5('20210108',@name);
select @name from dual;


create procedure proc_test6(INOUT str varchar(20))
begin
   select stu_name INTO str from students where stu_num=str;
end;

set @name='20210108';
call proc_test6(@name);
select @name from dual;




-- 分支语句 ： if-then-else
-- 创建一个存储过程：如果参数输入的是1 则添加一条班级信息
--                   如果参数输入的是2 则添加一条学生信息

-- 如果参数a的值为1，则添加一条班级信息；否则添加一条学生信息
create procedure proc_test7(IN a int)
begin
	 if a=1 then
			insert into classes(class_name,remark) values('Java2109','test');
	 else
	    insert into students(stu_num,stu_name,stu_gender,stu_age,cid,remark) values('20210110','小花','女',19,1,'...');
	 end if;
end;

-- case
create procedure proc_test8(IN a int)
begin
  case a
	when 1 then
		-- SQL1
		insert into classes(class_name,remark) values('Java2110','wahaha');
	when 2 then
		-- SQL2
		insert into students(stu_num,stu_name,stu_gender,stu_age,cid,remark) values('20210111','小刚','男',21,2,'...');
	else
	  -- SQL (如果变量的值和所有when的值都不匹配，则执行else中的这个SQL)
		update students set stu_age=18 where stu_num='20210110';
  end case;
end;

call proc_test8(5);



-- 创建一个存储过程：添加参数指定格式的班级信息
-- while
create procedure proc_test9(IN num int)
begin
  declare i int;
	set i = 0;
	while i<num do
			-- SQL
			insert into classes(class_name,remark) values( CONCAT('Java',i) ,'....');
			set i = i+1;
	end while;
end;

call proc_test9(4);


-- repeat
create procedure proc_test10(IN num int)
begin
	declare i int;
	set i = 1;
	repeat
		-- SQL
		insert into classes(class_name,remark) values( CONCAT('Python',i) ,'....');
		set i = i+1;
	until i > num end repeat;
end;


call proc_test10(4);


-- loop
create procedure proc_test11(IN num int)
begin
   declare i int ;
	 set i =0;
	 myloop:loop
			-- SQL
			insert into classes(class_name,remark) values( CONCAT('HTML',i) ,'....');
			set i = i+1;
			if i=num then
			   leave myloop;
			end if;
	 end loop;
end;

call proc_test11(5);

-- 根据数据库名，查询当前数据库中的存储过程
show procedure status where db='db_test2';


-- 查询存储过程的创建细节
show create procedure db_test2.proc_test1;

-- 修改存储过程
-- CONTAINS SQL 表示子程序包含 SQL 语句，但不包含读或写数据的语句
-- NO SQL 表示子程序中不包含 SQL 语句
-- READS SQL DATA 表示子程序中包含读数据的语句
-- MODIFIES SQL DATA 表示子程序中包含写数据的语句
-- SQL SECURITY { DEFINER |INVOKER } 指明谁有权限来执行
-- DEFINER 表示只有定义者自己才能够执行
-- INVOKER 表示调用者可以执行
-- COMMENT 'string' 表示注释信息
alter procedure proc_test1 READS SQL DATA;

-- 删除存储过程
-- drop 删除数据库中的对象 数据库、数据表、列、存储过程、视图、触发器、索引....
-- delete 删除数据表中的数据
drop procedure proc_test1;


create database db_test3;

