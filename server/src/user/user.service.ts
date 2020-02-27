import {Inject, Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {User} from "./user.entity";

@Injectable()
export class PhotoService {
    constructor(
        @Inject('PHOTO_REPOSITORY')
        private readonly userRepository: Repository<User>,
    ) {}

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }
}