# 一 、常用操作数据库的命令

```
 1.查看所有的数据库 : show databases;
 
 2.创建一个数据库   : create database if not exists 数据库名;
 
 3.删除一个数据库   : drop database if exists 数据库名;
 
 4.选择一张表 (注意在建表之前必须要选择数据库) : use `表名`;
 	* --tab 键的上面，如果你的表名或字段名是一个特殊字段符，就需要带 ``  *
 
 5.在选中的数据库之中查看所有的表 :  show tables;
 
 6.查看创建数据库的语句           ：show create database 数据库名;
 7.查看student数据表的定义语句    ：show create table 表名;
 8.显示表的结构                   ：desc 表名;
 9.删除表                        :  drop table 表名;
 10.查看创建库的详细信息          ：show create database 库名;
 11.查看创建表的详细信息          : show create table 表名;
1234567891011121314151617
```

# 二、建一张表

> – 目标:创建一个schoo1数据库
> – 创建学生表(列,字段)使用SQL 创建
> – 学号int 登录密码varchar(20)姓名,性别varchar(2),出生日期(datatime)，家庭住址，emai1

> 分析：
> `id` INT(4) NOT NULL AUTO_INCREMENT COMMENT ‘学号’,
> `id` ：字段名 （要加个票 ``Tab键下面的 ）
> INT(4)：类型(长度)
> NOT NULL：不为空
> AUTO_INCREMENT：自增
> COMMENT ‘xxx’：注释 （这里 ’ ’ 是回车键隔壁的那个 ‘ ）
> DEFAULT ‘xxx’：默认值xxx

```sql
-- 注意点，使用英文()，表的名称 和 字段 尽量使用 `` (Tab键下面的) 括起来
-- AUTO_ INCREMENT 自增
-- 字符串使用单引号括起来!
-- 所有的语句后面加，(英文的)，最后一个不用加
-- PRIMARY KEY 主键，一般一个表只有一个唯一的主键!

CREATE TABLE IF NOT EXISTS `student2`(
    `id` INT(4) NOT NULL AUTO_INCREMENT COMMENT '学号',
    `name` VARCHAR(20) NOT NULL DEFAULT '匿名' COMMENT '姓名',
    `pwd` VARCHAR(20) NOT NULL DEFAULT '123456' COMMENT'密码',
    `sex` VARCHAR(2) NOT NULL DEFAULT '男' COMMENT'性别',
    `birthday` DATETIME DEFAULT NULL COMMENT'出生日期',
    `address` VARBINARY(100) DEFAULT NULL COMMENT'家庭住址',
    `email` VARBINARY(50) DEFAULT NULL COMMENT'邮箱',
     PRIMARY KEY(`id`) --设置主键
)ENGINE=INNODB DEFAULT CHARSET=utf8  --设置编码
12345678910111213141516
```

> 格式

```
CREATE TABLE [IF NOT EXISTS] `表名`（
	`字段名` 列类型[属性][索引][注释],
	`字段名` 列类型[属性][索引][注释],
	`字段名` 列类型[属性][索引][注释] (最后一句可以不要逗号)
）[表类型][表的字符集设置][注释]``
12345
```

> 常用命令
> SHOW CREATE DATABASE school – 查看创建数据库的语句
> ![在这里插入图片描述](https://img-blog.csdnimg.cn/f922e132899a400bb941b7ded24cf06d.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5qmZ5a2Q55qE6IOW6IOW,size_20,color_FFFFFF,t_70,g_se,x_16)
> SHOW CREATE TABLE student – 查看student数据表的定义语句
> ![在这里插入图片描述](https://img-blog.csdnimg.cn/b59514004aff452c823e7de9060ecc5a.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5qmZ5a2Q55qE6IOW6IOW,size_20,color_FFFFFF,t_70,g_se,x_16)
> DESC student – 显示表的结构
> ![在这里插入图片描述](https://img-blog.csdnimg.cn/ff218c0e47464db4bde7613f6c97f7f2.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5qmZ5a2Q55qE6IOW6IOW,size_19,color_FFFFFF,t_70,g_se,x_16)

# 三、修改表的命令

### 3.1 修改

> 修改

```
 1.  修改表名:  alter  table  旧表名  rename  as  新表名
 		 例子：alter  table  teacher  rename as teacher1
 		
 2.  增加表的字段:  alter  table  表名  add  表字段名  字段类型
             例子：alter table teacher1 add age int(11)
 
 3.   修改表的字段的类型
       --alter table 表名 modify 字段名 字段类型[ ]
       例子：alter table teacher1 moify age varchar(11)  -- 修改约束(例如：由int修改为varchar类型)

 4.   修改指定的字段名
       --alter table 表名 change 旧名字  新名字  字段类型[ ]
	   例子：alter table teacher1 change age age1 int(1) -- 字段重命名

 5.  删除表的字段 : alter table 表名 deop 字段名
     例子：alter table teacher1 drop age1    

 6.  添加字段并指定位置  alter table 表名 add 字段 字段类型   after 字段
123456789101112131415161718
```

### 3.2 删除

> 删除

```
 1.   删除表（如果表存在再删除）
      例子：drop table if exists teacher1

1234
```

# 四、DML 数据库操作语言（重要）

### 4.1 添加

> 添加 insert

```
语法：
insert into 表名 (`字段名1`,`字段名2`,`字段名3`,……)  values (`值1`,`值2`,`值3`, ……)
12
还可以同时插入多条数据，VALUES后面的值需要使用，隔开即可
语法：
insert into 表名 (`字段名1`,`字段名2`,`字段名3`,……)  values (`值1`,`值2`,`值3`, ……),(`值1`,`值2`,`值3`, ……),……
123
例子
-- 一般写插入语句，我们一定要数据和字段一一对应。
-- 插入多个字段
INSERT INTO `grade`(`gradename`) VALUES ('大二'),('大一');

--单独只插入一个字段
INSERT INTO `student`(`name`,`pwd`,`sex`) VALUES ('张三','aaaaa','男')

--可以同时插入多条数据，VALUES后面的值需要使用，隔开即可
INSERT INTO `student`(`name`,`pwd`,`sex`) 
VALUES ('李四','aaaaa','男'),('王五','23232','女')
1234567891011
```

### 4.2 修改

> 修改：
>
> ------
>
> update 修改谁（条件） set 原来的值=新值

```
语法：
update 表名 set `字段名1` = '值1' ,`字段名2` = '值2' … where [条件]
12
-- 修改学员名字

UPDATE `student` SET `name`='囷' WHERE id =1;
-- 不指定条件的情况下，会改动所有表
UPDATE `student` SET `name`='233'

-- 语法；
-- UPDATE 表名 set column_name,[] = value where 条件
12345678
```

条件：where 子句 运算符 id 等于 某个值，大于某个值，在某个区间内修改

操作符返回布尔值
![在这里插入图片描述](https://img-blog.csdnimg.cn/bcc811b1deda4bb2b12d8b2ca478f81a.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5qmZ5a2Q55qE6IOW6IOW,size_20,color_FFFFFF,t_70,g_se,x_16)
注意：

- column_name 是数据库的列，带上
- 条件，是筛选的条件，如果没有指定，则会修改所有的列
- value 是一个具体的值，也可以是一个变量
- 多个设置的属性之间，使用英文逗号隔开

```sql
UPDATE `student` SET `birthday`=CURRENT_TIME where `name`='李四' AND SEX = '男'
1
```

### 4.3 删除

> delete 命令

```
语法  delete from 表名 [where 条件]
1
-- 删除数据 (避免这样写,会删除所有的数据)
DELETE FROM `student`

-- 删除指定
DELETE FROM `student` where id= 1
12345
```

> TRUNCATE 命令

作用：完全清空一个数据库，表的结构和索引不会变

> delete 和 truncate 区别

- 相同点： 都能删除数据，都不会删除表结构
- 不同：
  \- TRUNCATE 重新设置自增列 计数器会归零
  \- TRUNCATE 不会影响事务

```sql
测试代码：

-- 测试delete 和 truncate 区别

CREATE TABLE `test`(
`id` INT(4) NOT NULL AUTO_INCREMENT,
`coll` VARCHAR(20) NOT NULL,
PRIMARY KEY (`id`)
)ENGINE=INNODB DEFAULT CHARSET=utf8

INSERT INTO `test`(`coll`) VALUES('1'),('2'),('3')

DELETE FROM `test` -- 不会影响自增

TRUNCATE TABLE `test` -- 自增会归零

12345678910111213141516
```

了解即可：delete删除的问题 重启数据库，现象

- innoDB 自增列会从1开始（存在内存当中，断电即失）
- MyISAM 继续从上一个自增量开始（存在文件中，不会丢失）

# 五、DQL查询数据（最重点）

### 5.1 DQL

(Data Query Language) :数据查询语言

- 所有的查询操作都用它 Select（select 选择）
- 简单的查询，复杂的查询它都能做
- 数据库中最核心的语言，最重要的语句
- 使用频率最高的语言

![在这里插入图片描述](https://img-blog.csdnimg.cn/e7f974ed32bc45dfadeee6ffd9ef3bd0.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5qmZ5a2Q55qE6IOW6IOW,size_20,color_FFFFFF,t_70,g_se,x_16)

------

### 5.2 指定查询字段

```
 1. 查询全部的学生：select *(通配符) from 表名
 		例子：select * from student
 	
 2.查询指定字段：select  `字段1`,（英文逗号隔开）`字段2`,…   from 表
   		例子：select `studentNo` , `studentName` from student
   
 3.别名，给查询结果表头起一个名字  as  可以给字段起别名，也可以给表起别名
 		例子：selsct `studentNo` as 学号 , `studentName` as 学生名字 from student as s

 4.函数 Concat（a,b）给查出来的表添加字体
 		例子：select concat('姓名：' ,StudentName) as 新名字 from student
123456789101112
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/ae8656bd2226491c8a1b2b2c12352775.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5qmZ5a2Q55qE6IOW6IOW,size_20,color_FFFFFF,t_70,g_se,x_16)

> 去重(将查询出来重复的数据去除掉)
>
> ```
>   语法：在select后面加上一个distinct
>         select distinct `字段名` from 表名
> 12
> ```

![在这里插入图片描述](https://img-blog.csdnimg.cn/b655219432d542b68fcfda9b72cffdd0.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5qmZ5a2Q55qE6IOW6IOW,size_20,color_FFFFFF,t_70,g_se,x_16)

> 数据库的列 (表达式)

select 表达式 from 表
![在这里插入图片描述](https://img-blog.csdnimg.cn/113cd91deca44b14b0cd57c94d003862.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5qmZ5a2Q55qE6IOW6IOW,size_20,color_FFFFFF,t_70,g_se,x_16)
![在这里插入图片描述](https://img-blog.csdnimg.cn/f5e562463ec54c1187cd7aff64e34112.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5qmZ5a2Q55qE6IOW6IOW,size_20,color_FFFFFF,t_70,g_se,x_16)

------

### 5.3where 条件子句

作用：检索数据中符合条件的值

> 逻辑运算符

| 运算符  | 语法            | 结果                             |
| ------- | --------------- | -------------------------------- |
| and &&  | a and b , a&&b  | 逻辑与,两个都为真，结果为真      |
| or \|\| | a or b , a\|\|b | 逻辑或，其中一个为真，则结果为真 |
| Not !=  | not a ,!a       | 逻辑非，真为假，假为真！         |

尽量使用英文

```sql
题目：查询考试成绩在95分到100分之间
方式一：
SELECT `StduentNo`,`StudentResult` FROM result
WHERE StudentResult >=95 AND StudentResult<=100

方式二：
-- 模糊查询（区间）
SELECT `StduentNo`,`StudentResult` FROM result
WHERE StudentResult BETWEEN 95 AND 100

方式三：
-- 除了100分学生之外的同学成绩
SELECT `StduentNo`,`StudentResult` FROM result
WHERE  StudentResult != 100

方式四： !=  not
SELECT `StduentNo`,`StudentResult` FROM result
WHERE NOT StudentResult = 100
123456789101112131415161718
```

> 模糊查询：比较运算符

| 运算符      | 语法              | 描述                                  |
| ----------- | ----------------- | ------------------------------------- |
| IS NULL     | a is null         | 如果操作符为null 结果为真             |
| IS NOT NULL | a is not null     | 如果操作符为not null 结果为真         |
| BETWEEN     | a between b and c | 若a在b 和 c之间则为真                 |
| LIKE        | a like b          | SQL匹配，如果a 匹配到b 则为真         |
| IN          | a in (a1,a2,a3…)  | 假设a 在 a1,a2,a3其中的某一个中，为真 |

```sql
==================like （% 和 _ 只能用在like中）===========================
--  查询姓刘的同学
-- like结合 %（代表0到任意字符）  _(一个字符)
SELECT `StudentNo`,`StudentName` FROM `student`
WHERE StudentName LIKE '刘%';

-- 查询姓刘的同学，名字后只有一个字
SELECT `StudentNo`,`StudentName` FROM `student`
WHERE StudentName LIKE '刘_';

-- 查询姓刘的同学，名字后只有两个字
SELECT `StudentNo`,`StudentName` FROM `student`
WHERE StudentName LIKE '刘__';

-- 查询名字中间有嘉字的同学 %嘉%
SELECT `StudentNo`,`StudentName` FROM `student`
WHERE StudentName LIKE '%嘉%';



===================IN(具体的一个或者多个值)===========================
-- 查询1001 1002 1003 学员信息
之前的方法：
SELECT `StudentNo`,`StudentName` FROM `student`
WHERE StudentNo = 1001
SELECT `StudentNo`,`StudentName` FROM `student`
WHERE StudentNo = 1002
SELECT `StudentNo`,`StudentName` FROM `student`
WHERE StudentNo = 1003

用in来操作的方法：
SELECT `StudentNo`,`StudentName` FROM `student`
WHERE StudentNo IN (1001,1002,1003);

-- 查询在北京的学生（注意in查询的是一个具体的值才能查询出来）
SELECT `StudentNo`,`StudentName` FROM `student`
WHERE `Address` IN('安徽','河南洛阳');


===================NULL NOT NULL===================================
-- 查询地址为空的学生 null ''
SELECT `StudentNo`,`StudentName` FROM `student`
WHERE address=''OR address IS NULL

-- 查询有出生日期的同学  不为空
SELECT `StudentNo`,`StudentName` FROM `student`
WHERE `BornDate` IS NOT NULL;

123456789101112131415161718192021222324252627282930313233343536373839404142434445464748
```

------

### 5.4 联表查询

> JOIN 对比

![在这里插入图片描述](https://img-blog.csdnimg.cn/9cf84092da4c45009d66d4992a5f41a3.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5qmZ5a2Q55qE6IOW6IOW,size_20,color_FFFFFF,t_70,g_se,x_16)

| 操作       | 描述                                         |
| ---------- | -------------------------------------------- |
| Inner join | 如果表中至少有一个匹配，就返回行             |
| left join  | 即使左表中没有匹配，也会从左表中返回所有的值 |
| right jion | 即使右表中没有匹配，也会从右表中返回所有的值 |

> 两表查询

```
语法：
select 别名.共同字段,字段1, 字段2,字段3……
from 表1 as(as可以省略) 别名1
(inner\left\right) join 表2 as 别名2
(where\on) 别名1.共同字段 = 别名2.共同字段 
12345
/*
1. 分析需求，分析查询的字段来自哪些表
2.确定使用哪种连接查询？7种
确定交叉点（这两个表中哪个数据是相同的）
判断的条件： 学生表中 studentNo = 成绩表中 studentNo 
-- JION（表） ON （判断的条件）连接查询
-- where 等值查询
SELECT studentNo,studentName,SubjectNo,StudentResult
FROM student AS s
INNER JOIN result AS r
WHERE s.studentNo=r.studentNo

--Right Join
SELECT s.studentNo,studentName,SubjectNo,StudentResult
FROM student AS s
RIGHT JOIN result AS r
ON s.studentNo = r.studentNo

--LEFT Join
SELECT s.studentNo,studentName,SubjectNo,StudentResult
FROM student AS s
LEFT JOIN result AS r
ON s.studentNo = r.studentNo

123456789101112131415161718192021222324
```

------

> 有条件的联表查询

```
语法：
select 别名.共同字段,字段1, 字段2,字段3……
from 表1 as(as可以省略) 别名1
(inner\left\right) join 表2 as 别名2
on 别名1.共同字段 = 别名2.共同字段 
where 条件
and 条件2 and 条件3……
1234567
查询没有考试的同学
SELECT s.studentNo,studentName,SubjectNo,StudentResult
FROM student AS s
LEFT JOIN result AS r
ON s.studentNo = r.studentNo
WHERE StudentResult IS NULL

1234567
```

------

> 三表或多表查询

```
语法：
select 别名.共同字段,字段1, 字段2,字段3……
from 表1  别名1
(inner\left\right) join 表2  别名2
on 别名1.共同字段1 = 别名2.共同字段1
(inner\left\right) join 表3  别名3
on 别名1.共同字段2 = 别名3.共同字段2 

12345678
 查询了参加考试同学的信息：学号：学生姓名：科目名：分数
SELECT s.`studentNo`,`studentName`,`SubjectName`,`studentResult`
FROM student s
RIGHT JOIN result r
ON r.studentNo=s.studentNo
INNER JOIN `subject` sub
ON r.SubjectNo=sub.SubjectNo

-- 我要查询哪些数据 SELECT ....
-- 从哪几个表中查 FROM 表 xxx JOIN 连接的表 ON 交叉条件
-- 假设存在一中多张表查询，先查询两章表，然后再慢慢增加

FROM a LEFT JOIN b   左为准
FROM a RIGHT JOIN b	右为准
1234567891011121314
```

------

### 5.5 分页和排序

```sql
============================分页 limit 和排序order by=================

-- 排序：  升序ASC  降序  DESC
SELECT  xx
FROM xx
JOIN xx
WHERE  xx
ORDER BY  xx
ASC   ||  DESC

12345678910
```

> 排序
>
> ------
>
> 语法：order by 通过那个字段排序 怎么排
> order by 字段名 asc（升序）\desc（降序）
> ![在这里插入图片描述](https://img-blog.csdnimg.cn/9ee17b1505f94cc3a3d66170ad127748.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5qmZ5a2Q55qE6IOW6IOW,size_20,color_FFFFFF,t_70,g_se,x_16)

------

> 分页
>
> ------
>
> 语法： limit 起始项，每页的数量
> ![在这里插入图片描述](https://img-blog.csdnimg.cn/3bada5a9ff214d70963832874d46ae79.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5qmZ5a2Q55qE6IOW6IOW,size_20,color_FFFFFF,t_70,g_se,x_16)

```sql
-- 为什么要分页
-- 缓解数据库压力，给人的体验更好


-- 分页，每页显示五条数据

-- 语法： limit 当前页，页面的大小
-- limit 0,5 1-5
-- limit 1,5 1-5
-- limit 6,5
SELECT s.`StudentNo`,`StudentName`,`SubjectName`,`StudentResult`
FROM student s
INNER JOIN `result` r
ON s.`StudentNo`=r.`StudentNo`
INNER JOIN `subject` sub
ON r.`subjectNo`=sub.`subjectNo`
WHERE subjectName='数据结构-1'
ORDER BY StudentResult ASC
LIMIT 0,5

-- 第一页 limit 0,5
-- 第二页 limit 5,5
-- 第三页 limit 10,5
-- 第N页 limit 5*（n-1）,5
123456789101112131415161718192021222324
```

------

### 5.6 子查询

where（这个值是计算出来的，即不确定的），之前的where后面是跟一个固定的值
本质：在where语句中嵌套一个子查询语句

> where （select * from）
> 解析：where 后加( ) 括号里面放新的查询语句

```sql
-- ===========================where=========================

-- 1.查询 数据库结构-1的所有考试结构（学号，科目编号，成绩） 降序
-- 方式一： 连接查询
SELECT `StudentNo`,r.`SubjectName`,`StudentResult`
FROM `result` r
INNER JOIN `subject` sub
ON r.SubjectNo = sun.SubjectNo
WHERE subjectName = '数据库结构-1'
ORDER BY StudentResult DESC

-- 方式二：使用子查询(由里及外)
SELECT `StudentNo`,r.`SubjectName`,`StudentResult`
FROM `result`
WHERE StudentNo=(
	SELECT SubjectNo FROM  `subject` 
    WHERE SubjectName = '数据库结构-1'
)
ORDER BY StudentResult DESC


-- 分数不少于80分的学生的学号和姓名
SELECT DISTINCT s.`StudentNo`,`StudentName`
FROM student s
INNER JOIN result r
ON r.StudentNo = s.StudentNo
WHERE StudentResult>=80

-- 在这个基础上 增加一个科目 ，高等数学-2
SELECT DISTINCT s.`StudentNo`,`StudentName`
FROM student s
INNER JOIN result r
ON r.StudentNo = s.StudentNo
WHERE StudentResult>=80 AND `SubjectNo`=(
    SELECT Subject FROM `subject`
    WHERE SubjectName='高等数学-2'
)

-- 查询课程为 高等数学-2 且分数不小于80分的同学的学号和姓名
SELECT s.`StudentNo`,`StudentName`
FROM student s
INNER JOIN result r
ON s.StudentNo = r.StudentNo
INNER JOIN `subject` sub
ON r.`SubjectName`='高等数学-2'
WHERE `SubjectaName`='高等数学-2' AND StudentResult >=80


-- 再改造 (由里即外)
SELECT `StudentNo`,`StudentName` FROM student
WHERE StudentNo IN(
SELECT StudentNo result WHERE StudentResult >80 AND SubjectNo =(
SELECT SubjectNo FROM `subject` WHERE `SubjectaName`='高等数学-2'
)
)

1234567891011121314151617181920212223242526272829303132333435363738394041424344454647484950515253545556
```

# 六、MySQL函数

### 6.1 常用函数

```sql
 数学运算

SELECT ABS(-8) -- 绝对值
SELECT CEILING(9.4) -- 向上取整
SELECT FLOOR(9.4)  -- 向下取整
SELECT RAND() -- 返回0-1随机数
SELECT SIGN(-10) -- 判断一个数的符号 0-0 负数返回-1 正数返回1

-- 字符串函数
SELECT CHAR_LENGTH('即使再小的帆也能远航') -- 返回字符串长度
SELECT CONCAT('我','爱','你') -- 拼接字符串
SELECT INSERT('我爱编程helloword',1,2,'超级热爱') -- 从某个位置开始替换某个长度 ：1为替换的开启下标，2为替换的字字符的长度   结果为：超级热爱编程helloword
SELECT UPPER('Abc') --小写字母
SELECT LOWER('Abc')  --大写字母
SELECT INSTR('kuangshen','h')  -- 返回第一次出现的字符串的索引
SELECT REPLACE('坚持就能成功','坚持','努力')  -- 替换出现的指定字符串
SELECT SUBSTR('狂神说坚持就能成功',4,6)  --返回指定的子字符串（源字符串，截取的位置，截取的长度）
SELECT REVERSE('清晨我上马')  -- 反转

-- 查询姓 周 的同学 ，改成邹
SELECT REPLACE(studentname,'周','邹') FROM student
WHERE studentname LIKE '周%'

-- 时间跟日期函数（记住）
SELECT CURRENT_DATE() -- 获取当前日期
SELECT CURDATE() -- 获取当前日期
SELECT NOW() -- 获取当前日期
SELECT LOCATIME()  -- 本地时间
SELECT SYSDATE()  -- 系统时间

SELECT YEAR(NOW())
SELECT MONTH(NOW())
SELECT DAY(NOW())
SELECT HOUR(NOW())
SELECT MINUTE(NOW())
SELECT SECOND(NOW())

-- 系统
SELECT SYSTEM_USER()
SELECT USER()
SELECT VERSION()


12345678910111213141516171819202122232425262728293031323334353637383940414243
```

### 6.2 聚合函数（常用）

| 函数名称 | 描述   |
| -------- | ------ |
| COUNT()  | 计数   |
| SUM()    | 求和   |
| AVG()    | 平均值 |
| MAX()    | 最大值 |
| MIN()    | 最小值 |
| …        | …      |

![在这里插入图片描述](https://img-blog.csdnimg.cn/56fdf9097c484094bc7ed22a33b773b8.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/997e575a5e1646a7a06c60e5a6e62ed9.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/0f93e87e71b14e098d65aa1062992af6.png)

------

> 分组
>
> > group by
> > ![在这里插入图片描述](https://img-blog.csdnimg.cn/19026e07cd8742e09cf3604deb922e02.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5qmZ5a2Q55qE6IOW6IOW,size_20,color_FFFFFF,t_70,g_se,x_16)

> 分组后有条件判断用
>
> > naving 条件
> > ![在这里插入图片描述](https://img-blog.csdnimg.cn/bf37640c2eed48e9b5327469869c6019.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5qmZ5a2Q55qE6IOW6IOW,size_20,color_FFFFFF,t_70,g_se,x_16)

------

### 6.3 数据库级别MD5加密（拓展）

什么是MD5

主要增强算法复杂度不可逆性。

MD5不可逆，具体的MD5是一样的

MD5破解原理，背后有一个字典，MD5加密后的值，加密前的值

```sql
CREATE TABLE `testmd5`(
`id` INT(4) NOT NULL,
`name` VARCHAR(20) NOT NULL,
`pwd` VARCHAR(50) NOT NULL,
PRIMARY KEY (`id`)

)ENGINE=INNODB DEFAULT CHARSET=UTF8


-- 明文密码
INSERT INTO testmd5 VALUES(1,'张三','123456'),(2,'李四','123456'),(3,'王五','123456')

-- 加密
UPDATE testmd5 SET pwd=MD5(pwd) WHERE id =1
UPDATE testmd5 SET pwd=MD5(pwd) WHERE id !=1  -- 加密全部

-- 插入时加密

INSERT INTO testmd5 VALUES(4,'小明',MD5('123456'))
INSERT INTO testmd5 VALUES(5,'红',MD5('123456'))

-- 如何校验，将用户传递过来的密码，进行MD5加密，然后对比加密后的值
SELECT * FROM testmd5 WHERE `name`='红' AND pwd=MD5('123456')

123456789101112131415161718192021222324
```

> 明码
> ![在这里插入图片描述](https://img-blog.csdnimg.cn/6a5370e9d1284196b7a00365043e444c.png)
> MD5加密后
> ![在这里插入图片描述](https://img-blog.csdnimg.cn/bccde086f7a549619343337ab41f80a9.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5qmZ5a2Q55qE6IOW6IOW,size_20,color_FFFFFF,t_70,g_se,x_16)
> 插入数据的时候就加密：
> ![在这里插入图片描述](https://img-blog.csdnimg.cn/4c790a366c4a4d49be8f8f41073930e8.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5qmZ5a2Q55qE6IOW6IOW,size_20,color_FFFFFF,t_70,g_se,x_16)

# 七、事务

### 7.1 什么是事务

**要么都成功，要么都失败**

------

1. SQL执行， A给B转账 A 1000–> 200 B200
2. SQL 执行， B收到A的钱 A800 — B400

------

将一组SQL放在一个批次中执行

> 事务原则 ： ACID原则 原子性，一致性，隔离性，持久性 （脏读，幻读…）

**原子性**（Atomicity）

要么都成功，要么都失败

**一致性**（Consistency）

事务前后的数据完整性要保持一致

**持久性**（Durability）–事务提交

事务一旦提交就不可逆转，被持久化到数据库中

**隔离性** (Isolation)

事务产生多并发时，互不干扰

------

> 隔离产生的问题

**脏读：**
指一个事务读取了另外一个事务未提交的数据。

**不可重复读：**
在一个事务内读取表中的某一行数据，多次读取结果不同。（这个不一定是错误，只是某些场合不对）

**虚读(幻读)**
是指在一个事务内读取到了别的事务插入的数据，导致前后读取不一致。
（一般是行影响，多了一行）

------

> 执行事务

```sql
 ========================事务===============================
-- mysql 自动开启事务提交
SET autocommit=0 -- 关闭
SET autocommit=1 -- 开启（默认的）

============================================================
-- 手动处理事务
SET autocommit =0 -- 关闭自动提交

-- 事务开启

START TRANSACTION -- 标记一个事务的开始，从这个之后的SQP都在同一个事务内

INSERT XX
INSERT XX

-- 提交 ： 一旦数据提交，就会被持久化(成功)
COMMIT 
-- 回滚：  回到原来的样子（失败）
ROLLBACK
-- 事务结束
SET autocommit = 1 -- 开启自动提交

============================================================

-- 了解
SAVEPOINT 保存点名称 -- 设置一个事务的保存点
ROLLBACK TO SAVEPOINT 保存点名 -- 回滚到保存点
RELEASE SAVEPOINT 保存点 -- 删除保存点

123456789101112131415161718192021222324252627282930
```

------

> 事务执行的流程图
> ![在这里插入图片描述](https://img-blog.csdnimg.cn/57392af188b64535b9ea099a49982b5e.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5qmZ5a2Q55qE6IOW6IOW,size_20,color_FFFFFF,t_70,g_se,x_16)

> 模拟转账的例子
> CREATE DATABASE shop CHARACTER SET utf8 COLLATE utf8_general_ci
> USE shop
> CREATE TABLE `account`(
> `id` INT(3) NOT NULL AUTO_INCREMENT,
> `name` VARCHAR(30) NOT NULL,
> `money` DECIMAL(9,2) NOT NULL,
> PRIMARY KEY (`id`)
> )ENGINE=INNODB DEFAULT CHARSET=utf8

INSERT INTO account(`name`,`money`)
VALUES(‘A’,2000),(‘B’,10000)

– 模拟转账：事务
SET autocommit = 0; – 关闭自动提交
START TRANSACTION – 开启事务（一组事务）
UPDATE account SET money = money-500 WHERE `name` = ‘A’ – A 转账给B
UPDATE account SET money = money+500 WHERE `name` = ‘B’ – B 收到钱

COMMIT ; – 提交事务
ROLLBACK ; – 回滚

SET autocommit=1 – 恢复默认值

```sql
建表
CREATE DATABASE shop CHARACTER SET utf8 COLLATE utf8_general_ci
USE shop
CREATE TABLE `account`(
`id` INT(3) NOT NULL AUTO_INCREMENT,
`name` VARCHAR(30) NOT NULL,
`money` DECIMAL(9,2) NOT NULL,
PRIMARY KEY (`id`)
)ENGINE=INNODB DEFAULT CHARSET=utf8


插入数据
INSERT INTO account(`name`,`money`)
VALUES('A',2000),('B',10000)

=============================开启模拟转账业务====================================
-- 模拟转账：事务
SET autocommit = 0; -- 关闭自动提交
START TRANSACTION -- 开启事务（一组事务）
UPDATE account SET money = money-500 WHERE `name` = 'A' -- A 转账给B
UPDATE account SET money = money+500 WHERE `name` = 'B' -- B 收到钱

COMMIT ; -- 提交事务
ROLLBACK ; -- 回滚

SET autocommit=1 -- 恢复默认值
=================================================================

12345678910111213141516171819202122232425262728
```

# 八、索引

> MySQL 官方对索引的定义为：**索引(Index)是帮助M有SQL高效获取的数据结构。 （如：不使用索引时0.5s —> 用了变为0.000001s）**
> 提取句子主干，就可以得到索引的本质：索引是数据结构。

### 8.1索引的分类

> 在一个表中，主键索引只能有一个，唯一索引可以有多个

- 主键索引 （PRIMARY KEY）

  - 唯一的标识，主键不可重复，只能有一个列作为主键

- 唯一索引 （UNIQUE KEY）

  - 避免在一个字段中有重复的数据出现（如身份证每个人都是不一样的），唯一索引可以重复，多个字段都可以标识唯一索引

- 常规索引（KEY/INDEX）

  - 默认的，index,key关键字来设置

- 全文索引（FULLTEXT）

  - 在特点的数据库引擎下才有，MyISAM
  - 快速定位数据

  ```
  索引的使用
  1.在创建表的时候给字段增加索引
  2.创建完毕后，增加索引
  
  显示所有的索引信息
   		show index from 表名
  =============================================================================
   添加一个索引（方式一：）
   		alter table 表 add 索引类型 index `索引名`（`字段名`）
   		解析：所有的改变表都是用alter
   		   			后面的那个索引名是自己起的,可以起得跟字段名一样
   
   方式二：在建表的同时就设置索引
   方式三：建一个常规索引
  1234567891011121314
  ```

![在这里插入图片描述](https://img-blog.csdnimg.cn/245d4155b73a4386a14a3f57332d7245.png)

````
=============================================================================

 explain 分析sql执行情况
 explain select * from 表  --非全文索引
```
12345
````

例子

```sql
索引的使用
  	1.在创建表的时候给字段增加索引
	2.创建完毕后，增加索引

-- 显示所有的索引信息
SHOW INDEX FROM 表

-- 增加一个索引
ALTER TABLE school.student ADD FULLTEXT INDEX `srudentName`（`srudentName`）

-- EXPLAIN 分析sql执行状况
EXPLAIN SELECT * FROM student -- 分析 非全文索引 sql的执行情况
EXPLAIN SELECT * FROM student WHERE MATCH(studentName) AGAINST(`刘`)；---- 分析 全文索引 sql的执行情况

1234567891011121314
```

### 8.2 测试索引

```sql
CREATE TABLE `app_user` (
`id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
`name` VARCHAR(50) DEFAULT '',
`email` VARCHAR(50) NOT NULL,
`phone` VARCHAR(20) DEFAULT '',
`gender` TINYINT(4) UNSIGNED DEFAULT '0',
`password` VARCHAR(100) NOT NULL DEFAULT '',
`age` TINYINT(4) DEFAULT NULL,
`create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
`update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8

-- 插入100万数据
DELIMITER $$ --  写函数之前必写
CREATE FUNCTION mock_data()
RETURNS INT 
BEGIN
DECLARE num INT DEFAULT 1000000;
DECLARE i INT DEFAULT 0;

WHILE i<num DO
-- 插入语句
INSERT INTO app_user(`name`,`email`,`phone`,`gender`,`password`,`age`)
VALUE(CONCAT('用户',i),'534240118@qq.com',FLOOR (CONCAT('18',RAND()*9999999)),FLOOR (RAND()*2),
UUID(),FLOOR (RAND()*100));

SET i = i+1;
END WHILE;
RETURN i;


END;

INSERT INTO app_user(`name`,`email`,`phone`,`gender`,`password`,`age`)
VALUE(CONCAT('用户',i),'534240118@qq.com',FLOOR (CONCAT('18',RAND()*9999999)),FLOOR (RAND()*2),
UUID(),FLOOR (RAND()*100))


SELECT mock_data();

SELECT * FROM app_user WHERE `name`='用户9999' -- 接近半秒

EXPLAIN SELECT * FROM app_user WHERE `name`='用户9999'  -- 查询99999条记录

-- id _ 表名_字段名
-- create index on 字段
CREATE INDEX id_app_user_name ON app_user(`name`); -- 0.001 s
EXPLAIN SELECT * FROM app_user WHERE `name`='用户9999'  -- 查询一条记录
12345678910111213141516171819202122232425262728293031323334353637383940414243444546474849
```

索引在小数据的时候，用处不大，但是在大数据的时候，区别十分明显

**SQLyong查看索引的位置**
![在这里插入图片描述](https://img-blog.csdnimg.cn/33025a4e0ed44641b3c9a95473569301.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5qmZ5a2Q55qE6IOW6IOW,size_20,color_FFFFFF,t_70,g_se,x_16)

### 8.3 索引原则

- 索引不是越多越好
- 不要对经常变动的数据加索引
- 小数据量的表不需要加索引
- 索引一般加在常用来查询的字段上

> 索引的数据结构

Hash 类型的索引
Btree: 默认innodb 的数据结构
阅读： http://blog.codinglabs.org/articles/theory-of-mysql-index.html

# 九、数据库的列类型

> 数值

| 类型       | 作用                                      |
| ---------- | ----------------------------------------- |
| tinyint    | 十分小的数据 1个字节                      |
| smallint   | 较小的数据 2个字节                        |
| mediumint  | 中等大小 3个字节                          |
| int (常用) | 标准的整数 4个字节                        |
| bigint     | 较大的数据 8个字节                        |
| float      | 浮点数 4个字节                            |
| double     | 浮点数 8个字节 （精度问题）               |
| decimal    | 字符串形式的浮点数,金融计算的时候，一般用 |

> 字符串

| 类型           | 作用                       |
| -------------- | -------------------------- |
| char           | 字符串固定大小 0-255       |
| varchar (常用) | 可变字符串 0-65535         |
| tinytext       | 微型文本 2^8-1             |
| text           | 文本串 2^16-1 (保存大文本) |

> 时间日期
> java中 --> java.util.Date

| 类型            | 作用                                 |
| --------------- | ------------------------------------ |
| date            | YYYY-MM-DD -->日期格式               |
| time            | HH:mm:ss --> 时间格式                |
| datetime (常用) | YYYY-MM-DD HH:mm:ss 最常用的时间格式 |
| timestamp       | 时间戳 1970.1.1到现在的毫秒数        |
| year            | 年份表示                             |

> null

- 没有值，未知
- 注意，不要使用null进行运算，结果为null

# 十、数据库的字段类型（重点）

![在这里插入图片描述](https://img-blog.csdnimg.cn/ae79770a46de4fe3b1090cb8bc3565f1.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5qmZ5a2Q55qE6IOW6IOW,size_20,color_FFFFFF,t_70,g_se,x_16)
unsigened：

- 无符号的整数
- 声明该列不能声明负数

zerofill：

- 0填充的
- 10的长度 1 – 0000000001 不足位数用0 填充

自增：

- 通常理解为自增，自动在上一条记录的基础上+1
- L通常用来设计唯一的主键 index,必须是整数类似
- 可以自定义设置主键自增的起始值和步长
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/c710035635bd4080b8b88d90fb83d802.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5qmZ5a2Q55qE6IOW6IOW,size_20,color_FFFFFF,t_70,g_se,x_16)
  非空 NULL not Null：
- 假设设置为 not null，如何不给他赋值，就会报错
- NULL 如果不填写，默认为NULL

默认：

- 设置默认的值！