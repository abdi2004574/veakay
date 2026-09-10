with open('backend-repo/src/modules/campaigns/campaigns.service.spec.ts', 'r') as f:
    content = f.read()

content = content.replace(
    'campaignPhoto: { deleteMany: jest.fn(), createMany: jest.fn() }',
    'campaignPhoto: { deleteMany: jest.fn(), createMany: jest.fn(), findMany: jest.fn() }'
)

content = content.replace(
    "mediaAssetsService = {\n      resolveViewUrls: jest.fn().mockResolvedValue(new Map()),\n    };",
    "mediaAssetsService = {\n      resolveViewUrls: jest.fn().mockResolvedValue(new Map()),\n      cleanupMediaAssets: jest.fn().mockResolvedValue(undefined),\n    };"
)

with open('backend-repo/src/modules/campaigns/campaigns.service.spec.ts', 'w') as f:
    f.write(content)

print('campaigns.service.spec.ts updated')
