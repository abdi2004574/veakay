with open('backend-repo/src/modules/campaigns/campaigns.service.ts', 'r') as f:
    content = f.read()

old = 'prisma.\(async (tx) => {'
new = 'prisma.$transaction(async (tx) => {'
print('old repr:', repr(old))
print('found:', old in content)
content = content.replace(old, new)

with open('backend-repo/src/modules/campaigns/campaigns.service.ts', 'w') as f:
    f.write(content)
