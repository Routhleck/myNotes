-- 日志信息表：记录对学生信息的操作（记录在***时间对***学生进行了***的操作）
create table stulogs(
   id int primary key auto_increment,
	 time TIMESTAMP,
	 log_text varchar(200)
);


-- 当向students表中添加学生信息时，同时要在 stulogs表中添加一条操作日志
insert into students(stu_num,stu_name,stu_gender,stu_age) values('1004','夏利','女',20);
-- 手动进行记录日志
insert into stulogs(time,log_text) values(now(),'添加1004学生信息');

-- 创建触发器：当学生信息表发生添加操作时，则向日志信息表中记录一条日志
create trigger tri_test1
after insert on students
for each row
insert into stulogs(time,log_text) values(now(), concat('添加',NEW.stu_num,'学生信息'));


-- 查看触发器
show triggers;

insert into students(stu_num,stu_name,stu_gender,stu_age) values('1005','小明','男',20);
insert into students(stu_num,stu_name,stu_gender,stu_age) values('1006','小刚','男',20),('1007','李磊','男',20);


-- 删除触发器
drop trigger tri_test1;


-- 创建触发器 : 在监听update操作的触发器中，可以使用NEW获取修改后的数据
drop trigger tri_test2;
create trigger tri_test2
after update on students for each row
insert into stulogs(time,log_text) values(now(), concat('将学生姓名从【',OLD.stu_name,'】修改为【',NEW.stu_name,'】'));

update students set stu_name='李刚' where stu_num='1006';


-- 当从students表中删除学生信息时，同时要在 stulogs表中添加一条操作日志
create trigger tri_test3
after delete on students for each row
insert into stulogs(time,log_text) values(now(), concat('删除',OLD.stu_num,'学生信息'));

delete from students where stu_num='1007';
