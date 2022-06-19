-- 创建一个存储过程，返回查询到的一条图书信息
create procedure proc_test1(IN id int, OUT result varchar(100))
begin
   declare bname varchar(20);
	 declare bauthor varchar(20);
	 declare bprice decimal(10,2);
	 select book_name,book_author,book_price INTO bname,bauthor,bprice from books where book_id=id;
	 set result = concat_ws('~',bname,bauthor,bprice);
end;

set @r = '';
call proc_test1(2,@r);
select @r from dual;


-- 游标使用案例
create procedure proc_test2(OUT result varchar(200))
begin
   declare bname varchar(20);
	 declare bauthor varchar(20);
	 declare bprice decimal(10,2);
	 declare num int; 
	 declare i int;
	 declare str varchar(50);
	 -- 此查询语句执行之后返回的是一个结果集（多条记录），使用游标可以来遍历查询结果集
	 declare mycursor cursor for select book_name,book_author,book_price from books;
	 select count(1) INTO num from books;
	 -- 打开游标
	 open mycursor;
	 -- 使用游标要结合循环语句
	 set i=0;
	 while i<num do
		  -- 使用游标：提取游标当前指向的记录（提取之后，游标自动下移）
			FETCH mycursor INTO bname,bauthor,bprice;
			set i=i+1;
			-- set str=concat_ws('~',bname,bauthor,bprice);
			select concat_ws('~',bname,bauthor,bprice) INTO str;
			set result = concat_ws(',',result,str);
	 end while;

	 -- 关闭游标
	 close mycursor;
end;

-- 案例测试
set @r = '';
call proc_test2(@r);
select @r from dual;

