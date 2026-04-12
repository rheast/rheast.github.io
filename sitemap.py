import os
from datetime import datetime

current_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(current_dir, "sitemap.xml")
current_date = datetime.now().strftime("%Y-%m-%d")

content = f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://rheast.com/</loc>
        <lastmod>{current_date}</lastmod>
        <priority>1.0</priority>
    </url>
</urlset>
'''

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("sitemap.xml 已生成到：", file_path)