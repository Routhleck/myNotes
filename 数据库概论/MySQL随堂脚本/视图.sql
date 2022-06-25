-- 创建视图实例1：将学生表中性别为男的学生生成一个视图
create view view_test1
AS
select * from students where stu_gender='男';


create OR REPLACE view view_test1
AS
select * from students where stu_gender='女';


alter view view_test1
AS
select * from students where stu_gender='男';

-- 查询视图
select * from view_test1;


-- 在视图中新增数据
insert into view_test1 values('1010','王大帅','男',18);

-- 从视图中删除数据
delete from view_test1 where stu_num='1010';

-- 在视图中修改数据
update view_test1 set stu_name='小刚' where stu_num='1006';



-- 创建视图示例2：查询学生借书的信息（学生名、图书名、借书数量）
create view view_test2
AS
select s.stu_name,b.book_name,borrow_num
from books b inner join records r inner join students s
on b.book_id=r.bid and r.snum=s.stu_num;

-- 查询视图
select * from view_test2;

delete from view_test2 where stu_name='小明';

-- 查询视图结构
desc view_test2;

-- 删除视图
drop view view_test1;


