-- 创建数据表
create table classes(
		class_id int primary key auto_increment,
		class_name varchar(40) not null unique,
		class_remark varchar(200)
);
create table students(
		stu_num char(8) primary key,
		stu_name varchar(20) not null,
		stu_gender char(2) not null,
		stu_age int not null,
		cid int,
		constraint FK_STUDENTS_CLASSES foreign key(cid) references classes(class_id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- 数据准备:添加班级信息 和 学生信息
insert into classes(class_name,class_remark) values('Java2104','...');
insert into classes(class_name,class_remark) values('Java2105','...');
insert into classes(class_name,class_remark) values('Java2106','...');
insert into classes(class_name,class_remark) values('Python2105','...');

insert into students(stu_num,stu_name,stu_gender,stu_age,cid) values('20210101','张三','男',20,1);
insert into students(stu_num,stu_name,stu_gender,stu_age,cid) values('20210102','李四','女',20,1);
insert into students(stu_num,stu_name,stu_gender,stu_age,cid) values('20210103','王五','男',20,1);
insert into students(stu_num,stu_name,stu_gender,stu_age,cid) values('20210104','赵柳','女',20,2);
insert into students(stu_num,stu_name,stu_gender,stu_age,cid) values('20210105','孙七','男',20,2);
insert into students(stu_num,stu_name,stu_gender,stu_age) values('20210106','小红','女',20);
insert into students(stu_num,stu_name,stu_gender,stu_age) values('20210107','小明','男',20);


select * from classes;
select * from students;


-- 使用where设置过滤条件：先生成笛卡尔积再从笛卡尔积中过滤数据（效率很低）
select * from students INNER JOIN classes where students.cid = classes.class_id;

-- 内连接 ：使用ON设置连接查询条件：先判断连接条件是否成立，如果成立两张表的数据进行组合生成一条结果记录
select * from students INNER JOIN classes ON students.cid = classes.class_id;

-- 左连接 : 显示左表中的所有记录
select * from students LEFT JOIN classes ON students.cid = classes.class_id;

-- 右连接 ：显示右表中的所有记录
select * from students FULL JOIN classes ON students.cid = classes.class_id;


select s.*,c.class_name
from students s
INNER JOIN classes c
ON s.cid = c.class_id;


-- 查询需求：查询班级名称为'Java2104'班级中的学生信息
-- a.查询Java2104班的班级编号
select class_id from classes where class_name='Java2104';

-- b.查询此班级编号下的学生信息
select * from students where cid = 1;


select * from students where cid = (select class_id from classes where class_name='Java2105');



select * from classes;

-- 查询所有Java班级中的学生信息
-- a.查询所有Java班的班级编号
select class_id from classes where class_name LIKE 'Java%';

-- b.查询这些班级编号中的学生信息(union 将多个查询语句的结果整合在一起)
select * from students where cid=1
UNION
select * from students where cid=2
UNION
select * from students where cid=3;

-- 如果子查询返回的结果是多个值（单列多行），条件使用IN
select * from students where cid IN (select class_id from classes where class_name LIKE 'Java%');


-- 查询cid=1的班级中性别为男的学生信息
-- 多条件查询：
select * from students where cid=1 and stu_gender='男';

-- 子查询:先查询cid=1班级中的所有学生信息，将这些信息作为一个整体虚拟表
--        再基于这个虚拟表查询性别为男的学生信息（‘虚拟表’需要别名）
select * from (select * from students where cid=1) t where t.stu_gender='男';


