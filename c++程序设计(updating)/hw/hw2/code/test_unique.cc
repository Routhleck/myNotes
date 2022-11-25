#include "unique_int.h"

using namespace std;

void test_unique_int() {
    std::cout << "内存地址 \t\t|指向该地址的指针数\t|调用方法 " <<std::endl;
    // 创建新unique_int对象
    unique_int p1(new int(0));
    // 解引用
    cout << "解引用 p1 : "<< *p1 << endl;
    cout << "---------------------------------------------------------------------"<< endl;
    // 右值构造
    unique_int p2 = unique_int(new int(1));
    // 右值赋值转移对象所有权
    unique_int p3;
    unique_int p4;

    cout << "解引用 p2 : "<< *p2 << endl;
    cout << "解引用 p3 : "<< *p3 << endl;
    cout << "解引用 p4 : "<< *p4 << endl;
    cout << "---------------------------------------------------------------------"<< endl;
    // 销毁对象
    p2.~unique_int();
    p3.~unique_int();
    p4.~unique_int();
    cout << "---------------------------------------------------------------------"<< endl;
}

int main(){
    cout << "------------------------unique_int------------------------" << endl;
    test_unique_int();

    return 0;
}