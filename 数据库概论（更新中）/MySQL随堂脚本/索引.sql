-- 创建数据表
create table tb_testindex(
   fid int primary key, -- 主键
	 sid int unique,			-- 唯一键
	 tid int,  					  -- 普通字段
	 name varchar(20),
	 remark varchar(20)
);


-- 数据准备
create procedure proc_readydata()
begin
	declare i int default 1;
	while i<=5000000 do
	    insert into tb_testindex(fid,sid,tid,name,remark) values(i,i,i,'test_name','text_remark');
			set i=i+1;
	end while;
end;

-- 调用存储过程
call proc_readydata();


select count(1) from tb_testindex;

select * from books;


-- 查询数据表的索引
show indexes from tb_testindex;

show keys from tb_testindex;

-- 创建唯一索引
create unique index index_test1 on tb_testindex(tid);
select * from tb_testindex where tid=250000;

-- 创建普通索引
create index index_test2 on tb_testindex(name);

-- 创建组合索引
create index index_test3 on tb_testindex(tid,name);
select * from tb_testindex where tid=250000;
select * from tb_testindex where name='aaa';
select * from tb_testindex where tid=250000 and name='aaa'; 



show create table tb_testindex\G;

-- 删除索引：索引是建立在表的字段上的，不同的表中可能会出现相同名称的索引
--           因此删除索引时需要指定表名
drop index index_test3 on tb_testindex;
