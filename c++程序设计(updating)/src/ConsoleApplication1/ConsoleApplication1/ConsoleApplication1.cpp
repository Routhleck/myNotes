// ConsoleApplication1.cpp : 此文件包含 "main" 函数。程序执行将在此处开始并结束。
//

#include <iostream>
#include <algorithm>
// 随机生成一个数组
int* generateRandomArray(int size, int value)
{
	int* arr = new int[size];
	for (int i = 0; i < size; i++)
	{
		arr[i] = rand() % value;
	}
	return arr;
}

// 给定递增数组/序列arr和指定元素element，返回元素第一次出现的下标
int binarySearch(int arr[], int element, int length)
{
	int low = 0;
	int high = length - 1;
	while (low <= high)
	{
		int mid = (low + high) / 2;
		if (arr[mid] == element)
		{
			return mid;
		}
		else if (arr[mid] > element)
		{
			high = mid - 1;
		}
		else
		{
			low = mid + 1;
		}
	}
	return -1;
}

int main()
{
	int* arr = generateRandomArray(10, 100);
	int checkNum = 0;
	// 将数组使用sort从小到大
	std::sort(arr, arr + 10);
	
	for (int i = 0; i < 10; i++)
	{
		std::cout << arr[i] << " ";
	}
	std::cout << std::endl;
	std::cout << "输入要查找的值:";
	std::cin >> checkNum;
	int index = binarySearch(arr, checkNum, 10);
	
	if (index == -1)
	{
		std::cout << "未找到" << std::endl;
	}
	else  
	{
		std::cout << "找到，下标为：" << index << std::endl;
	}
	
}

// 运行程序: Ctrl + F5 或调试 >“开始执行(不调试)”菜单
// 调试程序: F5 或调试 >“开始调试”菜单

// 入门使用技巧: 
//   1. 使用解决方案资源管理器窗口添加/管理文件
//   2. 使用团队资源管理器窗口连接到源代码管理
//   3. 使用输出窗口查看生成输出和其他消息
//   4. 使用错误列表窗口查看错误
//   5. 转到“项目”>“添加新项”以创建新的代码文件，或转到“项目”>“添加现有项”以将现有代码文件添加到项目
//   6. 将来，若要再次打开此项目，请转到“文件”>“打开”>“项目”并选择 .sln 文件
