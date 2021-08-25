import { inject, injectable } from "inversify";
import { Transaction } from "sequelize/types";
import { AppUtils } from "../common/app-utils";
import { Logger } from "../common/logger";
import { GymRepository } from "../repositories/gym-repository";
import { AppDBConnection } from "./../config/database";
import { Consts } from "./../common/consts";
// const S3 = require("aws-sdk/clients/s3");
import * as AWS from "aws-sdk";
import * as fs from "fs";
require("dotenv").config();

@injectable()
export class FileUploadService {
  public s3: AWS.S3;

  constructor(@inject(Logger) private logger: Logger) {
    this.s3 = new AWS.S3({
      region: process.env.AWS_BUCKET_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    });
  }

  public upload = async (file: any): Promise<any> => {
    const fileStream = fs.createReadStream(file.path);
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Body: fileStream,
      Key: file.filename,
    };

    return this.s3.upload(uploadParams).promise();
  };

  public delete = async (url: string): Promise<void> => {};

  public getFileStream = async (fileKey: any): Promise<any> => {
    const downloadParams = {
      Key: fileKey,
      Bucket: process.env.AWS_BUCKET_NAME,
    };

    return this.s3.getObject(downloadParams).createReadStream();
  };
}
