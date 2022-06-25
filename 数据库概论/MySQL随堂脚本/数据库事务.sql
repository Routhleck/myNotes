-- 借书业务

-- 开启事务（关闭自动提交---手动提交）
start transaction;

-- 操作1：在借书记录表中添加记录
insert into records(snum,bid,borrow_num,is_return,borrow_date) values('1007',4,2,0,sysdate());

-- select aaa;
-- 事务回滚（清除连接缓存中的操作,撤销当前事务已经执行的操作）
-- rollback;

-- 操作2：修改图书库存
update books set book_stock=book_stock-2 where book_id=4;

-- 提交事务（将连接缓存中的操作写入数据文件）
commit;


-- 转账业务：张三给李四转账1000
-- 操作1：李四的帐号+1000
-- 操作2：张三的账户-1000

set session transaction isolation level REPEATABLE READ;

select @@transaction_isolation;