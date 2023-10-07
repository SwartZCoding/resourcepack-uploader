import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from "@ioc:Adonis/Core/Application";
import UploadValidator from "App/Validators/UploadValidator";
import {generateSHA1Token} from "App/Utils/encrypt";
import Pack from "App/Models/Pack";
import Drive from "@ioc:Adonis/Core/Drive";
import fs from 'fs/promises';

export default class UploadController {

  public async index({ view } : HttpContextContract) {
    return view.render('welcome')
  }

  public async uploadWithSite({ request, response }: HttpContextContract) {
    const payload = await request.validate(UploadValidator);
    const coverImage = payload.cover_image;
    await coverImage.move(Application.tmpPath('uploads'))
    const newName = generateSHA1Token(coverImage.fileName! + Date.now().toString());
    coverImage.fileName = newName
    const firstPath = coverImage.filePath!;
    const fileBuffer = await fs.readFile(firstPath);
    await Drive.put("./" + newName + ".zip", fileBuffer)
    await fs.unlink(firstPath);

    const pack = new Pack();
    pack.originalNameFile = newName;
    pack.sha1 = newName;
    await pack.save();

    return response.redirect().toRoute('download.page', { sha1: newName });
  }

  public async uploadWithApi({ request, response }: HttpContextContract) {
    const payload = await request.validate(UploadValidator);
    const coverImage = payload.cover_image;
    await coverImage.move(Application.tmpPath('uploads'))
    const newName = generateSHA1Token(coverImage.fileName! + Date.now().toString());
    coverImage.fileName = newName
    const firstPath = coverImage.filePath!;
    const fileBuffer = await fs.readFile(firstPath);
    await Drive.put("./" + newName + ".zip", fileBuffer)
    await fs.unlink(firstPath);

    const pack = new Pack();
    pack.originalNameFile = newName;
    pack.sha1 = newName;
    await pack.save();

    const fileUrl =  "http://localhost:3333" + await Drive.getUrl(pack.sha1 + '.zip');

    return response.json({ sha1: newName, link: fileUrl });
  }

  public async download({ params, response, view }: HttpContextContract) {
      // Get SHA 1 by params
      const { sha1 } = params;

      // Search pack correspond in database to the correct SHA1
      const pack = await Pack.findBy('sha1', sha1);

      if (!pack) {
        // If pack does not exist
        return response.json({ error: 'Pack not found.'});
      } else {
        const fileUrl =  "http://localhost:3333" + await Drive.getUrl(pack.sha1 + '.zip');

        return view.render('download', { sha1: pack.sha1, link: fileUrl })
      }
  }
}
