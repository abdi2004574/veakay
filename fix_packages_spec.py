with open('backend-repo/src/modules/packages/packages.service.spec.ts', 'r') as f:
    content = f.read()

content = content.replace(
    'packageMedia: { deleteMany: jest.fn(), createMany: jest.fn() }',
    'packageMedia: { deleteMany: jest.fn(), createMany: jest.fn(), findMany: jest.fn() }'
)

content = content.replace(
    "mediaAssetsService = {\n      resolveViewUrls: jest.fn().mockResolvedValue(new Map()),\n    };",
    "mediaAssetsService = {\n      resolveViewUrls: jest.fn().mockResolvedValue(new Map()),\n      cleanupMediaAssets: jest.fn().mockResolvedValue(undefined),\n    };"
)

with open('backend-repo/src/modules/packages/packages.service.spec.ts', 'w') as f:
    f.write(content)

print('packages.service.spec.ts updated')
