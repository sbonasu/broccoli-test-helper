"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const broccoli_test_helper_1 = require("broccoli-test-helper");
const chai_1 = require("chai");
const fs = require("fs");
describe("createTempDir", () => {
    let subject;
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        subject = yield broccoli_test_helper_1.createTempDir();
    }));
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        yield subject.dispose();
        subject = undefined;
    }));
    it("should support writing", () => {
        subject.write({
            "file.txt": "hello world",
            lib: {},
        });
        chai_1.expect(fs.readdirSync(subject.path())).to.deep.equal(["file.txt", "lib"]);
        chai_1.expect(fs.readFileSync(subject.path("file.txt"), "utf8")).to.equal("hello world");
        subject.write({
            "more.txt": "another",
        }, "lib");
        chai_1.expect(fs.readFileSync(subject.path("lib/more.txt"), "utf8")).to.equal("another");
        subject.write({
            // tslint:disable-next-line object-literal-key-quotes
            lib: null,
        });
        chai_1.expect(fs.readdirSync(subject.path())).to.deep.equal(["file.txt"]);
    });
    it("should support writing binary", () => {
        const expected = "R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
        subject.writeBinary("images/test.gif", Buffer.from(expected, "base64"));
        chai_1.expect(fs.readFileSync(subject.path("images/test.gif")).toString("base64")).to.equal(expected);
    });
    it("should support reading binary", () => {
        const expected = "R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
        fs.writeFileSync(subject.path("test.gif"), Buffer.from(expected, "base64"));
        chai_1.expect(subject.readBinary("test.gif").toString("base64")).to.equal(expected);
    });
    it("should support writing text with encoding", () => {
        subject.writeText("texts/ucs2.txt", "\ud801\udc37", "ucs2");
        subject.writeText("texts/utf8.txt", "\ud801\udc37", "utf8");
        chai_1.expect(fs.readFileSync(subject.path("texts/ucs2.txt"), "hex")).to.equal("01d837dc");
        chai_1.expect(fs.readFileSync(subject.path("texts/utf8.txt"), "hex")).to.equal("f09090b7");
    });
    it("should return undefined on a missing file when reading binary", () => {
        chai_1.expect(subject.readText("missing.txt", "ucs2")).to.equal(undefined);
        chai_1.expect(subject.readBinary("image.gif")).to.equal(undefined);
    });
    it("should support reading text with encoding", () => {
        fs.writeFileSync(subject.path("ucs2.txt"), "01d837dc", "hex");
        fs.writeFileSync(subject.path("utf8.txt"), "f09090b7", "hex");
        chai_1.expect(subject.readText("ucs2.txt", "ucs2")).to.equal("\ud801\udc37");
        chai_1.expect(subject.readText("utf8.txt", "utf8")).to.equal("\ud801\udc37");
    });
    it("should support making a directory", () => {
        subject.makeDir("images");
        chai_1.expect(fs.statSync(subject.path("images")).isDirectory()).to.equal(true);
    });
    it("should support reading a directory", () => {
        chai_1.expect(subject.readDir()).to.deep.equal([]);
        subject.write({
            dist: {
                "index.js": "",
                tests: {
                    "test.js": "",
                },
            },
            "package.json": "",
            src: {
                "index.ts": "",
            },
            styles: { "app.css": "" },
            tests: {
                "test.ts": "",
            },
        });
        chai_1.expect(subject.readDir()).to.deep.equal([
            "dist/",
            "dist/index.js",
            "dist/tests/",
            "dist/tests/test.js",
            "package.json",
            "src/",
            "src/index.ts",
            "styles/",
            "styles/app.css",
            "tests/",
            "tests/test.ts",
        ]);
        chai_1.expect(subject.readDir("dist")).to.deep.equal([
            "index.js",
            "tests/",
            "tests/test.js",
        ]);
        chai_1.expect(subject.readDir("dist", { directories: false })).to.deep.equal([
            "index.js",
            "tests/test.js",
        ]);
        chai_1.expect(subject.readDir({
            directories: false,
        })).to.deep.equal([
            "dist/index.js",
            "dist/tests/test.js",
            "package.json",
            "src/index.ts",
            "styles/app.css",
            "tests/test.ts",
        ]);
        chai_1.expect(subject.readDir({
            directories: false,
            include: ["**/*.js"],
        })).to.deep.equal(["dist/index.js", "dist/tests/test.js"]);
        chai_1.expect(subject.readDir("dist", {
            directories: false,
            include: ["**/*.js"],
        })).to.deep.equal(["index.js", "tests/test.js"]);
        chai_1.expect(subject.readDir({
            directories: false,
            exclude: ["dist/tests"],
            include: ["dist/**"],
        })).to.deep.equal(["dist/index.js"]);
        chai_1.expect(subject.readDir("dist/index.js")).to.be.equal(undefined);
        chai_1.expect(subject.readDir("missing")).to.be.equal(undefined);
    });
    it("should support globs in reading", () => {
        subject.write({
            dist: {
                "index.js": "",
                tests: {
                    "test.js": "",
                },
            },
            "package.json": "",
            src: {
                "index.ts": "",
            },
            styles: { "app.css": "" },
            tests: {
                "test.ts": "",
            },
        });
        chai_1.expect(subject.read({
            exclude: ["dist/tests"],
            include: ["src/**", "dist/**"],
        })).to.deep.equal({
            dist: {
                "index.js": "",
            },
            src: {
                "index.ts": "",
            },
        });
        chai_1.expect(subject.read({
            include: ["**/*.js"],
        })).to.deep.equal({
            dist: {
                "index.js": "",
                tests: {
                    "test.js": "",
                },
            },
        });
        chai_1.expect(subject.read("dist", {
            include: ["**/test.js"],
        })).to.deep.equal({
            tests: {
                "test.js": "",
            },
        });
    });
    it("should support changes", () => __awaiter(this, void 0, void 0, function* () {
        chai_1.expect(subject.changes()).to.deep.equal({});
        subject.write({
            "hello.txt": "hello",
            lib: { "more.txt": "more" },
        });
        chai_1.expect(subject.changes()).to.deep.equal({
            "hello.txt": "create",
            "lib/": "mkdir",
            "lib/more.txt": "create",
        });
        subject.write({
            "hello.txt": "goodbye",
            lib: null,
        });
        chai_1.expect(subject.changes()).to.deep.equal({
            "lib/more.txt": "unlink",
            // tslint:disable-next-line object-literal-sort-keys
            "lib/": "rmdir",
            "hello.txt": "change",
        });
        chai_1.expect(subject.read()).to.deep.equal({
            "hello.txt": "goodbye",
        });
    }));
    it("should support reading", () => {
        fs.writeFileSync(subject.path("file.txt"), "hello world");
        fs.mkdirSync(subject.path("lib"));
        fs.writeFileSync(subject.path("lib/more.txt"), "another");
        chai_1.expect(subject.read()).to.deep.equal({
            "file.txt": "hello world",
            lib: {
                "more.txt": "another",
            },
        });
        chai_1.expect(subject.read("lib")).to.deep.equal({
            "more.txt": "another",
        });
    });
    it("should support copy from fixture path", () => {
        subject.copy("tests/fixtures/a");
        chai_1.expect(fs.readdirSync(subject.path())).to.deep.equal(["index.js", "lib"]);
        chai_1.expect(fs.readFileSync(subject.path("index.js"), "utf8")).to.equal('export * from "./lib/a";\n');
        chai_1.expect(fs.readdirSync(subject.path("lib"))).to.deep.equal(["a.js"]);
        chai_1.expect(fs.readFileSync(subject.path("lib/a.js"), "utf8")).to.equal("export class A {}\n");
        subject.copy("tests/fixtures/a", "lib");
        chai_1.expect(fs.readdirSync(subject.path("lib"))).to.deep.equal([
            "a.js",
            "index.js",
            "lib",
        ]);
        chai_1.expect(fs.readFileSync(subject.path("lib/index.js"), "utf8")).to.equal('export * from "./lib/a";\n');
        chai_1.expect(fs.readdirSync(subject.path("lib/lib"))).to.deep.equal(["a.js"]);
        chai_1.expect(fs.readFileSync(subject.path("lib/lib/a.js"), "utf8")).to.equal("export class A {}\n");
    });
    it("should remove tmp dir on dispose", () => __awaiter(this, void 0, void 0, function* () {
        yield subject.dispose();
        chai_1.expect(() => {
            subject.read();
        }).to.throw(/ENOENT/);
    }));
    it("writing outside of tmp with subpath should fail", () => {
        chai_1.expect(() => {
            subject.write({}, "..");
        }).throws(/subpath should not escape directory/);
    });
});
//# sourceMappingURL=create_temp_dir_test.js.map