with open('backend-repo/src/modules/packages/packages.service.spec.ts', 'r') as f:
    content = f.read()

# Update test: mock findMany return value
content = content.replace(
    """    it('replaces the full media list when mediaMediaIds is provided', async () => {
      prisma.package.findUnique.mockResolvedValue({
        id: 'pkg-1',
        agencyId: 'agency-1',
      });
      prisma.package.update.mockResolvedValue({
        id: 'pkg-1',
        media: [],
        agency: null,
        basePrice: '2500',
      });

      prisma.agency.findUnique.mockResolvedValue({
        id: 'agency-1',
        status: 'approved',
      });

      await service.update('pkg-1', 'agency-1', {
        mediaMediaIds: ['media-2', 'media-3'],
      });

      expect(prisma.packageMedia.deleteMany).toHaveBeenCalledWith({
        where: { packageId: 'pkg-1' },
      });
      expect(prisma.packageMedia.createMany).toHaveBeenCalledWith({
        data: [
          { packageId: 'pkg-1', mediaId: 'media-2', displayOrder: 0 },
          { packageId: 'pkg-1', mediaId: 'media-3', displayOrder: 1 },
        ],
      });
    });""",
    """    it('replaces the full media list when mediaMediaIds is provided', async () => {
      prisma.package.findUnique.mockResolvedValue({
        id: 'pkg-1',
        agencyId: 'agency-1',
      });
      prisma.packageMedia.findMany.mockResolvedValue([]);
      prisma.package.update.mockResolvedValue({
        id: 'pkg-1',
        media: [],
        agency: null,
        basePrice: '2500',
      });

      prisma.agency.findUnique.mockResolvedValue({
        id: 'agency-1',
        status: 'approved',
      });

      await service.update('pkg-1', 'agency-1', {
        mediaMediaIds: ['media-2', 'media-3'],
      });

      expect(prisma.packageMedia.deleteMany).toHaveBeenCalledWith({
        where: { packageId: 'pkg-1' },
      });
      expect(prisma.packageMedia.createMany).toHaveBeenCalledWith({
        data: [
          { packageId: 'pkg-1', mediaId: 'media-2', displayOrder: 0 },
          { packageId: 'pkg-1', mediaId: 'media-3', displayOrder: 1 },
        ],
      });
    });"""
)

# Remove test: mock findMany return value
content = content.replace(
    """    it('deletes an owned package', async () => {
      prisma.package.findUnique.mockResolvedValue({
        id: 'pkg-1',
        agencyId: 'agency-1',
      });

      prisma.agency.findUnique.mockResolvedValue({
        id: 'agency-1',
        status: 'approved',
      });

      await service.remove('pkg-1', 'agency-1');

      expect(prisma.package.delete).toHaveBeenCalledWith({
        where: { id: 'pkg-1' },
      });
    });""",
    """    it('deletes an owned package', async () => {
      prisma.package.findUnique.mockResolvedValue({
        id: 'pkg-1',
        agencyId: 'agency-1',
      });
      prisma.packageMedia.findMany.mockResolvedValue([]);

      prisma.agency.findUnique.mockResolvedValue({
        id: 'agency-1',
        status: 'approved',
      });

      await service.remove('pkg-1', 'agency-1');

      expect(prisma.package.delete).toHaveBeenCalledWith({
        where: { id: 'pkg-1' },
      });
    });"""
)

with open('backend-repo/src/modules/packages/packages.service.spec.ts', 'w') as f:
    f.write(content)

print('packages.service.spec.ts updated')
