# 数组

## 二分查找

### [704. 二分查找 - 力扣（LeetCode）](https://leetcode.cn/problems/binary-search/)

```c++
class Solution {
public:
    int search(vector<int>& nums, int target) {
        int left = 0;
        int right = nums.size() - 1;
        while (left <= right) {
            int middle = left + (right - left)/2;
            if (nums[middle] < target) {
                left = middle + 1;
            }
            else if (nums[middle] > target) {
                right = middle - 1;
            }
            else {
                return middle;
            }
        }
        return -1;
    }
};
```

注意left和right的界

### **相关题目**

[35. 搜索插入位置 - 力扣（LeetCode）](https://leetcode.cn/problems/search-insert-position/submissions/)

```c++
class Solution {
public:
    int searchInsert(vector<int>& nums, int target) {
        int left = 0;
        int right = nums.size() - 1;
        while(left <= right) {
            int middle = (right + left) / 2;
            if (nums[middle] < target) {
                left = middle + 1;
            }
            else {
                right = middle - 1;
            }
        }
        return left;
    }
};
```

注意不需要返回middle而是返回left



[34. 在排序数组中查找元素的第一个和最后一个位置 - 力扣（LeetCode）](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/)

```c++
class Solution {
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        int firstTarget = findFirstTarget(nums, target);
        int lastTarget = findLastTarget(nums, target);
        if (firstTarget == -2) {
            return {-1, -1 };
        }
        else if (lastTarget == -2) {
            return {-1, -1};
        }
        else if (lastTarget - firstTarget > 1 ){
            return { firstTarget + 1, lastTarget - 1};
        }
        else return {-1, -1};
            
    }
private:
    int findFirstTarget(vector<int>& nums, int target) {
        int left = 0;
        int right = nums.size() - 1;
        int border = -2;
        while (left <= right) {
            int middle = left + ((right - left) / 2);
            if (nums[middle] >= target) {
                right = middle - 1;
                border = right;
            }
            else {
                left = middle + 1;
            }
        }
        return border;
    }

    int findLastTarget(vector<int>& nums, int target) {
        int left = 0;
        int right = nums.size() - 1;
        int border = -2;
        while (left <= right) {
            int middle = left + ((right - left) / 2);
            if (nums[middle] > target) {
                right = middle - 1;
            }
            else {
                left = middle + 1;
                border = left;
            }
        }
        return border;
    }
};
```

未赋值不能为-1，有可能本身middle-1得出-1，较为复杂



## 移除元素

[27. 移除元素 - 力扣（LeetCode）](https://leetcode.cn/problems/remove-element/)

```c++
class Solution {
public:
    int removeElement(vector<int>& nums, int val) {
        int slow = 0;
        int count = 0;
        for (int fast = 0; fast < nums.size(); fast++) {
            if (nums[fast] != val) {
                nums[slow] = nums[fast];
                slow++;
            }
            else {
                count++;
            }
        }
        for (int i = 0; i < count; i++) {
            nums.pop_back();
        }

        return nums.size();
    }
};
```

双指针