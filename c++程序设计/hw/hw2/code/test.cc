#include "share_int.h"
#include "unique_int.h"

using namespace std;

void test_share_int() {
    std::cout << "内存地址 \t\t|指向该地址的指针数\t|调用方法 " <<std::endl;
    // 创建新unique_int对象
    share_int p1(new int(0));
    // 解引用
    cout << "解引用 p1 : "<< *p1 << endl;
    cout << "---------------------------------------------------------------------"<< endl;
    // 右值构造
    share_int p2 = share_int(new int(1));
    // 拷贝构造
    share_int p3 = move(p2);
    share_int p4 = move(p2);
    cout << "解引用 p2 : "<< *p2 << endl;
    cout << "解引用 p3 : "<< *p3 << endl;
    cout << "解引用 p4 : "<< *p4 << endl;
    cout << "---------------------------------------------------------------------"<< endl;
    // 销毁对象
    p2.~share_int();
    p3.~share_int();
    p4.~share_int();
    cout << "---------------------------------------------------------------------"<< endl;
}

void test_unique_int() {
    std::cout << std::setw(14) << std::left << "内存地址" << "\t\t| 调用方法 " <<std::endl;
    // 创建新unique_int对象
    unique_int p1(new int(0));
    // 解引用
    cout << "解引用 p1 : "<< *p1 << endl;
    cout << "---------------------------------------------------------------------"<< endl;
    // 右值构造
    unique_int p2(new int(1));
    cout << "解引用 p2 : "<< *p2 << endl;
    // 右值赋值转移p2对象所有权
    unique_int p3;
    unique_int p4;
    p3.change(p2);
    cout << "解引用 p3 : "<< *p3 << endl;
    p4.change(p3);
    cout << "解引用 p4 : "<< *p4 << endl;
    cout << "---------------------------------------------------------------------"<< endl;
    // 销毁对象
    p2.~unique_int();
    p3.~unique_int();
    p4.~unique_int();
    cout << "---------------------------------------------------------------------"<< endl;
}

int main(){
    cout << "------------------------share_int------------------------------------" << endl;
    test_share_int();
    cout << "---------------------------------------------------------------------" << endl;
    cout << "---------------------------------------------------------------------" << endl;
    cout << "---------------------------------------------------------------------" << endl;
    cout << "------------------------unique_int-----------------------------------" << endl;
    test_unique_int();

    return 0;
}