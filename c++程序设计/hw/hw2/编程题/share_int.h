#include <iostream>

// 引用计数实现智能指针share_int
class share_int {
public:
    share_int(int* p = nullptr) : ptr(p), count(new size_t(1)) {
        std::cout << "<" << ptr << "> \t| " << *count << "\t\t\t|构造函数" <<std::endl;
    }
    share_int(const share_int& other) : ptr(other.ptr), count(other.count) {
        ++*count;
        std::cout << "<" << ptr << "> \t| " << *count << "\t\t\t|拷贝构造函数" <<std::endl;
    }
    share_int& operator=(const share_int& other) {
        ++*other.count;
        std::cout << "<" << ptr << "> \t| " << *count << "\t\t\t|拷贝赋值函数" <<std::endl;

        ptr = other.ptr;
        count = other.count;
        return *this;
    }

    ~share_int() {
        if (*count != -1)
        {
            std::cout << "<" << ptr << "> \t| " << *count << "\t\t\t|析构函数" <<std::endl;
            if (--*count == 0) {
                std::cout << "<" << ptr << "> \t| " << "\t\t\t|内存已释放" <<std::endl;
                delete ptr;
                *count = -1 ;
            }
            else {
                std::cout << "<" << ptr << "> \t| " << "\t\t\t|内存未释放" <<std::endl;
            }
        }
    }
    int& operator*() const { return *ptr; }
    int* operator->() const { return ptr; }
    size_t use_count() const { return *count; }
private:
    int* ptr;
    size_t* count;
};
