import { Test, TestingModule } from "@nestjs/testing";
import { PostResolver } from "../post.resolver";
import { PostService } from "../post.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Post } from "../post.entity";
import { Repository } from "typeorm";

describe('PostResolver', () => {
  let resolver: PostResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostResolver,
        PostService,
        {
          provide: getRepositoryToken(Post),
          useClass: Repository,
        },
      ],
    }).compile();

    resolver = module.get<PostResolver>(PostResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
