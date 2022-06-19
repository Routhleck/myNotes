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
	stu_num char(4) primary key,
	stu_name varchar(20) not null,
	stu_gender char(2) not null,
	stu_age int not null
);

-- 添加学生信息
insert into students(stu_num,stu_name,stu_gender,stu_age) values('1001','张三','男',20);
insert into students(stu_num,stu_name,stu_gender,stu_age) values('1002','李四','女',20);
insert into students(stu_num,stu_name,stu_gender,stu_age) values('1003','王五','男',20);

-- 借书记录表：
create table records(
   rid int primary key auto_increment,
	 snum char(4) not null,
	 bid int not null,
	 borrow_num int not null,
	 is_return int not null, -- 0表示为归还   1 表示已经归还
	 borrow_date date not null,
	 constraint FK_RECORDS_STUDENTS foreign key(snum) references students(stu_num),
	 constraint FK_RECORDS_BOOKS foreign key(bid) REFERENCES books(book_id)
);




-- 实现借书业务：
-- 参数1： a 输入参数  学号
-- 参数2： b 输入参数  图书编号
-- 参数3： m 输入参数  借书的数量
-- 参数4： state 输出参数  借书的状态（1 借书成功，2 学号不存在，3 图书不存在， 4 库存不足）
create procedure proc_borrow_book(IN a char(4),IN b int, IN m int,OUT state int)
begin
	declare stu_count int default 0;
	declare book_count int default 0;
	declare stock int default 0;
	-- 判断学号是否存在：根据参数 a 到学生信息表查询是否有stu_num=a的记录
	select count(stu_num) INTO stu_count from students where stu_num=a;
	if stu_count>0 then
		 -- 学号存在
		 -- 判断图书ID是否存在：根据参数b 查询图书记录总数
		 select count(book_id) INTO book_count from books where book_id=b;
		 if book_count >0 then
		    -- 图书存在
			  -- 判断图书库存是否充足：查询当前图书库存，然后和参数m进行比较
				select book_stock INTO stock from books where book_id=b;
				if stock >= m then
					-- 执行借书
					-- 操作1：在借书记录表中添加记录
					insert into records(snum,bid,borrow_num,is_return,borrow_date) values(a,b,m,0,sysdate());
					-- 操作2：修改图书库存
					update books set book_stock=stock-m where book_id=b;
					-- 借书成功
					set state=1;
				else
				  -- 库存不足
					set state=4;
				end if;				
		 else
				-- 图书不存在
				set state = 3;
		 end if;
	else
	   -- 不存在
		 set state = 2;
	end if;
end;

-- 调用存储过程借书
set @state=0;
call proc_borrow_book('1001',1,2,@state);
select @state from dual;











