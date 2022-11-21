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

#### 搜索插入位置

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

#### 排序数组查找元素的第一个和最后一个位置

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

## 有序数组的平方

[977. 有序数组的平方 - 力扣（LeetCode）](https://leetcode.cn/problems/squares-of-a-sorted-array/submissions/)

```c++
class Solution {
public:
    vector<int> sortedSquares(vector<int>& nums) {
        int left =0;
        int right = nums.size() - 1;
        vector<int> newNums;
        while(left != right){
            if (nums[left] * nums[left] >= nums[right] * nums[right]){
                newNums.insert(newNums.begin(), nums[left] * nums[left]);
                left++;
            }
            else {
                newNums.insert(newNums.begin(), nums[right] * nums[right]);
                right--;
            }
        }
        newNums.insert(newNums.begin(), nums[left] * nums[left]);
        return newNums;
    }
};
```

## 长度最小的子数组

[209. 长度最小的子数组 - 力扣（LeetCode）](https://leetcode.cn/problems/minimum-size-subarray-sum/)

```c++
class Solution {
public:
    int minSubArrayLen(int target, vector<int>& nums) {
        int left = 0;
        int minLen = INT32_MAX;
        int sum = 0;
        bool flag = true;

        for (int right = left; right < nums.size(); right++) {
            sum += nums[right];
            while (sum >= target) {
                if (minLen > right - left + 1){
                    minLen = right - left + 1;
                }
                sum -= nums[left++];
            }
        }
        if (minLen == INT32_MAX){
            return 0;
        }
        else {
            return minLen;
        }
    }
};
```

滑动窗口
外面用for，里面用while，sum不能硬求要随时+-，妙手

## 螺旋矩阵

[59. 螺旋矩阵 II - 力扣（LeetCode）](https://leetcode.cn/problems/spiral-matrix-ii/submissions/)

```c++
class Solution {
public:
    vector<vector<int>> generateMatrix(int n) {
        vector<vector<int>> matrix(n);
        for (int i = 0; i < n; i++) {
            matrix[i].resize(n);
        }
        int direction = 0;
        int x = 0;
        int y = 0;

        int x_left = 0;
        int x_right = n - 1;
        int y_top = 1;
        int y_bot = n - 1;

        for (int i = 1; i <= n * n; i++) {
            switch (direction) {
            case 0:
                matrix[y][x] = i;
                if (x + 1 > x_right) {
                    direction = 1;
                    y++;
                    x_right = x - 1;
                    break;
                }
                else {
                    x++;
                }
                break;
            case 1:
                matrix[y][x] = i;
                if (y + 1 > y_bot) {
                    direction = 2;
                    x--;
                    y_bot = y - 1;
                    break;
                }
                else {
                    y++;
                }
                break;
            case 2:
                matrix[y][x] = i;
                if (x - 1 < x_left) {
                    direction = 3;
                    y--;
                    x_left = x + 1;
                    break;
                }
                else {
                    x--;
                }
                break;
            case 3:
                matrix[y][x] = i;
                if (y - 1 < y_top) {
                    direction = 0;
                    x++;
                    y_top = y + 1;
                    break;
                }
                else {
                    y--;
                }
                break;
            }
        }
        return matrix;

    }
};
```

思路很简单就按着大小去走，撞到墙就换方向并更新墙的位置。

# 链表

## 移除链表元素

[203. 移除链表元素 - 力扣（LeetCode）](https://leetcode.cn/problems/remove-linked-list-elements/submissions/)

```c++
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* removeElements(ListNode* head, int val) {
        // 去掉开头的val
        ListNode* temp_head = head;
        while (temp_head != NULL && temp_head->val == val) {
            temp_head = temp_head->next;
        }
        head = temp_head;
        // 去掉后序的val
        while (temp_head != NULL && temp_head->next != NULL) {
            if (temp_head->next->val == val) {
                temp_head->next = temp_head->next->next;
            }
            else {
                temp_head = temp_head->next;
            }
        }
        return head;
    }
};
```

## 设计链表

[707. 设计链表 - 力扣（LeetCode）](https://leetcode.cn/problems/design-linked-list/)