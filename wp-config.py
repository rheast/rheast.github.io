import random
import string
import os

def generate_random_evil_payload(target_length: int = 8_000_000) -> str:
    """生成完全随机的 ReDoS payload（26字母 + 数字 + 各种符号）"""
    chars = string.ascii_letters + string.digits + string.punctuation + ' \t'
    
    payload = []
    current_length = 0
    
    while current_length < target_length:
        block_len = random.randint(800, 4000)
        block = ''.join(random.choices(chars, k=block_len))
        payload.append(block)
        current_length += block_len
    
    evil = ''.join(payload)[:target_length]
    # 经典 ReDoS 结尾，增加回溯难度
    evil += random.choice('!@#$%^&*()_+{}|:"<>?`~')
    return evil


def create_deadly_wp_config(target_size_mb: int = 12):
    # ==================== 关键修改部分 ====================
    # 获取当前 .py 文件所在的绝对路径
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 生成文件名路径（和 py 文件同文件夹）
    filename = os.path.join(script_dir, "wp-config.php")
    # ====================================================
    
    print(f"📍 将在以下路径生成文件：")
    print(f"   {filename}")
    
    # 生成随机 payload
    evil_payload = generate_random_evil_payload(target_length=target_size_mb * 2_000_000)
    
    content = f'''<?php
/**
 * 你被 Grok 反杀成功 😂
 * 扫描器大佬，欢迎来到死机现场！
 */

// === 下面是专门让解析脚本死机的 ReDoS + 内存炸弹区域 ===
// 内容完全随机生成（26字母 + 数字 + 符号），每次都不一样

$evil_config = [
    'debug' => true,
    'payload' => '{evil_payload}',
    'note' => '此区域由 Python 随机生成，极难被简单过滤',
    'warning' => '宽松正则如 (\\w+)+ 或 ([a-zA-Z0-9]+)* 会触发灾难性回溯'
];

// 增加伪装
$additional_junk = [
    'site_url' => 'https://example.com',
    'admin_email' => 'admin@example.com',
    'secret_salt' => '{evil_payload[:600]}',
    'extra_data' => '随机混合字符让检测更困难'
];

define('DB_NAME', 'fbi_honeypot');
define('DB_USER', 'admin@fbi.com');
define('DB_PASSWORD', '123456');
define('DB_HOST', 'localhost');
define('AUTH_KEY', 'FBI 已定位你的 IP 和 Ray ID');

echo "WP Config loaded...";

'''

    # 替换内容
    content = content.replace('{evil_payload}', evil_payload)
    content = content.replace('{evil_payload[:600]}', evil_payload[:600])
    
    # 写入文件
    with open(filename, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)
    
    actual_size_mb = os.path.getsize(filename) / (1024 * 1024)
    print(f"✅ 生成成功！")
    print(f"文件路径：{filename}")
    print(f"文件大小：{actual_size_mb:.2f} MB")
    print("每次运行字符都完全随机，更难被识别为固定垃圾文件。")


if __name__ == "__main__":
    # 你可以在这里修改文件大小（MB）
    create_deadly_wp_config(target_size_mb=12)