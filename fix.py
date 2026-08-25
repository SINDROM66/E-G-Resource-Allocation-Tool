import os

path = r'c:\Users\HP\Desktop\E&G-RESOURCE ALLOCATION TOOL\nssf-eg-app\src\pages\Personalisation.jsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('A-', '×')
c = c.replace('?"', '—')
c = c.replace('?"', '—')

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print('done')
