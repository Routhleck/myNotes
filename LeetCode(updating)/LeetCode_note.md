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

```c++
class MyLinkedList {
public:
    struct LinkedNode{
        int val;
        LinkedNode* next;
        LinkedNode(int val):val(val), next(nullptr){};
    };

    MyLinkedList() {
        _dummyHead = new LinkedNode(0);
        _size = 0;
    }
    
    int get(int index) {
        if (index < 0 || index > (_size - 1)) {
            return -1;
        }
        else {
            LinkedNode* temp = _dummyHead->next;
            while (index--) {
                temp = temp->next;
            }
            return temp->val;
        }

    }
    
    void addAtHead(int val) {
        if (_dummyHead->next == nullptr) {
            _dummyHead->next = new LinkedNode(val);
        }
        else {
            LinkedNode* temp = _dummyHead->next;
            _dummyHead->next = new LinkedNode(val);
            _dummyHead->next->next = temp;
        }
        _size++;
    }
    
    void addAtTail(int val) {
        LinkedNode* temp = _dummyHead;
        while(temp->next != nullptr) {
            temp = temp->next;
        }
        temp->next = new LinkedNode(val);
        _size++;
    }
    
    void addAtIndex(int index, int val) {
        if (index > _size) {
            return;
        }
        else if (index < 0) {
            if (_dummyHead->next == nullptr) {
            _dummyHead->next = new LinkedNode(val);
            }
            else {
                LinkedNode* temp = _dummyHead->next;
                _dummyHead->next = new LinkedNode(val);
                _dummyHead->next->next = temp;
            }
            _size++;
        }
        else {
            LinkedNode* temp = _dummyHead;
            while(index--) {
                temp = temp->next;
            }
            LinkedNode* temp_next = temp->next;
            temp->next = new LinkedNode(val);
            temp->next->next = temp_next;
        }
        _size++;
    }
    
    void deleteAtIndex(int index) {
        if (index >= 0 && index <= (_size - 1)) {
            LinkedNode* temp = _dummyHead;
            while(index--) {
                temp = temp->next;
            }
            LinkedNode* delete_temp = temp->next;
            temp->next = temp->next->next;
            delete delete_temp;
            _size--;
        }
    }

private:
    int _size;
    LinkedNode* _dummyHead;
};
```

## 翻转链表

[206. 反转链表 - 力扣（Leetcode）](https://leetcode.cn/problems/reverse-linked-list/)

使用pre和cur两个指针，以及需要一个temp指针来进行保存临时指针

```c++
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* pre = nullptr;
        ListNode* cur = head;
        ListNode* temp = cur;
        while(cur != nullptr) {
            ListNode* temp = cur;
            cur = cur->next;
            temp->next = pre;
            pre = temp; 
        }
        return pre;
    }
};
```

## 两两交换链表中的节点

[24. 两两交换链表中的节点 - 力扣（Leetcode）](https://leetcode.cn/problems/swap-nodes-in-pairs/)

```c++
class Solution {
public:
    ListNode* swapPairs(ListNode* head) {
        ListNode* dummy = new ListNode(0);
        dummy->next = head;
        ListNode* pre = dummy;
        ListNode* cur = head;
        ListNode* post = new ListNode(0);
        if (head == nullptr) {
            return head;
        }
        else if (head->next == nullptr) {
            return head;
        }
        else if (head->next->next == nullptr) {
            post = nullptr;
        }
        else {
            post = cur->next->next;
        }
        while (cur->next != nullptr) {
            pre->next = cur->next;
            pre->next->next = cur;
            pre = cur;
            cur->next = post;
            cur = post;
            if (cur ==nullptr) {
                break;
            }
            else if (cur->next == nullptr){
                break;
            }
            post = cur->next->next;
        }
    return dummy->next;
    }
};
```

## 删除链表的倒数第N个节点

[19. 删除链表的倒数第 N 个结点 - 力扣（Leetcode）](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/)

```c++
class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        ListNode* dummyhead = new ListNode(0);
        dummyhead->next = head;
        ListNode* fast = dummyhead;
        ListNode* slow = dummyhead;
        for(int i = 0; i < n; i++) {
            if (fast == nullptr) break;
            fast = fast->next;
        }
        while (fast->next != nullptr) {
            fast = fast->next;
            slow = slow->next;
        }
        slow->next = slow->next->next;
        return dummyhead->next;
    }
};
```

## 链表相交

[面试题 02.07. Intersection of Two Linked Lists LCCI - 力扣（Leetcode）](https://leetcode.cn/problems/intersection-of-two-linked-lists-lcci/)

```c++
class Solution {
public:
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
        ListNode* curA = headA;
        ListNode* curB = headB;
        int lenA = 0, lenB = 0;
        while (curA != NULL) { // 求链表A的长度
            lenA++;
            curA = curA->next;
        }
        while (curB != NULL) { // 求链表B的长度
            lenB++;
            curB = curB->next;
        }
        curA = headA;
        curB = headB;
        // 让curA为最长链表的头，lenA为其长度
        if (lenB > lenA) {
            swap (lenA, lenB);
            swap (curA, curB);
        }
        // 求长度差
        int gap = lenA - lenB;
        // 让curA和curB在同一起点上（末尾位置对齐）
        while (gap--) {
            curA = curA->next;
        }
        // 遍历curA 和 curB，遇到相同则直接返回
        while (curA != NULL) {
            if (curA == curB) {
                return curA;
            }
            curA = curA->next;
            curB = curB->next;
        }
        return NULL;
    }
};
```

## 环形链表II

[142. 环形链表 II - 力扣（Leetcode）](https://leetcode.cn/problems/linked-list-cycle-ii/)

使用快慢指针

<img src="LeetCode_note.assets/image-20221226113554550.png" alt="image-20221226113554550" style="zoom:50%;" /> 环长=b+c；慢指针移动距离 = a + b; 快指针移动距离 = a + b + k(b+c)

从快指针移动距离是慢指针的两倍`2(a + b) = a + b +k(b+c)`推导出`a - c = (k - 1)(b + c)`

意味着slow从相遇点出发，head从头结点出发，走c步后，slow在入口，head到入口的距离也恰好是环长的倍数，继续走两者必然会在入口相遇。

```c++
class Solution {
public:
    ListNode *detectCycle(ListNode *head) {
        ListNode* slow = head;
        ListNode* fast = head;
        while(fast && fast->next) {
            fast = fast->next->next;
            slow = slow->next;
            if (fast == slow) {
                while (slow != head) {
                    slow = slow->next;
                    head = head->next;
                }
                return slow;
            }
        }
        return NULL;

    }
};
```

# 哈希表

## 有效的字幕异位词

[242. 有效的字母异位词 - 力扣（Leetcode）](https://leetcode.cn/problems/valid-anagram/)

int数组来记录每个英文字符出现的次数，使用`当前字符- 'a'`来表示当前字符应存在哪个位置

```c++
class Solution {
public:
    bool isAnagram(string s, string t) {
        if (s.size() != t.size()) {
            return false;
        }
        int record[26] = {0};
        for(int i = 0; i < s.size(); i++) {
            record[s[i] - 'a']++;
        }
        
        for(int i = 0; i < t.size(); i++) {
            record[t[i] - 'a']--;
        }
        for(int i = 0; i < 26; i++) {
            if (record[i] != 0) return false;
        }
        return true;
    }
};
```

## 两个数组的交集

[349. 两个数组的交集 - 力扣（Leetcode）](https://leetcode.cn/problems/intersection-of-two-arrays/)

使用unordered_set

```c++
class Solution {
public:
    vector<int> intersection(vector<int>& nums1, vector<int>& nums2) {
        unordered_set<int> result;
        unordered_set<int> num_set(nums1.begin(), nums1.end());
        for(int num : nums2) {
            if (num_set.find(num) != num_set.end()) {
                    result.insert(num);
            }
        }
        return vector<int> (result.begin(), result.end());
    }
};
```

## 快乐数

[202. Happy Number - 力扣（Leetcode）](https://leetcode.cn/problems/happy-number/)

```c++
class Solution {
public:
    int getValue(int n) {
        int sum = 0;
        while(n) {
            sum += (n % 10) * (n % 10);
            n = n / 10;
        }
        return sum;
    }

    bool isHappy(int n) {
        int sum = n;
        unordered_set<int> result;
        // 使用while进行求和
        while(sum != 1) {
            sum = getValue(sum);
            if (result.find(sum) != result.end()) {
                return false;
            }
            else {
                result.insert(sum);
            }
        }
        return true;
    }
};
```

## 两数之和

[1. 两数之和 - 力扣（Leetcode）](https://leetcode.cn/problems/two-sum/)

使用unordered_map来记录之前是否遍历过

哈希表`iter`迭代器有两个成员`first`代表迭代器所指向元素的键，`second`表示迭代器所指向元素的值

```c++
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        for(int i = 0;i < nums.size(); i++) {
            auto iter = map.find(target - nums[i]);
            if(iter != map.end()) {
                return {iter->second, i};
            }
            map.insert(pair<int, int> (nums[i], i));
        }
        return {};
    }
};
```

## 四数相加

[454. 四数相加 II - 力扣（Leetcode）](https://leetcode.cn/problems/4sum-ii/)

分成两个组合，第一个用一个unordered_map来存储

```c++
class Solution {
public:
    int fourSumCount(vector<int>& nums1, vector<int>& nums2, vector<int>& nums3, vector<int>& nums4) {
        // 遍历nums1&nums2获得一个新的map
        unordered_map<int, int> mapA;
        int target = 0;
        for(int a : nums1) {
            for (int b : nums2) {
                mapA[a+b]++;
            }
        }
        int count = 0;
        // 遍历nums3&nums4来查看是否存在合适的mapA里的值
        for(int c : nums3) {
            for(int d : nums4) {
                if(mapA.find(target - c - d) != mapA.end()) {
                    count += mapA[target - c - d];
                }
            }
        }
        return count;
    }
};
```

## 赎金信

[383. 赎金信 - 力扣（Leetcode）](https://leetcode.cn/problems/ransom-note/)

```c++
class Solution {
public:
    bool canConstruct(string ransomNote, string magazine) {
        unordered_map<char, int> magaMap;
        for (int i = 0; i < magazine.size(); i++) {
            magaMap[magazine[i]]++;
        }

        for (int i = 0; i < ransomNote.size(); i++) {
            if (magaMap.find(ransomNote[i]) != magaMap.end()) {
                if (magaMap[ransomNote[i]] <= 0) return false;
                else magaMap[ransomNote[i]]--;
            }
            else return false;
        }
        return true;
    }
};
```

## 三数之和

[15. 三数之和 - 力扣（Leetcode）](https://leetcode.cn/problems/3sum/)

使用双指针，去重要求较多

```c++
class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        // 给nums排序
        sort(nums.begin(), nums.end());
        vector<vector<int>> result;
        if (nums.size() < 3) return result;
        for (int i = 0; i < nums.size(); i++) {
            if (nums[i] > 0) return result;
            if (i > 0 && nums[i] == nums[i - 1]) continue;

            int left = i + 1;
            int right = nums.size() - 1;

            while (left < right) {
                if (nums[i] + nums[left] + nums[right] == 0) {
                    result.push_back(vector<int> {nums[i], nums[left], nums[right]});
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    right--;
                    left++;

                }
                else if (nums[i] + nums[left] + nums[right] > 0) right--;
                else left++;
            }
        }
        return result;
    }
};
```

## 四数之和

[18. 四数之和 - 力扣（Leetcode）](https://leetcode.cn/problems/4sum/)

与三数之和差不多，都是双指针不过比三数之和多了一个for循环嵌套

```c++
class Solution {
public:
    vector<vector<int>> fourSum(vector<int>& nums, int target) {
        vector<vector<int>> result;
        sort(nums.begin(), nums.end());
        for (int i = 0; i < nums.size(); i++) {
            if (nums[i] > target && nums[i] >= 0) break;

            if (i > 0 && nums[i] == nums[i - 1]) continue;
            
            for (int j = i + 1; j < nums.size(); j++) {
                if (nums[i] + nums[j] > target && nums[i] + nums[j] >= 0) break;

                if (j > i + 1 && nums[j] == nums[j - 1]) continue;

                int left = j + 1;
                int right = nums.size() - 1;
                while (left < right) {
                    if ((long)nums[i] + nums[j] + nums[left] + nums[right] == target) {
                        result.push_back(vector<int> {nums[i], nums[j], nums[left], nums[right]});
                        while (left < right && nums[right] == nums[right - 1]) right--;
                        while (left < right && nums[left] == nums[left + 1]) left++;
                        right--;
                        left++;
                    }
                    else if ((long)nums[i] + nums[j] + nums[left] + nums[right] < target) left++;
                    else right--;
                }
            }
        }
        return result;
    }
};
```

