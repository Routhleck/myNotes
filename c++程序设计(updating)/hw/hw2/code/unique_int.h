#include <iostream>

// 实现智能指针unique_int
class unique_int {
public:
    unique_int(int* p = nullptr) : ptr(p) {
        std::cout << "<" << ptr << "> \t| " << "\t\t\t 构造函数" <<std::endl;
    }
    unique_int(const unique_int& other) = delete;
    unique_int& operator=(unique_int& other) {
        reset(other.release());
        std::cout << "<" << ptr << "> \t| " << "\t\t\t 已转移对象所有权" <<std::endl;
    }

    ~unique_int() {
        if (ptr != nullptr)
        {
            std::cout << "<" << ptr << "> \t| " << "\t\t\t 析构函数" <<std::endl;
            std::cout << "<" << ptr << "> \t| " << "\t\t\t 内存已释放" <<std::endl;
            delete ptr;
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
