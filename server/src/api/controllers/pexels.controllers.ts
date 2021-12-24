import { Request, Response } from "express"
import { PexelsService } from '../services/pexels.services';

export const pexelsGetPhotoById = async (req: Request, res: Response) => {
    const photoId = Number(req.params.id);

    const pexelsService = new PexelsService();

    try {
        const response = await pexelsService.findPhotoById(photoId);

        if (response) {
            res.send(response);
        }
    } catch(error) {
        console.log(error);
    }
};
