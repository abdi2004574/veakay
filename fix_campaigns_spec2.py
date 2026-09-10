with open('backend-repo/src/modules/campaigns/campaigns.service.spec.ts', 'r') as f:
    content = f.read()

# Update test: mock findMany return value
content = content.replace(
    """    it('replaces the full photo set when photoMediaIds is provided', async () => {
      prisma.campaign.findUnique.mockResolvedValue({
        id: 'c-1',
        creatorId: 'user-1',
      });
      prisma.campaign.update.mockResolvedValue({ id: 'c-1', photos: [] });

      await service.update('c-1', 'user-1', {
        photoMediaIds: ['media-2', 'media-3'],
      });

      expect(prisma.campaignPhoto.deleteMany).toHaveBeenCalledWith({
        where: { campaignId: 'c-1' },
      });
      expect(prisma.campaignPhoto.createMany).toHaveBeenCalledWith({
        data: [
          { campaignId: 'c-1', mediaId: 'media-2', position: 0 },
          { campaignId: 'c-1', mediaId: 'media-3', position: 1 },
        ],
      });
    });""",
    """    it('replaces the full photo set when photoMediaIds is provided', async () => {
      prisma.campaign.findUnique.mockResolvedValue({
        id: 'c-1',
        creatorId: 'user-1',
      });
      prisma.campaignPhoto.findMany.mockResolvedValue([]);
      prisma.campaign.update.mockResolvedValue({ id: 'c-1', photos: [] });

      await service.update('c-1', 'user-1', {
        photoMediaIds: ['media-2', 'media-3'],
      });

      expect(prisma.campaignPhoto.deleteMany).toHaveBeenCalledWith({
        where: { campaignId: 'c-1' },
      });
      expect(prisma.campaignPhoto.createMany).toHaveBeenCalledWith({
        data: [
          { campaignId: 'c-1', mediaId: 'media-2', position: 0 },
          { campaignId: 'c-1', mediaId: 'media-3', position: 1 },
        ],
      });
    });"""
)

# Remove test: mock findMany return value
content = content.replace(
    """    it('deletes an owned campaign with no donation guard (none exist yet)', async () => {
      prisma.campaign.findUnique.mockResolvedValue({
        id: 'c-1',
        creatorId: 'user-1',
      });

      await service.remove('c-1', 'user-1');

      expect(prisma.campaign.delete).toHaveBeenCalledWith({
        where: { id: 'c-1' },
      });
    });""",
    """    it('deletes an owned campaign with no donation guard (none exist yet)', async () => {
      prisma.campaign.findUnique.mockResolvedValue({
        id: 'c-1',
        creatorId: 'user-1',
      });
      prisma.campaignPhoto.findMany.mockResolvedValue([]);

      await service.remove('c-1', 'user-1');

      expect(prisma.campaign.delete).toHaveBeenCalledWith({
        where: { id: 'c-1' },
      });
    });"""
)

with open('backend-repo/src/modules/campaigns/campaigns.service.spec.ts', 'w') as f:
    f.write(content)

print('campaigns.service.spec.ts updated')
