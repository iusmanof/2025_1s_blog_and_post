"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const inversify_1 = require("inversify");
const posts_repository_1 = __importDefault(require("../infrastructure/posts.repository"));
const post_entity_1 = require("../domain/post.entity");
let PostService = class PostService {
    constructor(postsRepository) {
        this.postsRepository = postsRepository;
    }
    create(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const postEntity = new post_entity_1.PostEntity(body);
            const post = yield this.postsRepository.createPost(postEntity);
            const _a = post.toObject(), { _id, __v } = _a, rest = __rest(_a, ["_id", "__v"]);
            return Object.assign(Object.assign({}, rest), { id: _id.toString() });
        });
    }
    findMany(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.getAllPosts(query);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.getPostById(id);
        });
    }
    update(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.updatePost(id, body);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.deletePost(id);
        });
    }
};
exports.PostService = PostService;
exports.PostService = PostService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(posts_repository_1.default)),
    __metadata("design:paramtypes", [posts_repository_1.default])
], PostService);
//# sourceMappingURL=post.service.js.map