import pexels from 'pexels';

export class PexelsService {
    private client;

    constructor() {
        this.client = pexels.createClient(process.env.PEXELS_API_KEY);
    }

    async findPhotoById(photoId: number) {
        return await this.client.photos.show({
            id: photoId,
        });
    }
};
