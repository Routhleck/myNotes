#include <iostream>
#include <iomanip>
// 实现智能指针unique_int
class unique_int {
public:
    unique_int(int* p = nullptr) : ptr(p) {
        std::cout << "<";
        std::cout << std::setw(14) << std::left  << ptr << ">\t| " << "构造函数" <<std::endl;
    }
    unique_int(const unique_int& other) = delete;
    // 转移对象所有权
    unique_int& change(unique_int& other) {
        reset(other.release());
        std::cout << "<";
        std::cout << std::setw(14) << std::left  << ptr << ">\t| " << "已转移对象所有权" <<std::endl;
        return *this;
    }

    ~unique_int() {
        if (ptr != nullptr)
        {
            std::cout << "<";
            std::cout << std::setw(14) << std::left  << ptr << ">\t| " << "析构函数" <<std::endl;
            std::cout << "<";
            std::cout << std::setw(14) << std::left  << ptr << ">\t| " << "内存释放" <<std::endl;
            int* old_ptr = ptr;
            ptr = nullptr;
            delete old_ptr;
        }
        else {
            // std::cout << "<";
            // std::cout << std::setw(14) << std::left  << ptr << ">\t| " << "指向的内存已被释放" << std::endl;
        }
    }

    void reset(int *p = nullptr) {
        if (p != ptr) {
            delete ptr;
            ptr = p;
        }
    }

    int* release() {
        int *old_ptr = ptr;
        ptr = nullptr;
        return old_ptr;
    }
    int& operator*() const { return *ptr; }
    int* operator->() const { return ptr; }
private:
    int* ptr;
};
