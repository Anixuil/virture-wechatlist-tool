#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成账单数据的Python脚本
根据年份、月份、时间范围、总金额生成交易数据
"""

import json
import random
from datetime import datetime, timedelta
from typing import List, Dict
import argparse

# 常见汉字姓氏和名字
CHINESE_CHARS = [
    '伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '军', '洋',
    '勇', '艳', '杰', '涛', '明', '超', '秀', '霞', '平', '刚',
    '桂', '英', '华', '文', '辉', '丽', '娟', '红', '梅', '婷',
    '健', '峰', '鹏', '飞', '龙', '俊', '浩', '鑫', '怡', '倩',
    '洁', '莹', '亮', '丹', '慧', '阳', '威', '云', '雨', '晨',
    '宇', '瑞', '嘉', '悦', '博', '琳', '颖', '超', '倩', '雯',
    '子', '轩', '景', '太', '汀', '影', '乐', 'l', 'f', 'a',
    'b', 'c', 'd', 'e', 'g', 'h', 'i', 'j', 'k', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
    'x', 'y', 'z'
]

def generate_recipient() -> str:
    """生成recipient，格式为*+汉字或字母"""
    char = random.choice(CHINESE_CHARS)
    return f"*{char}"

def parse_time(time_str: str) -> datetime:
    """解析时间字符串 (格式: HH:MM)"""
    hour, minute = map(int, time_str.split(':'))
    return datetime(2000, 1, 1, hour, minute)

def format_time(dt: datetime) -> str:
    """格式化时间为 HH:MM"""
    return dt.strftime("%H:%M")

def generate_transactions(
    year: int,
    month: int,
    day: int,
    start_time: str,
    end_time: str,
    total_amount: float
) -> List[Dict]:
    """
    生成交易数据
    
    Args:
        year: 年份
        month: 月份
        day: 日期
        start_time: 开始时间 (格式: HH:MM)
        end_time: 结束时间 (格式: HH:MM)
        total_amount: 总金额
    
    Returns:
        交易数据列表
    """
    # 解析时间范围
    start_dt = parse_time(start_time)
    end_dt = parse_time(end_time)
    
    if start_dt >= end_dt:
        raise ValueError("开始时间必须早于结束时间")
    
    # 可用的交易金额
    valid_amounts = [5, 10, 15]
    
    # 计算时间范围（秒）
    time_range_seconds = (end_dt - start_dt).total_seconds()
    
    # 估算需要多少笔交易（基于平均金额）
    avg_amount = sum(valid_amounts) / len(valid_amounts)
    estimated_transactions = max(1, int(total_amount / avg_amount))
    
    # 计算时间间隔，使交易分布在整的时间范围内
    if estimated_transactions > 1:
        time_interval_seconds = time_range_seconds / (estimated_transactions - 1)
    else:
        time_interval_seconds = 0
    
    transactions = []
    remaining_amount = total_amount
    current_time = end_dt  # 从结束时间开始，倒序生成
    transaction_index = 0
    
    while remaining_amount > 0:
        # 如果时间已经超出范围，在开始时间创建剩余交易
        if current_time < start_dt:
            # 如果还有剩余金额，在开始时间创建
            if remaining_amount > 0:
                transaction_time = datetime(year, month, day, start_dt.hour, start_dt.minute)
                transaction_id = str(int(transaction_time.timestamp() * 1000))
                transaction = {
                    "id": transaction_id,
                    "type": "income",
                    "amount": round(remaining_amount, 2),
                    "description": "二维码收款-来自",
                    "date": f"{month}月{day}日",
                    "time": format_time(start_dt),
                    "recipient": generate_recipient()
                }
                transactions.append(transaction)
            break
        
        # 选择交易金额
        # 如果剩余金额小于最小金额，使用剩余金额
        if remaining_amount < 5:
            amount = round(remaining_amount, 2)
        else:
            # 选择可用的金额，但不能超过剩余金额
            available_amounts = [a for a in valid_amounts if a <= remaining_amount]
            if not available_amounts:
                amount = round(remaining_amount, 2)
            else:
                amount = random.choice(available_amounts)
        
        # 生成交易ID（使用时间戳）
        transaction_time = datetime(year, month, day, current_time.hour, current_time.minute)
        transaction_id = str(int(transaction_time.timestamp() * 1000))
        
        # 生成交易数据
        transaction = {
            "id": transaction_id,
            "type": "income",
            "amount": amount,
            "description": "二维码收款-来自",
            "date": f"{month}月{day}日",
            "time": format_time(current_time),
            "recipient": generate_recipient()
        }
        
        transactions.append(transaction)
        remaining_amount -= amount
        
        # 向前移动时间（倒序）
        # 添加一些随机性，使时间分布更自然
        if time_interval_seconds > 0:
            random_offset = random.randint(-30, 30)  # ±30秒随机偏移
            time_delta = timedelta(seconds=max(30, time_interval_seconds + random_offset))
        else:
            time_delta = timedelta(seconds=random.randint(30, 180))
        
        current_time = current_time - time_delta
        transaction_index += 1
    
    # 按时间倒序排列（最新的在前面）
    transactions.sort(key=lambda x: (x['time'], x['id']), reverse=True)
    
    return transactions

def generate_bill_json(
    year: int,
    month: int,
    day: int,
    start_time: str,
    end_time: str,
    total_amount: float,
    output_file: str = "bill-config.json"
) -> Dict:
    """
    生成完整的账单JSON数据
    
    Args:
        year: 年份
        month: 月份
        day: 日期
        start_time: 开始时间 (格式: HH:MM)
        end_time: 结束时间 (格式: HH:MM)
        total_amount: 总金额
        output_file: 输出文件名
    
    Returns:
        账单数据字典
    """
    # 生成交易数据
    transactions = generate_transactions(
        year, month, day, start_time, end_time, total_amount
    )
    
    # 计算实际总金额
    actual_total = sum(t['amount'] for t in transactions)
    
    # 构建账单数据
    bill_data = {
        "title": "账单",
        "filterOptions": [
            "二维码收付款",
            "查找交易"
        ],
        "monthlyBills": [
            {
                "year": year,
                "month": month,
                "totalIncome": actual_total,
                "totalExpense": 0,
                "transactions": transactions
            }
        ]
    }
    
    # 保存到文件
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(bill_data, f, ensure_ascii=False, indent=2)
    
    print(f"[成功] 生成账单数据!")
    print(f"  - 交易数量: {len(transactions)}")
    print(f"  - 总金额: {actual_total} 元")
    print(f"  - 时间范围: {start_time} ~ {end_time}")
    print(f"  - 输出文件: {output_file}")
    
    return bill_data

def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='生成账单数据')
    parser.add_argument('--year', type=int, default=2025, help='年份 (默认: 2025)')
    parser.add_argument('--month', type=int, default=10, help='月份 (默认: 10)')
    parser.add_argument('--day', type=int, default=25, help='日期 (默认: 25)')
    parser.add_argument('--start-time', type=str, default='13:50', help='开始时间 (格式: HH:MM, 默认: 13:50)')
    parser.add_argument('--end-time', type=str, default='16:00', help='结束时间 (格式: HH:MM, 默认: 16:00)')
    parser.add_argument('--total-amount', type=float, required=True, help='总金额 (必需)')
    parser.add_argument('--output', type=str, default='bill-config.json', help='输出文件名 (默认: bill-config.json)')
    
    args = parser.parse_args()
    
    try:
        generate_bill_json(
            year=args.year,
            month=args.month,
            day=args.day,
            start_time=args.start_time,
            end_time=args.end_time,
            total_amount=args.total_amount,
            output_file=args.output
        )
    except Exception as e:
        print(f"[失败] 生成失败: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())

