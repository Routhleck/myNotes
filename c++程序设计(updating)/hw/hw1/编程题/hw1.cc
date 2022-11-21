#include <iostream>

int class_amount = 0;
int class_id = 0;
// 实现一个最多只能产生2个对象的类
class A{
public:
    A();
    A(const A& a);
    ~A();
    //A &operator=(const A& a)=delete;
    void kill();
private:
    int id;
    void call();
};

A::A(void){
    class_id++;
    if (class_amount >= 2){
        // 删除此对象
        this->id = class_id;
        this->~A();
        std::cout << "id:" << this->id << "对象未被创建，因为此时对象已为2个" << std::endl;
    }
    else {
        class_amount++;
        this->id = class_id;
        std::cout << "id:" << this->id << "对象创建成功，此时对象数量为: "<< class_amount << std::endl;
    }
}

A::A(const A& a){
    class_id++;
    this->id = class_id;
    if (class_amount >= 2){
        this->~A();
        std::cout << "id:" << this->id << "对象拷贝未被创建，因为此时对象已为2个" << std::endl;
    }
}

A::~A(void){}

void A::kill(void){
    this->~A();
    class_amount--;
    std::cout << "id:" << this->id << "对象成功删除,，此时对象数量为: "<< class_amount << std::endl;
}
void A::call(void){
    std::cout << "id:" << this->id << "对象被调用" << std::endl;
}

int main(){
    A a1;
    A a2;
    A a3;
    a1.kill();
    a2.kill();
    A a4;
    A a5;
    A a6 = a4;
    //a6.call();
    return 0;
}
