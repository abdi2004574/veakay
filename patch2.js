const fs = require('fs');
const path = 'C:\\Users\\LENOVO\\Desktop\\veakay-handoff\\backend-repo\\src\\modules\\campaigns\\campaigns.service.ts';
let content = fs.readFileSync(path, 'utf8');

const newMethod = `async remove(campaignId: string, creatorId: string) {
    await this.findOwnedOrThrow(campaignId, creatorId);

    const photos = await this.prisma.campaignPhoto.findMany({
      where: { campaignId },
      select: { mediaId: true },
    });
    const mediaIds = photos.map((p) => p.mediaId);

    await this.prisma.campaign.update({
      where: { id: campaignId },
      data: {
        deletedAt: new Date(),
        deletedById: creatorId,
      },
    });

    if (mediaIds.length > 0) {
      await this.mediaAssetsService.cleanupMediaAssets(mediaIds);
    }
  }`;

content = content.replace(
  /async remove\(campaignId: string, creatorId: string\) \{[\s\S]*?^\s+\}/m,
  newMethod
);

fs.writeFileSync(path, content);
console.log('Done');
